import React from "react"
import { Center } from "@chakra-ui/react"
import Header from "./Header"
import Swap from "./Swap"
import LastSwapsTable from "./LastSwapsTable"
import { ETH_DAI_PAIR } from "../constants"

export default function App() {
	return (
		<React.Fragment>
			<Header />
			<Center display="flex" flexDirection="column">
				<Swap />
				<LastSwapsTable pair={ETH_DAI_PAIR} />
			</Center>
		</React.Fragment>
	)
}
