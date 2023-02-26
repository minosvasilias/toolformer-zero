import { primaryColor } from "./Constants";

export const rootGridStyle = {
	opacity: 1.0,
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	minHeight: "100%",
	transition: "all 500ms",
	backgroundImage: "linear-gradient(to bottom right, #e8f1ff, #dbc7ff)",
};

export const completionTypographyStyle = {
	lineHeight: "40px",
	wordWrap: "break-word",
	whiteSpace: "pre",
	transition: "all 1000ms",
};

export const completionDetailsStyle = {
	position: "absolute",
	width: "250px",
	marginLeft: "20px",
	marginTop: "-20px",
	borderRadius: "20px",
	zIndex: 1,
	transition: "all 200ms",
};

export const cardContentStyle = { overflowY: "auto", maxHeight: "55px" };

export const cardHeaderStyle = {
	boxShadow: "0px 0px 5px #888888",
	color: primaryColor,
};

export const setupCardStyle = {
	borderRadius: "20px",
	backgroundColor: "#ffffff00",
	boxShadow: "none",
};

export const iconStyle = {
	marginLeft: "4px",
	marginRight: "4px",
	color: primaryColor,
};

export const alertStyle = {
	position: "absolute",
	bottom: "70px",
	left: "20px",
	minWidth: "200px",
	borderRadius: "20px",
	boxShadow: "0 0 20px #00000044",
};

export const githubLinkStyle = {
	position: "absolute",
	right: 0,
	bottom: 0,
	margin: "5px",
};

export const toolButtonStyle = {
	position: "absolute",
	top: "10px",
	left: "10px",
};

export const paramsTextFieldStyle = {
	minWidth: "500px",
};

export const toolInfoContainerStyle = { width: "100%", padding: "50px" };

export const toolInfoBodyStyle = {
	width: "100%",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	paddingBottom: "30px",
};

export const toolInfoExamplesStyle = {
	marginTop: "25px",
	marginBottom: "25px",
};

const toolSetupDrawerWidth = "300px";

export const toolSetupContainerStyle = {
	display: "flex",
	width: "100%",
	height: "100vh",
};

export const toolSetupDrawerContainerStyle = { minWidth: toolSetupDrawerWidth };

export const toolSetupDrawerStyle = {
	display: { xs: "none", sm: "block" },
	"& .MuiDrawer-paper": {
		boxSizing: "border-box",
		width: toolSetupDrawerWidth,
	},
};

export const toolSetupDrawerPaperProps = {
	sx: {
		backgroundColor: "#00000000",
	},
};
