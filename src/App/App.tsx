import "../semantics.css";

import Footer from "../components/Footer";
import Main from "./components/Main";
import Profile from "./components/Profile";

export function App() {
	return (
		<div style={{
			background: "var(--background-primary)",
			display: "flex",
			flexDirection: "column",
			minHeight: "98vh",
			paddingTop: "2vh",
		}}>
			<div style={{
				flex: 1,
				display: "flex",
				justifyContent: "center",
				flexWrap: "wrap",
				columnGap: "1.4rem",
				rowGap: "1vh",
				alignContent: "flex-start",
			}}>
				<Profile/>
				<Main/>
			</div>
			<Footer/>
		</div>
	);
}
export default App;
