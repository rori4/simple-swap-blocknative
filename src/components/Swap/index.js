/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Flex } from "@chakra-ui/layout"
import React, { useState, useEffect } from "react"
import { useColorModeValue } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/react"
import {
	chakra,
	Input,
	InputRightAddon,
	InputGroup,
	Button,
} from "@chakra-ui/react"
import { DAIIcon, ETHIcon } from "../../icons"
import TokenBox from "../TokenBox"
import {
	ChainId,
	Token,
	WETH,
	Fetcher,
	Trade,
	Route,
	TokenAmount,
	TradeType,
	Percent,
} from "@uniswap/sdk"
import { ethers } from "ethers"
import {
	RPC_PROVIDER_URL,
	// RPC_PROVIDER_URL_KOVAN,
	UNISWAP_ROUTER_ADDRESS,
} from "../../constants"
import {
	useAddress,
	useSetup,
	useSigner,
	useWallet,
	useWalletBalance,
} from "../../context/Onboard/Context"
import { UNISWAP_V2_ROUTER_ABI } from "../../abis"

const DAI = new Token(
	ChainId.MAINNET,
	"0x6B175474E89094C44Da98b954EedeAC495271d0F",
	18
)

// const DAI = new Token(
// 	ChainId.KOVAN,
// 	"0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa",
// 	18
// )

const routerContract = new ethers.Contract(
	UNISWAP_ROUTER_ADDRESS,
	UNISWAP_V2_ROUTER_ABI
)

function Swap() {
	const toast = useToast()
	const wallet = useWallet()
	const address = useAddress()
	const setup = useSetup()
	const signer = useSigner()
	const ethBalance = useWalletBalance()
	const [validAmountCheck, setValidAmountCheck] = useState(null)
	const [inputAmount, setInputAmount] = useState(0)
	const [parsedAmountOutMin, setParsedAmountOutMin] = useState(0)
	const [amountOutMin, setAmountOutMin] = useState()
	const [path, setPath] = useState()
	const [deadline, setDeadline] = useState()
	const [value, setValue] = useState()

	useEffect(() => {
		const intervalId = setInterval(async () => {
			fetchPrices()
		}, 15 * 1000)

		return () => clearInterval(intervalId) //This is important
	}, [])

	useEffect(() => {
		if (signer) {
			routerContract.connect(signer)
		}
	}, [signer])

	useEffect(() => {
		fetchPrices()
	}, [inputAmount])

	const handleInput = (e) => {
		setInputAmount(e.target.value)
	}

	const checkValid = () => {
		setValidAmountCheck(
			Number(inputAmount) <= Number(ethBalance) && Number(inputAmount) !== 0
		)
	}

	useEffect(() => {
		if (wallet) checkValid()
	}, [inputAmount, wallet])

	const handleSwap = async () => {
		if (address) {
			try {
				const routerContract = new ethers.Contract(
					UNISWAP_ROUTER_ADDRESS,
					UNISWAP_V2_ROUTER_ABI,
					signer
				)
				const tx = await routerContract.swapExactETHForTokens(
					amountOutMin?.toString(),
					path,
					address,
					deadline,
					{ value: value?.toString() }
				)
				await tx.wait() // receipt
				toast({
					title: "Transaction has been confirmed.",
					description: "The swap ETH/DAI was successful",
					status: "success",
					duration: 9000,
					isClosable: true,
				})
			} catch (error) {
				console.error(error)
			}
		}
	}

	const fetchPrices = async () => {
		if (inputAmount > 0) {
			//assign interval to a variable to clear it.
			const provider = new ethers.providers.JsonRpcProvider(RPC_PROVIDER_URL)
			const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId], provider)
			const route = new Route([pair], WETH[DAI.chainId])
			// can be switched with the rpc of connection when present
			const trade = new Trade(
				route,
				new TokenAmount(
					WETH[DAI.chainId],
					ethers.utils.parseEther(inputAmount).toString()
				),
				TradeType.EXACT_INPUT
			)
			const slippageTolerance = new Percent("100", "10000") // 100 bips, or 1%

			const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
			const parsedAmount = ethers.utils.formatUnits(amountOutMin.toString(), 18)
			const path = [WETH[DAI.chainId].address, DAI.address]
			// const to = "" // should be a checksummed recipient address
			const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
			const value = trade.inputAmount.raw // needs to be converted to e.g. hex
			setParsedAmountOutMin(parsedAmount)
			setAmountOutMin(amountOutMin)
			setPath(path)
			setDeadline(deadline)
			setValue(value)
		}
	}

	return (
		<Flex p={50} w="full" alignItems="center" justifyContent="center">
			<Box
				mx="auto"
				px={8}
				py={4}
				rounded="lg"
				shadow="lg"
				bg={useColorModeValue("white", "gray.800")}
				maxW="md"
			>
				<Flex
					justifyContent="space-between"
					alignItems="center"
					gap={12}
					mb={6}
				>
					<chakra.span
						fontSize="2xl"
						fontWeight="700"
						color={useColorModeValue("gray.700", "white")}
					>
						Swap ETH to DAI
					</chakra.span>
					{/* <Spinner size="md" speed={"15s"} /> */}
				</Flex>

				<Box mt={2} display="flex" flexDirection="column" gap={4}>
					<InputGroup size="lg">
						<Input
							type="number"
							focusBorderColor={validAmountCheck !== false ? null : "red.400"}
							isInvalid={validAmountCheck === false}
							placeholder="0.0"
							onChange={handleInput}
						/>
						<InputRightAddon
							w="120"
							borderColor="inherit"
							bgColor="blackAlpha.500"
							children={<TokenBox Icon={ETHIcon} name="ETH" />}
						/>
					</InputGroup>
					<InputGroup size="lg">
						<Input
							type="number"
							placeholder="0.0"
							disabled
							isReadOnly
							value={parsedAmountOutMin}
						/>
						<InputRightAddon
							w="120"
							borderColor="inherit"
							bgColor="blackAlpha.500"
							children={<TokenBox Icon={DAIIcon} name="DAI" />}
						/>
					</InputGroup>
				</Box>
				<Box mt={6} w="full">
					{wallet ? (
						<Button
							w="full"
							size="lg"
							disabled={!validAmountCheck}
							onClick={handleSwap}
						>
							SWAP
						</Button>
					) : (
						<Button w="full" size="lg" onClick={() => setup()}>
							CONNECT WALLET
						</Button>
					)}
				</Box>
			</Box>
		</Flex>
	)
}

export default Swap
