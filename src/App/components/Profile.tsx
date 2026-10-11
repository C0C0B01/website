import type { CSSProperties } from "react";

import Status from "./Status";

const styles: Record<string, CSSProperties> = {
	outer: {
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		gap: "1vh",
	},
	card: {
		width: "80vw",
		height: "20vh",
		minHeight: "240px",
		maxWidth: "400px",
		backgroundColor: "var(--background-secondary)",
		borderRadius: "8px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		gap: "2%",
		padding: "1vh",
	},
	profileBox: {
		width: "60%",
		height: "60%",
		minWidth: "200px",
		minHeight: "180px",
		background: "var(--background-tertiary)",
		borderRadius: "8px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "var(--text)",
		fontWeight: "bold",
		flexDirection: "column",
		fontSize: "120%",
	},
	linksBox: {
		width: "100%",
		height: "48px",
		borderRadius: "8px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontWeight: "bold",
		gap: "2%",
	},
	linkButton: {
		width: "36px",
		height: "36px",
		backgroundColor: "var(--background-tertiary)",
		borderRadius: "8px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
};

const LINKS = [
	{ href: "https://github.com/c0c0b01", src: "assets/contacts/GitHub_Invertocat_White_Clearspace.png", imgStyle: { width: "28px" } },
	{ href: "https://ko-fi.com/cocobo1", src: "assets/contacts/kofi.svg", imgStyle: { width: "26px" } },
	{ href: "https://discord.com/users/767650984175992833", src: "assets/contacts/Discord-Symbol-White.svg", imgStyle: { width: "24px" } },
	{ href: "https://bsky.app/profile/cocobo1.dev", src: "assets/contacts/Bluesky.svg", imgStyle: { width: "24px" } },
	{ href: "mailto:cocobo1@cocobo1.dev", src: "assets/contacts/email-svgrepo-com.svg", imgStyle: { width: "28px" } },
];

function SocialLink({ href, src, imgStyle }:any) {
	return (
		<a href={href} style={styles.linkButton}>
			<img src={src} style={imgStyle} />
		</a>
	);
}

export default function Profile() {
	return (
		<div className="profile" style={styles.outer}>
			<div style={styles.card}>
				<div style={styles.profileBox}>
					<img src="https://github.com/C0C0B01.png" style={{ borderRadius: "50%", width: "60%", maxHeight: "140px", maxWidth: "140px" }} />
				</div>
				<div style={styles.linksBox}>
					{LINKS.map(link => (
						<SocialLink key={link.href} {...link} />
					))}
				</div>
			</div>
			<div style={{ ...styles.card, color: "var(--text)", fontWeight: "bold", height: "fit-content", minHeight: "100px", fontSize: "80%" }}>
				<Status></Status>
			</div>
		</div>
	);
}
