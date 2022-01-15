import React, { useState, useEffect } from "react"
import Onboard from "bnc-onboard"
import { BNC_API_KEY } from "../../constants"
import { OnboardContext } from "./Context"
import { ERC20_ABI } from "../../abis"
import { ethers } from "ethers"
import {
	MAIN_TOKEN_ADDRESS,
	tokensToCheckMapping,
	arrayOfTokensToCheck,
} from "../../constants"
const walletChecks = [{ checkName: "connect" }, { checkName: "network" }]

const wallets = [{ walletName: "metamask", preferred: true }]

export default function OnboardingProvider({ children }) {
	const [onboard, setOnboard] = useState()
	const [provider, setProvider] = useState()
	const [tokenBalances, setTokenBalances] = useState()
	const [state, setState] = useState({
		address: "",
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
					setTokenBalances({
						[MAIN_TOKEN_ADDRESS]: ethers.utils.formatEther(balance),
					})
				},
				network: (network) => {
					console.log("network", network)
					setState({ ...state, network })
				},
				wallet: (wallet) => {
					console.log("wallet", wallet)
					window.localStorage.setItem("selectedWallet", wallet.name)
					const provider = new ethers.providers.Web3Provider(wallet.provider)
					setProvider(provider)
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

	useEffect(() => {
		async function checkBalances() {
			if (state.address && state.wallet) {
				const tokenBalancesPromises = arrayOfTokensToCheck.map((token) =>
					checkTokenBalance(token)
				)
				const balances = await Promise.all(tokenBalancesPromises)
				let ERC20tokenBalances = {}
				for (let i = 0; i < balances.length; i++) {
					const balance = balances[i]
					const tokenAddress = arrayOfTokensToCheck[i]
					ERC20tokenBalances[tokenAddress] = ethers.utils.formatUnits(
						balance,
						tokensToCheckMapping[tokenAddress].decimals
					)
				}
				setTokenBalances({ ...tokenBalances, ...ERC20tokenBalances })
			}
		}
		checkBalances()
	}, [state.address, state.wallet])

	useEffect(() => {
		console.log(tokenBalances)
	}, [tokenBalances])

	const checkTokenBalance = async (token) => {
		if (state.address && state.wallet && provider) {
			const tokenContract = new ethers.Contract(token, ERC20_ABI, provider)
			return tokenContract.balanceOf(state.address)
		}
	}

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
		<OnboardContext.Provider
			value={{ ...state, setup, onboard, provider, tokenBalances }}
		>
			{children}
		</OnboardContext.Provider>
	)
}
