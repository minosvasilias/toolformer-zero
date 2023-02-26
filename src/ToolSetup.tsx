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

interface SetupProps {
	tools: Array<Tool>;
	showErrorToast: Function;
	setActive: Function;
	updateActiveTools: Function;
	setToolResult: Function;
	setToolError: Function;
	applyToolParams: Function;
}

export function ToolSetup(props: SetupProps) {
	const [activeItem, setActiveItem] = useState(0);
	const [availableTools, setAvailableTools] = useState(allTools);

	function updateActive(tool: Tool, isActive: boolean) {
		setAvailableTools([...allTools]);
		props.updateActiveTools(tool, isActive);
	}

	const toolInstance = new allTools[activeItem](
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
									index={index}
									activeItem={activeItem}
									setActiveItem={setActiveItem}
								></ToolListItem>
							))}
						</List>
					</div>
				</Drawer>
			</Box>
			<ToolInfo
				updateActive={updateActive}
				tool={toolInstance}
				{...props}
			></ToolInfo>
		</Box>
	);
}
