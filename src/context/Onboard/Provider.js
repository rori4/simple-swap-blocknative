import React, { useState, useEffect } from "react"
import Onboard from "bnc-onboard"
import { BNC_API_KEY } from "../../constants"
import { OnboardContext } from "./Context"
import { ethers } from "ethers"
const walletChecks = [{ checkName: "connect" }, { checkName: "network" }]

const wallets = [{ walletName: "metamask", preferred: true }]

export default function OnboardingProvider({ children }) {
	const [state, setState] = useState({
		address: "",
		balance: "",
		network: 0,
		wallet: null,
		mobileDevice: false,
		appNetworkId: 0,
		setup: () => null,
	})

	useEffect(() => {
		const initialization = {
			dappId: BNC_API_KEY,
			networkId: 1,
			walletCheck: walletChecks,
			walletSelect: {
				heading: "Select a wallet to connect",
				wallets,
			},
			subscriptions: {
				address: (address) => {
					console.log("address", address)
					setState({ ...state, address })
				},
				balance: (balance) => {
					console.log("balance", balance)
					setState({ ...state, balance })
				},
				network: (network) => {
					console.log("network", network)
					setState({ ...state, network })
				},
				wallet: (wallet) => {
					console.log("wallet", wallet)
					setState({ ...state, wallet })
				},
			},
		}

		const onboard = Onboard(initialization)
		setState({ ...state, onboard, setup })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const setup = async (defaultWallet) => {
		const { onboard } = state
		console.log("STATE", state)
		try {
			const selected = await onboard.walletSelect(defaultWallet)
			if (selected) {
				const ready = await onboard.walletCheck()
				if (ready) {
					const walletState = onboard.getState()
					console.log("walletState", walletState)
					setState({ ...state, ...walletState })
					console.log(walletState)
				} else {
					// Connection to wallet failed
				}
			} else {
				// User aborted set up
			}
		} catch (error) {
			console.log("error onboarding", error)
		}
	}

	return (
		<OnboardContext.Provider value={{ ...state, setup: setup }}>
			{children}
		</OnboardContext.Provider>
	)
}
