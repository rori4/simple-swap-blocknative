import React, { useState, useEffect } from "react"
import Onboard from "bnc-onboard"
import { BNC_API_KEY } from "../../constants"
import { OnboardContext } from "./Context"

const walletChecks = [{ checkName: "connect" }, { checkName: "network" }]

const wallets = [{ walletName: "metamask", preferred: true }]

export default function OnboardingProvider({ children }) {
	const [onboard, setOnboard] = useState()
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
					window.localStorage.setItem("selectedWallet", wallet.name)
					setState({ ...state, wallet })
				},
			},
		}
		const onboard = Onboard(initialization)
		setState({ ...state, setup })
		setOnboard(onboard)
		onLoad(onboard)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onLoad = async (onboard) => {
		// get the selectedWallet value from local storage
		const previouslySelectedWallet =
			window.localStorage.getItem("selectedWallet")
		// call wallet select with that value if it exists
		if (previouslySelectedWallet != null) {
			await onboard.walletSelect(previouslySelectedWallet)
		}
	}

	const setup = async (defaultWallet) => {
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
		<OnboardContext.Provider value={{ ...state, setup, onboard }}>
			{children}
		</OnboardContext.Provider>
	)
}
