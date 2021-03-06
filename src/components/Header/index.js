import { Box, Flex, HStack, Link } from "@chakra-ui/layout"
import { useViewportScroll } from "framer-motion"
import React from "react"
import { chakra } from "@chakra-ui/react"
import ConnectCTA from "../ConnectCTA"
import ETHLogo from "../../icons/ETHIcon"
import BalanceBox from "../BalanceBox"
import { DAIIcon, USDCIcon } from "../../icons"
import { arrayOfTokensToCheck, MAIN_TOKEN_ADDRESS } from "../../constants"
const { useColorModeValue } = require("@chakra-ui/color-mode")

function Header() {
	// const SwitchIcon = useColorModeValue(FaMoon, FaSun)

	const bg = useColorModeValue("white", "gray.800")
	const ref = React.useRef()
	const [y, setY] = React.useState(0)
	const { height = 0 } = ref.current ? ref.current.getBoundingClientRect() : {}

	const { scrollY } = useViewportScroll()
	React.useEffect(() => {
		return scrollY.onChange(() => setY(scrollY.get()))
	}, [scrollY])

	return (
		<Box pos="relative">
			<chakra.header
				ref={ref}
				shadow={y > height ? "sm" : undefined}
				transition="box-shadow 0.2s"
				bg={bg}
				borderTop="6px solid"
				borderTopColor="brand.400"
				w="full"
				overflowY="hidden"
			>
				<chakra.div h="4.5rem" mx="auto" maxW="1200px">
					<Flex w="full" h="full" px="6" align="center" justify="space-between">
						<Flex align="center">
							<Link href="/">
								<HStack>{/* <Logo /> */}</HStack>
							</Link>
						</Flex>

						<Flex
							justify="flex-end"
							w="full"
							maxW="824px"
							align="center"
							color="gray.400"
							gap="8px"
						>
							<BalanceBox Icon={ETHLogo} token={MAIN_TOKEN_ADDRESS} />
							<BalanceBox Icon={DAIIcon} token={arrayOfTokensToCheck[0]} />
							<BalanceBox Icon={USDCIcon} token={arrayOfTokensToCheck[1]} />
							<ConnectCTA />
						</Flex>
					</Flex>
				</chakra.div>
			</chakra.header>
		</Box>
	)
}

export default Header
