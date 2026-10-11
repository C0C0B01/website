import { type CSSProperties,useEffect, useState } from "react";

const styles: Record<string, CSSProperties> = {
	outer: {
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		gap: "1vh",
	},
	card: {
		width: "36vw",
		minWidth: "400px",
		maxWidth: "700px",
		height: "fit-content",
		backgroundColor: "var(--background-secondary)",
		borderRadius: "8px",
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		padding: "1vh",
	},
	aboutBox: {
		width: "fit-content",
		height: "fit-content",
		backgroundColor: "var(--background-tertiary)",
		borderRadius: "8px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "var(--text)",
		fontWeight: "bold",
		flexDirection: "column",
		fontSize: "120%",
	},
	toolBox: {
		width: "48px",
		height: "48px",
		backgroundColor: "var(--background-tertiary)",
		borderRadius: "8px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "var(--text)",
		fontWeight: "bold",
		fontSize: "120%",
		marginBottom: "14%",
	},
	projectBox: {
		width: "fit-content",
		backgroundColor: "var(--background-tertiary)",
		borderRadius: "8px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "var(--text)",
		fontWeight: "bold",
		fontSize: "120%",
		padding: "0 0.6rem",
		whiteSpace: "nowrap"
	},
};

export default function Main() {
	const [age, setAge] = useState(String);
	const [stupidEnglishLanguage, setStupidEnglishLanguage] = useState(String);

	useEffect(() => {
		fetch("/age/")
			.then(res => {
				if (!res.ok) throw new Error("Network error");
				return res.text();
			})
			.then(
				setAge
			)
			.then(() => {
				if (Number(age) !== 18 && Number(age) !== 19) {
					setStupidEnglishLanguage("a");
				} else {
					setStupidEnglishLanguage("an");
				}
			}
			)
			.catch(err => console.error("Failed to fetch:", err));
	}, []);

	return (
		<div className="profile" style={styles.outer}>
			<div style={styles.card}>
				<p style={{ color: "var(--text)", fontWeight: "bold", fontSize: "120%", margin: 5 }}>
          About
				</p>
				<p style={{ color: "var(--text)", fontWeight: "bold", fontSize: "150%", margin: 5 }}>
          Hi there, I'm cocobo1!
				</p>
				<div style={styles.aboutBox}>
					<p style={{ color: "var(--text)", fontWeight: "bold", padding: "4%" }}>
            I'm {stupidEnglishLanguage} {age} years old full-stack developer based in the UK with a passion for reverse engineering and optimisation
					</p>
				</div>
			</div>

			<div style={{ ...styles.card, height: "fit-content", minHeight: "fit-content" }}>
				<p style={{ color: "var(--text)", fontWeight: "bold", fontSize: "120%", margin: 5, paddingBottom: "2%" }}>
          Tools and Technologies
				</p>
				<div style={{ display: "flex", gap: "2%", width: "100%", flexWrap: "wrap" }}>
					<a href="https://www.typescriptlang.org/">
						<div style={styles.toolBox}>
							<img src="assets/tools/typescript.svg" style={{ width:"32px" }}></img>
						</div>
					</a>
					<a href="https://isocpp.org/">
						<div style={styles.toolBox}>
							<img src="assets/tools/cpp.svg" style={{ width:"32px" }}></img>
						</div>
					</a>
					<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
						<div style={styles.toolBox}>
							<img src="assets/tools/javascript.svg" style={{ width:"32px" }}></img>
						</div>
					</a>
					<a href="https://bun.sh/">
						<div style={styles.toolBox}>
							<img src="assets/tools/bun-mono.png" style={{ width:"32px" }}></img>
						</div>
					</a>
					<a href="https://nodejs.org/">
						<div style={styles.toolBox}>
							<img src="assets/tools/node.svg" style={{ width:"32px" }}></img>
						</div>
					</a>
					<a href="https://react.dev/">
						<div style={styles.toolBox}>
							<img src="assets/tools/react.svg" style={{ width:"32px" }}></img>
						</div>
					</a>
					<a href="https://reactnative.dev/">
						<div style={styles.toolBox}>
							<img src="assets/tools/react-native.svg" style={{ width:"32px" }}></img>
						</div>
					</a>
					<a href="https://www.python.org/">
						<div style={styles.toolBox}>
							<img src="assets/tools/python.svg" style={{ width:"32px" }}></img>
						</div>
					</a>
					<a href="https://developer.android.com/">
						<div style={styles.toolBox}>
							<img src="assets/tools/android-head_flat.svg" style={{ width:"32px" }}></img>
						</div>
					</a>
					<a href="https://www.debian.org/">
						<div style={styles.toolBox}>
							<img src="assets/tools/debian.svg" style={{ width:"32px" }}></img>
						</div>
					</a>
					<a href="https://cockpit-project.org/">
						<div style={styles.toolBox}>
							<img src="assets/tools/cockpit.png" style={{ width:"32px" }}></img>
						</div>
					</a>
					<a href="https://alpinelinux.org/">
						<div style={styles.toolBox}>
							<img src="assets/tools/alpine.svg" style={{ width:"32px" }}></img>
						</div>
					</a>
					<a href="https://fedoraproject.org/">
						<div style={styles.toolBox}>
							<img src="assets/tools/fedora.svg" style={{ width:"32px" }}></img>
						</div>
					</a>
				</div>
			</div>

			<div style={styles.card}>
				<p style={{ color: "var(--text)", fontWeight: "bold", fontSize: "120%", margin: 6 }}>
          Projects
				</p>
				<div style={{ display: "flex", gap: "0.6rem", width: "100%", flexWrap: "wrap" }}>
					<a href="https://github.com/ra1ncord">
						<div style={styles.projectBox}>
							<img src="assets/projects/rain.png" style={{ width:"32px", paddingRight: "5px" }}></img>
							<p>rain</p>
						</div>
					</a>
					<a href="https://github.com/C0C0B01/Kettu">
						<div style={styles.projectBox}>
							<img src="assets/projects/kettu.png" style={{ width:"32px", paddingRight: "5px" }}></img>
							<p>Kettu</p>
						</div>
					</a>
					<a href="https://github.com/C0C0B01/website">
						<div style={styles.projectBox}>
							<img src="assets/projects/website.svg" style={{ width:"32px", paddingRight: "5px" }}></img>
							<p>my site</p>
						</div>
					</a>
				</div>
			</div>
		</div>
	);
}
