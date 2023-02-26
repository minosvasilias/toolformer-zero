import { createTheme } from "@mui/material";

export const defaultTools: Array<string> = ["Google Search", "Math JS", "Now"];

export const prompt_template = `You are an AI assistant with several tools available to you. The tools are the following:
TOOL_DEFINITIONS
DO NOT USE TOOLS WITHIN TOOLS! KEEP ALL TOOL CALLS SEPARATE FROM EACH OTHER!

TOOL_EXAMPLES
User: USER_INPUT
Assistant:`;

export const primaryColor = "#ff833b";

export const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: primaryColor,
		},
		secondary: { main: "#000000", contrastText: "#fff" },
	},
	typography: {
		button: {
			textTransform: "none",
		},
	},
});
