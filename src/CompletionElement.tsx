import {
	Typography,
	Box,
	CircularProgress,
	IconButton,
	Card,
	CardContent,
	CardHeader,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CalculateIcon from "@mui/icons-material/Calculate";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import PendingIcon from "@mui/icons-material/Pending";
import {
	CompletionItem,
	CompletionType,
	getPayload,
	getToolInput,
	getToolOutput,
	ToolType,
} from "./CompletionItem";
import {
	cardContentStyle,
	cardHeaderStyle,
	completionDetailsStyle,
	completionTypographyStyle,
	iconStyle,
} from "./MuiStyles";

interface CompletionProps {
	completion: CompletionItem;
}

interface CompletionTypographyProps {
	text: string;
	color?: string;
	index?: number;
}

interface CompletionDetailsProps {
	completion: CompletionItem;
	isOpen: boolean;
	setOpen: Function;
}

export function CompletionElement(props: CompletionProps) {
	if (props.completion.type == CompletionType.DEFAULT) {
		if (getPayload(props.completion).length == 0) {
			return null;
		} else {
			return (
				<React.Fragment>
					{getPayload(props.completion)
						.trim()
						.split(" ")
						.map((word, index, map) => (
							<React.Fragment>
								<CompletionTypography
									text={word + (index === map.length - 1 ? "" : " ")}
									index={index}
								></CompletionTypography>
							</React.Fragment>
						))}
				</React.Fragment>
			);
		}
	} else if (props.completion.type == CompletionType.TOOL) {
		return <CompletionTool completion={props.completion}></CompletionTool>;
	} else {
		return (
			<CompletionTypography
				text={props.completion.text}
				color={"red"}
			></CompletionTypography>
		);
	}
}

function CompletionTypography(props: CompletionTypographyProps) {
	const [transitionState, setTransitionState] = useState(false);

	setTimeout(function () {
		setTransitionState(true);
	}, 50);

	return (
		<Typography
			key={props.index}
			color={props.color}
			display="inline-block"
			sx={{ ...completionTypographyStyle, opacity: transitionState ? 1 : 0 }}
		>
			{props.text}
		</Typography>
	);
}

function CompletionTool(props: CompletionProps) {
	const [transitionState, setTransitionState] = useState(false);
	const [detailsOpened, setDetailsOpened] = useState(false);

	setTimeout(function () {
		setTransitionState(true);
	}, 50);
	return (
		<Box
			display={"inline-block"}
			sx={{ opacity: transitionState ? 1 : 0, transition: "all 1000ms" }}
		>
			{!props.completion.completed && (
				<CircularProgress
					size={40}
					sx={{ ...iconStyle, position: "absolute" }}
				></CircularProgress>
			)}
			<IconButton
				sx={iconStyle}
				onClick={() => {
					setDetailsOpened(true);
				}}
			>
				<CompletionIcon completion={props.completion}></CompletionIcon>
			</IconButton>
			<CompletionDetails
				completion={props.completion}
				isOpen={detailsOpened}
				setOpen={setDetailsOpened}
			></CompletionDetails>
		</Box>
	);
}

function CompletionIcon(props: CompletionProps) {
	switch (props.completion.toolType) {
		case ToolType.MATH:
			return <CalculateIcon color="primary"></CalculateIcon>;
		case ToolType.NOW:
			return <CalendarMonthIcon color="primary"></CalendarMonthIcon>;
		case ToolType.SEARCH:
			return <SearchIcon color="primary"></SearchIcon>;
		default:
			return <PendingIcon color="primary"></PendingIcon>;
	}
}

function CompletionDetails(props: CompletionDetailsProps) {
	const ref = useRef<HTMLDivElement>(null);

	//Close when click outside of element detected
	useEffect(() => {
		function handleClickOutside(event: MouseEvent): void {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				props.setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	});

	return (
		<Card
			ref={ref}
			sx={{
				...completionDetailsStyle,
				transform: props.isOpen
					? "translate(-50%, -50%) scale(1,1)"
					: "translate(-50%, -50%) scale(0.9,0.9)",
				opacity: props.isOpen ? 1 : 0,
				pointerEvents: props.isOpen ? "" : "none",
			}}
		>
			<CardHeader
				avatar={<CompletionIcon completion={props.completion}></CompletionIcon>}
				titleTypographyProps={{ sx: { userSelect: "none" } }}
				title={getToolInput(props.completion)}
				sx={cardHeaderStyle}
			/>
			<CardContent sx={cardContentStyle}>
				<Typography variant="caption" sx={{ userSelect: "none" }}>
					{getToolOutput(props.completion)}
				</Typography>
			</CardContent>
		</Card>
	);
}
