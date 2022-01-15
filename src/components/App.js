import React from "react"
import { Button, Center } from "@chakra-ui/react"
import { useAddress, useSetup, useWallet } from "../context/Onboard/Context"
import { shortenAddress } from "../helpers"

export default function App() {
	const setup = useSetup()
	const address = useAddress()
	const wallet = useWallet()
	return (
		<Center my={10}>
			{wallet ? (
				<Button onClick={() => setup()}>{shortenAddress(address, 4)}</Button>
			) : (
				<Button onClick={() => setup()}>Connect Wallet</Button>
			)}
		</Center>
	)
}
