import React from "react"
import { Button } from "@chakra-ui/react"
import { useAddress, useSetup, useWallet } from "../../context/Onboard/Context"
import { shortenAddress } from "../../helpers"

function ConnectCTA() {
	const setup = useSetup()
	const address = useAddress()
	const wallet = useWallet()
	return (
		<Button minW={150} onClick={() => setup()}>
			{wallet ? shortenAddress(address, 4) : "Connect Wallet"}
		</Button>
	)
}

export default ConnectCTA
