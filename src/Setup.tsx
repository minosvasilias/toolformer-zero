import { Link, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Tool } from "./tools/base/Tool";
import { ParamsSetup } from "./ParamsSetup";

interface SetupProps {
	completeSetup: Function;
	tools: Array<Tool>;
	showErrorToast: Function;
	applyToolParams: Function;
}

export function Setup(props: SetupProps) {
	return (
		<Stack spacing={2}>
			<Typography whiteSpace={"pre-line"} variant="body2">
				{`Welcome to Toolformer Zero!
                
                To start, you'll need to input a couple of API keys in order for model and search APIs to work.`}
			</Typography>
			<Typography
				whiteSpace={"pre-line"}
				sx={{ fontWeight: "bold" }}
				variant="body2"
			>
				{`Your keys will only be used locally, and stored via browser cookie!
                No requests will be made other than those to OpenAI and Google Search APIs.`}
			</Typography>

			<Typography whiteSpace={"pre-line"} variant="body2">
				{`This project is open source, and you can view it `}
				<Link
					target={"_blank"}
					href="https://github.com/minosvasilias/toolformer-zero"
				>
					{"here."}
				</Link>
			</Typography>
			<ParamsSetup {...props}></ParamsSetup>
		</Stack>
	);
}
