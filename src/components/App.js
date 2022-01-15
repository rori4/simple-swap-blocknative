import React from "react"
import { Center } from "@chakra-ui/react"
import Header from "./Header"
import { useColorModeValue } from "@chakra-ui/react"
import Swap from "./Swap"

export default function App() {
	return (
		<>
			<Header />
			<Center height="auto" bg={useColorModeValue("#F9FAFB", "gray.600")}>
				<Swap />
			</Center>
		</>
	)
}
