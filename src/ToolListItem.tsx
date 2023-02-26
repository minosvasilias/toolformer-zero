import {
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import { Tool } from "./tools/base/Tool";
import { primaryColor } from "./Constants";
import CheckIcon from "@mui/icons-material/Check";
import { isToolActive } from "./Cookies";

interface ListItemProps {
	tool: Tool;
	index: number;
	activeItem: number;
	setActiveItem: Function;
}

export function ToolListItem(props: ListItemProps) {
	return (
		<ListItem key={props.index} disablePadding>
			<ListItemButton
				onClick={() => {
					props.setActiveItem(props.index);
				}}
			>
				<ListItemIcon
					sx={{ color: props.activeItem == props.index ? primaryColor : "" }}
				>
					{props.tool.getIcon()}
				</ListItemIcon>
				<ListItemText
					sx={{ color: props.activeItem == props.index ? primaryColor : "" }}
					primary={props.tool.getUniqueHumanName()}
				/>
				{isToolActive(props.tool) && (
					<ListItemIcon
						sx={{ color: props.activeItem == props.index ? primaryColor : "" }}
					>
						<CheckIcon />
					</ListItemIcon>
				)}
			</ListItemButton>
		</ListItem>
	);
}
