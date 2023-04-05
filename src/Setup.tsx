import { Link, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Tool } from "./tools/base/Tool";
import { ParamsSetup } from "./ParamsSetup";
import { AltInfo } from "./AltInfo";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";

interface SetupProps {
	completeSetup: Function;
	tools: Array<Tool>;
	showErrorToast: Function;
	applyToolParams: Function;
}

const windowAiText = `Instead of specifying an OpenAI key, you can also install the window.ai browser extension to use any model of your choosing! 
Please refresh this page after installing the extension.`;
const windowAiTextAlt = `You're using the window.ai browser extension!
toolformer-zero will use whichever model you have chosen.`;
const windowAiLink = "https://windowai.io";

export function Setup(props: SetupProps) {
	return (
		<Stack spacing={2}>
			<Typography whiteSpace={"pre-line"} variant="body2">
				{`Welcome to Toolformer Zero!
                
                To start, you'll need to follow a couple of steps in order for LLM and search APIs to work.`}
			</Typography>
			<Typography
				whiteSpace={"pre-line"}
				sx={{ fontWeight: "bold" }}
				variant="body2"
			>
				{`Your keys will only be used locally, and stored via browser cookie!
                No requests will be made other than those to selected models and tools.`}
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
			<AltInfo
				text={(window as any).ai ? windowAiTextAlt : windowAiText}
				link={windowAiLink}
				icon={<DeveloperBoardIcon />}
			></AltInfo>
			<ParamsSetup {...props}></ParamsSetup>
		</Stack>
	);
}
