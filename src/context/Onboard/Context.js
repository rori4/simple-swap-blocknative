import { ethers } from "ethers"
import { createContext, useContext } from "react"

export const OnboardContext = createContext({})

export function useOnboardContext() {
	return useContext(OnboardContext)
}

export const useOnboard = () => {
	const { onboard } = useOnboardContext()
	return onboard
}

export const useGetState = () => {
	const { onboard } = useOnboardContext()
	return onboard.getState()
}

export const useAddress = () => {
	const { address } = useOnboardContext()
	return address
}

export const useWalletBalance = () => {
	const { balance } = useOnboardContext()
	return balance
}

export const useWallet = () => {
	const { wallet } = useOnboardContext()
	return wallet
}

export const useNetwork = () => {
	const { network } = useOnboardContext()
	return network
}

export const useSetup = () => {
	const { setup } = useOnboardContext()
	return setup
}

export const useWalletProvider = () => {
	const { provider } = useWallet() || {}
	return provider
}

export const useSigner = () => {
	const provider = useWalletProvider()
	const network = useNetwork()
	if (network && provider) {
		const signer = new ethers.providers.Web3Provider(provider).getSigner()
		return signer
	}
	return {}
}
