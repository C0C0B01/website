import "dotenv/config";

import { serve } from "bun";

import { getCurrentlyPlaying as getCurrentlyPlayingJellyfin } from "../libs/jellyfin";
import { getCurrentlyPlaying as getCurrentlyPlayingLastFM } from "../libs/lastfm";
import { getCurrentlyPlaying as getCurrentlyPlayingSteam } from "../libs/steam";
import index from "./App/index.html";

// @ts-ignore
const BIRTHDAY = new Date(process.env.BIRTHDAY);

const server = serve({
	routes: {
		"/*": index,

		"/assets/*": async req => {
			const path = new URL(req.url).pathname;
			return new Response(Bun.file(`.${path}`));
		},

		"/age/*": async req => {
			const age = (Date.now() - BIRTHDAY.getTime()) / 31557600000;
			return new Response(age.toString().split(".")[0]);
		},

		"/api/currently-playing": async req => {
			try {
				const withTimeout = (p: Promise<any>, ms = 3000): Promise<any> =>
					Promise.race([p, new Promise<null>(res => setTimeout(() => res(null), ms))]);
				const safe = (p: Promise<any>) => withTimeout(p.catch(() => null));

				const [jellyfinData, steamData, lastFMData] = await Promise.all([
					safe(getCurrentlyPlayingJellyfin()),
					safe(getCurrentlyPlayingSteam()),
					safe(getCurrentlyPlayingLastFM()),
				]);

				if (steamData && lastFMData) {
					return Response.json({
						steamImg: steamData.imageUrl,
						lastFmImg: lastFMData.imageUrl,
						steamName: steamData.name,
						lastFMName: lastFMData.name,
						source: "steam and lastFM"
					});
				}

				if (jellyfinData) { return Response.json({ ...jellyfinData, source: "jellyfin" }); }
				if (steamData) { return Response.json({ ...steamData, source: "steam" }); }
				if (lastFMData) { return Response.json({ ...lastFMData, source: "lastFM" }); }

				if (!jellyfinData && !steamData && !lastFMData) {
					// cool system that "checks" if im asleep
					// this is mostly accurate as if im not on lastfm, jellyfin or steam its probably right lmao
					const ukHour = new Date().toLocaleString("en-GB", {
						timeZone: "Europe/London",
						hour: "numeric",
						hour12: false
					});

					const hour = parseInt(ukHour);

					if (hour < 7 || hour >= 22) {
						return Response.json({ imageUrl: "/assets/cocobo1/sleeping.png", source: "sleeping" });
					}

					return Response.json({ imageUrl: "/assets/cocobo1/ryo.png", source: "offline" });

					// const topImageUrl = await getTopPlayed();
					// return Response.json({
					//	imageUrl: topImageUrl?.imageUrl,
					//	source: "steam-recent",
					//	name: topImageUrl?.name
					// });
				}

				return Response.json({ error: "Unexpected error" }, { status: 500 });
			} catch (err) {
				console.error("API Error:", err);
				return Response.json({ error: "Failed to fetch from Jellyfin" }, { status: 500 });
			}
		},
	},

	development: process.env.NODE_ENV !== "production" && {
		hmr: true,
		console: true,
	},
});

console.log(`🚀 Server running at ${server.url}`);
