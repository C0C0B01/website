import type { CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
	card: {
		width: "100%",
		backgroundColor: "var(--background-secondary)",
		textAlign: "center",
	},
};

export default function Footer() {
	return (
		<div style={styles.card}>
			<p style={{ color: "var(--text)", fontWeight: "bold", fontSize: "80%", display: "flex", gap: "6%", justifyContent: "center", }}>
				<a href="https://github.com/C0C0B01/website">Source code</a>
			</p>
		</div>
	);
}
