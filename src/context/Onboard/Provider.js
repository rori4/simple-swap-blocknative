import React, { useState, useEffect } from "react"
import Onboard from "bnc-onboard"
// import { Web3Provider } from "ethers/providers"
import { BNC_API_KEY } from "../../constants"
import { OnboardContext } from "./Context"
const walletChecks = [{ checkName: "connect" }, { checkName: "network" }]

const wallets = [{ walletName: "metamask", preferred: true }]

export default function OnboardingProvider() {
	const [state, setState] = useState({
		onboard: null,
		address: "",
		balance: "",
		network: 0,
		wallet: {},
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
					setState({ ...state, address })
				},
				balance: (balance) => {
					setState({ ...state, balance })
				},
				network: (network) => {
					setState({ ...state, network })
				},
				wallet: (wallet) => {
					setState({ ...state, wallet })
				},
			},
		}

		const onboard = Onboard(initialization)
		setState({ ...state, onboard })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {}, [state.onboard])

	const setup = async (defaultWallet) => {
		const { onboard } = state
		try {
			const selected = await onboard.walletSelect(defaultWallet)
			if (selected) {
				const ready = await onboard.walletCheck()
				if (ready) {
					const walletState = onboard.getState()
					setState({ ...walletState })
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
			{this.props.children}
		</OnboardContext.Provider>
	)
}
