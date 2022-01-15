import React from "react"
import { Center } from "@chakra-ui/react"
import Header from "./Header"
import Swap from "./Swap"

export default function App() {
	return (
		<React.Fragment>
			<Header />
			<Center>
				<Swap />
			</Center>
		</React.Fragment>
	)
}
