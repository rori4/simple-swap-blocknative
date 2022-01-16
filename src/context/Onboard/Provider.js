import React, { useState, useEffect, useCallback } from "react"
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
		mainTokenBalance: null,
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
					const formattedBalance = ethers.utils.formatEther(balance)
					setTokenBalances({
						...tokenBalances,
						[MAIN_TOKEN_ADDRESS]: formattedBalance,
					})
					setState({ ...state, mainTokenBalance: formattedBalance })
				},
				network: (network) => {
					setState({ ...state, network })
				},
				wallet: (wallet) => {
					const provider = new ethers.providers.Web3Provider(wallet.provider)
					setProvider(provider)
					setState({ ...state, wallet })
				},
			},
		}
		const onboard = Onboard(initialization)
		setState({ ...state, setup })
		setOnboard(onboard)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const checkTokenBalance = useCallback(
		(token) => {
			if (state.address && provider) {
				const tokenContract = new ethers.Contract(token, ERC20_ABI, provider)
				return tokenContract.balanceOf(state.address)
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[provider, state.address]
	)

	const checkBalances = async () => {
		if (state.address) {
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

	useEffect(() => {
		if (state.address && state.wallet) checkBalances()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.address, state.wallet])

	const setup = async (defaultWallet) => {
		try {
			const selected = await onboard.walletSelect(defaultWallet)
			if (selected) {
				const ready = await onboard.walletCheck()
				if (ready) {
					const walletState = onboard.getState()
					setState({ ...state, ...walletState })
				} else {
					// Connection to wallet failed
				}
			} else {
				// User aborted set up
			}
		} catch (error) {
			console.error("error onboarding", error)
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
