import { Box, Flex, Link } from "@chakra-ui/layout"
import React, { useState, useEffect } from "react"
import { useColorModeValue } from "@chakra-ui/react"
import {
	chakra,
	Input,
	InputRightAddon,
	InputGroup,
	Button,
} from "@chakra-ui/react"
import { DAIIcon, ETHIcon } from "../../icons"
import TokenBox from "../TokenBox"
import { ChainId, Token, WETH, Fetcher, Route } from "@uniswap/sdk"

const DAI = new TokenBox(
	ChainId.MAINNET,
	"0x6B175474E89094C44Da98b954EedeAC495271d0F",
	18
)

function Swap() {
	const [inputAmount, setInputAmount] = useState(0)

	useEffect(() => {
		const intervalId = setInterval(async () => {
			//assign interval to a variable to clear it.
			const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId])
			const route = new Route([pair], WETH[DAI.chainId])
			const price = route.midPrice.toSignificant(6)
		}, 5000)

		return () => clearInterval(intervalId) //This is important
	}, [])

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
							placeholder="0.0"
							value={inputAmount}
							onChange={(e) => console.log(e)}
						/>
						<InputRightAddon
							w="120"
							borderColor="inherit"
							bgColor="blackAlpha.500"
							children={<TokenBox Icon={ETHIcon} name="ETH" />}
						/>
					</InputGroup>
					<InputGroup size="lg">
						<Input type="number" placeholder="0.0" />
						<InputRightAddon
							w="120"
							borderColor="inherit"
							bgColor="blackAlpha.500"
							children={<TokenBox Icon={DAIIcon} name="DAI" />}
						/>
					</InputGroup>
				</Box>
				<Box mt={6} w="full">
					{/* CONNECT OR SWAP */}
					<Button w="full" size="lg">
						SWAP
					</Button>
				</Box>
			</Box>
		</Flex>
	)
}

export default Swap
