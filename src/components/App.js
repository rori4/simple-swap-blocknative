import React from "react"
import { Center } from "@chakra-ui/react"
import Header from "./Header"
import Swap from "./Swap"
import LastSwapsTable from "./LastSwapsTable"
import { ETH_DAI_PAIR } from "../constants"
import PoolStats from "./PoolStats"

export default function App() {
	return (
		<React.Fragment>
			<Header />
			<Center display="flex" flexDirection="column" p={[3, 5, 10]} gap="8">
				<Swap />
				<PoolStats pair={ETH_DAI_PAIR} />
				<LastSwapsTable pair={ETH_DAI_PAIR} />
			</Center>
		</React.Fragment>
	)
}
