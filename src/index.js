import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App"
import reportWebVitals from "./reportWebVitals"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import OnboardingProvider from "./context/Onboard/Provider"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import { UNISWAP_GRAPHQL_ENDPOINT } from "./constants"

const colors = {
	brand: {
		50: "#ecefff",
		100: "#cbceeb",
		200: "#a9aed6",
		300: "#888ec5",
		400: "#666db3",
		500: "#4d5499",
		600: "#3c4178",
		700: "#2a2f57",
		800: "#181c37",
		900: "#080819",
	},
}
const config = {
	initialColorMode: "dark",
	useSystemColorMode: false,
}

const styles = {
	global: {
		"html, body": {
			background: "gray.600",
			lineHeight: "tall",
		},
		a: {
			color: "teal.500",
		},
	},
}

const components = {
	Badge: {
		baseStyle: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			borderRadius: "base",
		},
		sizes: {
			xl: {
				h: "24px",
				fontSize: "md",
			},
		},
	},
}

const theme = extendTheme({ colors, config, styles, components })

const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: UNISWAP_GRAPHQL_ENDPOINT,
})

ReactDOM.render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<ApolloProvider client={client}>
				<OnboardingProvider>
					<App />
				</OnboardingProvider>
			</ApolloProvider>
		</ChakraProvider>
	</React.StrictMode>,
	document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
