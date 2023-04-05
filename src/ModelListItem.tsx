import {
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import { primaryColor } from "./Constants";
import CheckIcon from "@mui/icons-material/Check";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";

interface ListItemProps {
	name: string;
	index: number;
	activeItem: number;
	setActiveItem: Function;
	isActive: Function;
}

export function ModelListItem(props: ListItemProps) {
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
					{<DeveloperBoardIcon />}
				</ListItemIcon>
				<ListItemText
					sx={{ color: props.activeItem == props.index ? primaryColor : "" }}
					primary={props.name}
				/>
				{props.isActive() && (
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
