import React from "react"
import { Button, Center } from "@chakra-ui/react"
import Onboard from "bnc-onboard"
import { ethers } from "ethers"
import { BNC_API_KEY } from "../constants"

let provider

const onboard = Onboard({
	dappId: BNC_API_KEY, // [String] The API key created by step one above
	networkId: 1, // [Integer] The Ethereum network ID your Dapp uses.
	subscriptions: {
		wallet: (wallet) => {
			provider = new ethers.providers.Web3Provider(wallet.provider)
		},
	},
})

export default function App() {
	console.log(onboard)
	return (
		<Center my={10}>
			<Button>Connect Wallet</Button>
		</Center>
	)
}
