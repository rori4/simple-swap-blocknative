import React from "react"
import { Button, Center } from "@chakra-ui/react"
import { useOnboard, useSetup } from "../context/Onboard/Context"

export default function App() {
	const setup = useSetup()
	return (
		<Center my={10}>
			<Button onClick={() => setup()}>Connect Wallet</Button>
		</Center>
	)
}
