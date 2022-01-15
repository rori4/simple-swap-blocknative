import { Flex, Text } from "@chakra-ui/layout"
import React from "react"

export default function TokenBox({ Icon, name }) {
	return (
		<Flex
			shadow="2xl"
			w={75}
			alignItems="center"
			justifyContent="center"
			gap={2}
		>
			<Icon height="25px" />
			<Text fontSize="md" color="whiteAlpha.800" fontWeight="700" variant="h1">
				{name}
			</Text>
		</Flex>
	)
}
