import { Box, Divider, styled, ToggleButton, Typography } from "@mui/material";
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

interface InfoProps {
	tool: Tool;
	tools: Array<Tool>;
	showErrorToast: Function;
	updateActive: Function;
	applyToolParams: Function;
}

const ThemedToggle = styled(ToggleButton)({
	"&.Mui-selected, &.Mui-selected:hover": {
		color: "white",
		backgroundColor: primaryColor,
	},
});

export function ToolInfo(props: InfoProps) {
	const [active, setActive] = useState(false);
	const toolParams = props.tool.getExpectedParams();

	var allowActiveError = useRef<Error | undefined>(undefined);

	useEffect(() => {
		setActive(isToolActive(props.tool));
	});

	function updateActive(isActive: boolean) {
		if (isActive && allowActiveError.current)
			return props.showErrorToast(allowActiveError.current.message);
		setActive(isActive);
		props.updateActive(props.tool, isActive);
		isActive
			? addActiveTool(props.tool.getUniqueHumanName())
			: removeActiveTool(props.tool.getUniqueHumanName());
	}

	function setAllowActiveError(error: Error | undefined) {
		allowActiveError.current = error;
		if (error && active) {
			updateActive(false);
		}
	}

	return (
		<Box
			key={props.tool.getUniqueHumanName()}
			component="main"
			sx={toolInfoContainerStyle}
		>
			<Box sx={toolInfoBodyStyle}>
				<Stack>
					<Typography variant="h4">
						{props.tool.getUniqueHumanName()}
					</Typography>
					<Typography variant="subtitle1">
						{props.tool.getHumanDescription()}
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
			<Divider>Example</Divider>
			<Stack sx={toolInfoExamplesStyle}>
				<Typography variant="subtitle1">
					{props.tool.getExamplePrompt()}
				</Typography>
				<Typography color={"#00000099"} variant="subtitle1">
					{props.tool.getExampleCompletion()}
				</Typography>
			</Stack>
			{toolParams.length > 0 && (
				<div>
					<Divider>Required Values</Divider>
					<ParamsSetup
						{...props}
						tools={[props.tool]}
						setAllowActiveError={setAllowActiveError}
					></ParamsSetup>
				</div>
			)}
		</Box>
	);
}
