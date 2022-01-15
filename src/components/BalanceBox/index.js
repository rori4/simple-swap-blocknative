import { Box, Text } from "@chakra-ui/layout"
import React from "react"

function BalanceBox({ Icon, balance }) {
	return (
		<Box
			display="flex"
			px="4"
			py="2"
			borderRadius="base"
			background="AppWorkspace"
			gap="8px"
		>
			<Icon width="25px" height="25px" />
			<Text fontSize="md">{balance || "-"}</Text>
		</Box>
	)
}

export default BalanceBox
