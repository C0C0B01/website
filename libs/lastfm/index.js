import "dotenv/config";

const LASTFM_KEY  = process.env.LASTFM_API_KEY;
const LASTFM_USER = process.env.LASTFM_USERNAME;

if (!LASTFM_KEY || !LASTFM_USER) {
  console.error("Error: LASTFM_API_KEY and LASTFM_USERNAME must be set in your .env file.");
  process.exit(1);
}

const BASE         = "https://ws.audioscrobbler.com/2.0/";
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

async function lfmGet(method, params = {}) {
  const url = new URL(BASE);
  url.searchParams.set("method",  method);
  url.searchParams.set("user",    LASTFM_USER);
  url.searchParams.set("api_key", LASTFM_KEY);
  url.searchParams.set("format",  "json");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Last.fm API error ${res.status}: ${url}`);
  const data = await res.json();
  if (data.error) throw new Error(`Last.fm error ${data.error}: ${data.message}`);
  return data;
}

function pickImage(images) {
  if (!Array.isArray(images)) return null;
  const order = ["extralarge", "large", "medium", "small"];
  for (const size of order) {
    const found = images.find((i) => i.size === size && i["#text"]);
    if (found) return found["#text"];
  }
  return null;
}

export async function getCurrentlyPlaying() {
  const data = await lfmGet("user.getRecentTracks", { limit: 1 });
  const tracks = data.recenttracks?.track ?? [];
  const track = Array.isArray(tracks) ? tracks[0] : tracks;

  if (!track?.["@attr"]?.nowplaying) return null;

  return {
    name:      track.name,
    artist:    track.artist?.["#text"] ?? null,
    album:     track.album?.["#text"] ?? null,
    url:       track.url ?? null,
    imageUrl:  pickImage(track.image),
  };
}

async function getRecentTracks() {
  const from  = Math.floor((Date.now() - TWO_DAYS_MS) / 1000);
  const limit = 200;
  const tracks = [];
  let page = 1;
  let totalPages = 1;

  do {
    const data = await lfmGet("user.getRecentTracks", { from, limit, page });
    const attr  = data.recenttracks?.["@attr"];
    totalPages  = Number(attr?.totalPages ?? 1);

    const raw = data.recenttracks?.track ?? [];
    const batch = Array.isArray(raw) ? raw : [raw];

    for (const t of batch) {
      if (t["@attr"]?.nowplaying) continue;

      tracks.push({
        name:      t.name,
        artist:    t.artist?.["#text"] ?? null,
        album:     t.album?.["#text"] ?? null,
        scrobbledAt: t.date?.["#text"] ?? null,
        url:       t.url ?? null,
        imageUrl:  pickImage(t.image),
      });
    }

    page++;
  } while (page <= totalPages);

  return tracks;
}

async function main() {
  const [currentlyPlaying, recentTracks] = await Promise.all([
    getCurrentlyPlaying(),
    getRecentTracks(),
  ]);

  const result = { currentlyPlaying, recentTracks };
  console.log(JSON.stringify(result, null, 2));
  return result;
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});