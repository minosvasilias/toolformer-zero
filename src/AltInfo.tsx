import { Button, Link, Typography } from "@mui/material";
import { ReactElement, useState } from "react";
import { Stack } from "@mui/system";
import {
	alitInfoTitleStyle,
	altInfoButtonStyle,
	corsLinkStyle,
} from "./MuiStyles";

interface Props {
	text: string;
	link: string;
	icon: ReactElement;
}

export function AltInfo(props: Props) {
	const [hover, setHover] = useState(false);
	return (
		<Button
			sx={altInfoButtonStyle}
			onClick={() => {
				window.open(props.link, "_blank");
			}}
			onMouseEnter={() => {
				setHover(true);
			}}
			onMouseLeave={() => {
				setHover(false);
			}}
		>
			<Stack spacing={5} alignItems={"center"} direction={"row"}>
				{props.icon}
				<Stack>
					<Typography
						variant="subtitle2"
						whiteSpace={"pre-line"}
						sx={alitInfoTitleStyle}
					>
						{props.text}
					</Typography>
					<Link
						variant="caption"
						sx={{ ...corsLinkStyle, height: hover ? "20px" : "0px" }}
					>
						{props.link}
					</Link>
				</Stack>
			</Stack>
		</Button>
	);
}
