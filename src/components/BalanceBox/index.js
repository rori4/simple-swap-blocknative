import { Box, Text } from "@chakra-ui/layout"
import React from "react"
import { useTokenBalances, useWallet } from "../../context/Onboard/Context"

function BalanceBox({ Icon, token }) {
	const tokenBalances = useTokenBalances()
	const wallet = useWallet()
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
			<Text fontSize="md">
				{tokenBalances?.[token] && wallet
					? Number(tokenBalances?.[token]).toFixed(4)
					: "-"}
			</Text>
		</Box>
	)
}

export default BalanceBox
