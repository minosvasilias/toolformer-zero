import {
	Box,
	Divider,
	Drawer,
	IconButton,
	List,
	Toolbar,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { Tool } from "./tools/base/Tool";
import { ToolInfo } from "./ToolInfo";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ToolListItem } from "./ToolListItem";
import { allTools } from "./tools/base/AllTools";
import {
	toolSetupContainerStyle,
	toolSetupDrawerContainerStyle,
	toolSetupDrawerPaperProps,
	toolSetupDrawerStyle,
} from "./MuiStyles";
import { ModelListItem } from "./ModelListItem";
import { WindowAiInfo } from "./WindowAiInfo";
import { getWindowAiActive } from "./Cookies";

interface SetupProps {
	tools: Array<Tool>;
	showErrorToast: Function;
	setActive: Function;
	updateActiveTools: Function;
	setToolResult: Function;
	setToolError: Function;
	applyToolParams: Function;
	updateWindowAiActive: Function;
}

export function ToolSetup(props: SetupProps) {
	const [activeItem, setActiveItem] = useState(0);
	const [availableTools, setAvailableTools] = useState(allTools);

	function updateActive(tool: Tool, isActive: boolean) {
		setAvailableTools([...allTools]);
		props.updateActiveTools(tool, isActive);
	}

	function updateWindowAiActive(isActive: boolean) {
		props.updateWindowAiActive(isActive);
	}

	const toolInstance = new allTools[Math.max(0, activeItem - 1)](
		props.setToolResult,
		props.setToolError
	);

	return (
		<Box sx={toolSetupContainerStyle}>
			<Box sx={toolSetupDrawerContainerStyle}>
				<Drawer
					PaperProps={toolSetupDrawerPaperProps}
					variant="permanent"
					sx={toolSetupDrawerStyle}
					open
				>
					<div>
						<Toolbar>
							<IconButton
								sx={{ marginLeft: "-15px", marginRight: "20px" }}
								onClick={() => props.setActive(false)}
							>
								<ArrowBackIcon></ArrowBackIcon>
							</IconButton>
							<Typography variant="h5">Tools</Typography>
						</Toolbar>
						<Divider />
						<List>
							{availableTools.map((t, index) => (
								<ToolListItem
									tool={new t()}
									index={index + 1}
									activeItem={activeItem}
									setActiveItem={setActiveItem}
								></ToolListItem>
							))}
							<Divider />
							<ModelListItem
								name={"window.ai"}
								index={0}
								activeItem={activeItem}
								setActiveItem={setActiveItem}
								isActive={getWindowAiActive}
							></ModelListItem>
						</List>
					</div>
				</Drawer>
			</Box>
			{activeItem === 0 ? (
				<WindowAiInfo
					updateActive={updateWindowAiActive}
					isActive={getWindowAiActive}
					{...props}
				></WindowAiInfo>
			) : (
				<ToolInfo
					updateActive={updateActive}
					tool={toolInstance}
					{...props}
				></ToolInfo>
			)}
		</Box>
	);
}
