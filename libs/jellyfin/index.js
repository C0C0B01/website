const JELLYFIN_URL    = process.env.JELLYFIN_URL?.replace(/\/$/, "");
const JELLYFIN_KEY    = process.env.JELLYFIN_API_KEY;
const JELLYFIN_USER   = process.env.JELLYFIN_USER_ID;

if (!JELLYFIN_URL || !JELLYFIN_KEY || !JELLYFIN_USER) {
  console.error("Error: JELLYFIN_URL, JELLYFIN_API_KEY, and JELLYFIN_USER_ID must be set in your .env file.");
  process.exit(1);
}

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

async function jfGet(path, params = {}) {
  const url = new URL(`${JELLYFIN_URL}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url, {
    headers: { "X-Emby-Token": JELLYFIN_KEY },
  });
  if (!res.ok) console.warn(`Jellyfin API error ${res.status}: ${url}`);
  return res.json();
}

async function resolveUserId(input) {
  if (/^[0-9a-f-]{32,36}$/i.test(input)) return input;

  const users = await jfGet("Users");
  const match = users.find(
    (u) => u.Name.toLowerCase() === input.toLowerCase()
  );
  if (!match) throw new Error(`Jellyfin user "${input}" not found.`);
  return match.Id;
}

const imageUrl = (itemId, type = "Primary") =>
  `${JELLYFIN_URL}/Items/${itemId}/Images/${type}?width=256&quality=90`;

export async function getCurrentlyPlaying(userId) {
  if (!userId) { userId = await resolveUserId(JELLYFIN_USER); }
  const sessions = await jfGet("Sessions");

  const session = sessions.find(
    (s) => s.UserId === userId && s.NowPlayingItem
  );

  if (!session) return null;

  const item = session.NowPlayingItem;
  return {
    itemId:             item.Id,
    name:               item.Name,
    type:               item.Type,
    seriesName:         item.SeriesName ?? null,
    seasonName:         item.SeasonName ?? null,
    positionTicks:      session.PlayState?.PositionTicks ?? null,
    runtimeTicks:       item.RunTimeTicks ?? null,
    imageUrl:           imageUrl(item.Id),
  };
}

export async function getRecentlyPlayed(userId) {
  const cutoff = new Date(Date.now() - TWO_WEEKS_MS);

  const data = await jfGet(`Users/${userId}/Items`, {
    SortBy:        "DatePlayed",
    SortOrder:     "Descending",
    Filters:       "IsPlayed",
    Recursive:     true,
    Fields:        "UserData,SeriesInfo",
    IncludeItemTypes: "Movie,Episode,Audio",
    Limit:         200,
  });

  return (data.Items ?? [])
    .filter((item) => {
      const lastPlayed = item.UserData?.LastPlayedDate;
      return lastPlayed && new Date(lastPlayed) >= cutoff;
    })
    .map((item) => ({
      itemId:       item.Id,
      name:         item.Name,
      type:         item.Type,
      seriesName:   item.SeriesName ?? null,
      seasonName:   item.SeasonName ?? null,
      lastPlayed:   item.UserData.LastPlayedDate,
      playCount:    item.UserData.PlayCount,
      runtimeTicks: item.RunTimeTicks ?? null,
      imageUrl:     imageUrl(item.Id),
    }));
}
