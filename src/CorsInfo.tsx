import { Button, Link, Typography } from "@mui/material";
import { useState } from "react";
import { Stack } from "@mui/system";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import { proxyUrl } from "./tools/base/Cors";
import { corsInfoButtonStyle, corsLinkStyle } from "./MuiStyles";

export function CorsInfo() {
	const [hover, setHover] = useState(false);
	return (
		<Button
			sx={corsInfoButtonStyle}
			onClick={() => {
				window.open(proxyUrl(""), "_blank");
			}}
			onMouseEnter={() => {
				setHover(true);
			}}
			onMouseLeave={() => {
				setHover(false);
			}}
		>
			<Stack spacing={1} alignItems={"center"} direction={"row"}>
				<Stack>
					<Typography variant="subtitle2">uses CORS proxy</Typography>
					<Link
						variant="caption"
						sx={{ ...corsLinkStyle, height: hover ? "20px" : "0px" }}
					>
						{proxyUrl("")}
					</Link>
				</Stack>
				<AltRouteIcon></AltRouteIcon>
			</Stack>
		</Button>
	);
}
