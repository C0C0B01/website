import { useEffect, useState } from "react";

export default function Status() {
	const [currentlyPlaying, setCurrentlyPlaying] = useState<string | undefined>(undefined);
	const [secondPlaying, setSecondPlaying] = useState<string | undefined>(undefined);
	const [source, setSource] = useState<string | undefined>(undefined);
	const [info, setInfo] = useState<string | undefined>(undefined);

	useEffect(() => {
		fetch("/api/currently-playing")
			.then(res => {
				if (!res.ok) throw new Error("Network error");
				return res.json();
			})
			.then(data => {
				setSource(data.source);

				if (data.source === "steam and lastFM") {
					setCurrentlyPlaying(data.steamImg);
					setSecondPlaying(data.lastFmImg);
					setInfo(`Playing ${data.steamName} while listening to ${data.lastFMName}`);
				} else {
					setCurrentlyPlaying(data.imageUrl);
					setSecondPlaying(undefined);
					if (data.source === "jellyfin") {
						setInfo(`Watching ${data.name}`);
					} else if (data.source === "steam") {
						setInfo(`Playing ${data.name}`);
					} else if (data.source === "lastFM") {
						setInfo(`Listening to ${data.name}`);
					} else if (data.source === "sleeping") {
						setInfo("I'm currently sleeping");
					} else {
						setInfo("I'm currently idle");
					}
				}
			})
			.catch(err => console.error("Failed to fetch:", err));
	}, []);

	return (
		<div>
			<div className="status-image" style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
				<div style={{ position: "relative", width: "100px", flexShrink: 0 }}>
					{source !== "steam" && source !== "steam and lastFM" && source !== "steam-recent" ?
						<img src={currentlyPlaying ?? undefined} style={{ clipPath: "circle(50%)", aspectRatio: "1/1", objectFit: "cover", width: "100%" }} /> :
						<img src={currentlyPlaying ?? undefined} style={{ width: "100%", aspectRatio: "1/1", borderRadius: "50%", backgroundColor: "black", padding: "10%", objectFit: "contain", boxSizing: "border-box" }} />}
					{secondPlaying && (
						<img src={secondPlaying} style={{ clipPath: "circle(50%)", aspectRatio: "1/1", objectFit: "cover", width: "40%", position: "absolute", bottom: "0", right: "0" }} />
					)}
				</div>
				<p style={{ paddingLeft: "5%", fontSize: "140%", width: "8vw", minWidth: "200px", textAlign: "center" }}>{info}</p>
			</div>
		</div>
	);
}
