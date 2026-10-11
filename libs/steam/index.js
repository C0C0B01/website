import "dotenv/config";

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID_RAW  = process.env.STEAM_ID;

if (!STEAM_API_KEY || !STEAM_ID_RAW) {
  console.error("Error: STEAM_API_KEY and STEAM_ID must be set in your .env file.");
  process.exit(1);
}

const BASE = "https://api.steampowered.com";

const logoUrl = (appId) =>
  `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/logo.png`;

async function steamGet(path, params = {}) {
  const url = new URL(`${BASE}/${path}`);
  url.searchParams.set("key", STEAM_API_KEY);
  url.searchParams.set("format", "json");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Steam API error ${res.status}: ${url}`);
  return res.json();
}

async function resolveSteamId(input) {
  if (/^\d{17}$/.test(input)) return input;

  const data = await steamGet("ISteamUser/ResolveVanityURL/v1", {
    vanityurl: input,
    url_type: 1,
  });

  if (data?.response?.success !== 1) {
    throw new Error(
      `Could not resolve Steam username "${input}". ` +
      `Check STEAM_ID in .env — use your profile URL name or 64-bit ID.`
    );
  }

  return data.response.steamid;
}

export async function getCurrentlyPlaying() {
  const steamId = await resolveSteamId(STEAM_ID_RAW);

  const data = await steamGet("ISteamUser/GetPlayerSummaries/v2", { steamids: steamId });
  const player = data?.response?.players?.[0];
  if (!player?.gameid) return null;

  return {
    appId:  Number(player.gameid),
    name:   player.gameextrainfo ?? "Unknown",
    imageUrl: logoUrl(player.gameid),
  };
}

export async function getRecentlyPlayed() {
  const steamId = await resolveSteamId(STEAM_ID_RAW);

  const data = await steamGet("IPlayerService/GetRecentlyPlayedGames/v1", {
    steamid: steamId,
    count: 0,
  });

  return (data?.response?.games ?? []).map((g) => ({
    appId:                g.appid,
    name:                 g.name,
    playtimeLastTwoWeeks: g.playtime_2weeks,
    playtimeForever:      g.playtime_forever,
    imageUrl:             logoUrl(g.appid),
  }));
}

export async function getTopPlayed() {
  const games = await getRecentlyPlayed();

  if (games.length === 0) return null;

  const topGame = games.reduce((prev, current) => {
    return (current.playtimeLastTwoWeeks > prev.playtimeLastTwoWeeks) 
      ? current 
      : prev;
  });

  return({ imageUrl: topGame.imageUrl, name: topGame.name });
}
