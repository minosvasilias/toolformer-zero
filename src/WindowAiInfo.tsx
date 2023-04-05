import {
	Box,
	Divider,
	Link,
	styled,
	ToggleButton,
	Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Stack } from "@mui/system";
import { Tool } from "./tools/base/Tool";
import { primaryColor } from "./Constants";
import CheckIcon from "@mui/icons-material/Check";
import { ParamsSetup } from "./ParamsSetup";
import { addActiveTool, isToolActive, removeActiveTool } from "./Cookies";
import {
	toolInfoContainerStyle,
	toolInfoBodyStyle,
	toolInfoExamplesStyle,
} from "./MuiStyles";
import { CorsInfo } from "./CorsInfo";

interface InfoProps {
	showErrorToast: Function;
	updateActive: Function;
	applyToolParams: Function;
	isActive: Function;
}

const ThemedToggle = styled(ToggleButton)({
	"&.Mui-selected, &.Mui-selected:hover": {
		color: "white",
		backgroundColor: primaryColor,
	},
});

export function WindowAiInfo(props: InfoProps) {
	const [active, setActive] = useState(false);

	useEffect(() => {
		setActive(props.isActive());
	});

	function updateActive(isActive: boolean) {
		setActive(isActive);
		props.updateActive(isActive);
	}

	return (
		<Box key="Models" component="main" sx={toolInfoContainerStyle}>
			<Box sx={toolInfoBodyStyle}>
				<Stack>
					<Typography variant="h4">window.ai</Typography>
					<Typography variant="subtitle1">
						Enable this to use the{" "}
						<Link href="https://windowai.io" target={"_blank"}>
							window.ai
						</Link>{" "}
						extension.
					</Typography>
				</Stack>
				<ThemedToggle
					sx={{ marginLeft: "auto" }}
					value="check"
					selected={active}
					onChange={() => {
						updateActive(!active);
					}}
				>
					<CheckIcon />
				</ThemedToggle>
			</Box>
			<Divider>About</Divider>
			<Stack sx={toolInfoExamplesStyle}>
				<Typography variant="subtitle1">How does window.ai work?</Typography>
				<Typography color={"#00000099"} variant="subtitle1">
					Navigate to{" "}
					<Link href="https://windowai.io" target={"_blank"}>
						window.ai
					</Link>{" "}
					and set up the browser extension. window.ai will store your API keys
					for use across different sites, and allow you to choose between any
					supported model (including local ones!). Simply select your preferred
					one in the extension settings, and toolformer-zero will be using it.
				</Typography>
				<Typography color={"#00000099"} variant="subtitle1">
					Make sure window.ai is enabled after installing by ticking the
					checkbox above!
				</Typography>
			</Stack>
		</Box>
	);
}
