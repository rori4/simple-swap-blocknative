import React from "react"
import { Button } from "@chakra-ui/react"
import { useAddress, useSetup, useWallet } from "../../context/Onboard/Context"
import { shortenAddress } from "../../helpers"

function ConnectCTA() {
	const setup = useSetup()
	const address = useAddress()
	const wallet = useWallet()
	return (
		<div>
			{wallet ? (
				<Button onClick={() => setup()}>{shortenAddress(address, 4)}</Button>
			) : (
				<Button onClick={() => setup()}>Connect Wallet</Button>
			)}
		</div>
	)
}

export default ConnectCTA
