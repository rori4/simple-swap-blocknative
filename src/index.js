import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App"
import reportWebVitals from "./reportWebVitals"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import OnboardingProvider from "./context/Onboard/Provider"

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

const theme = extendTheme({ colors, config })

ReactDOM.render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<OnboardingProvider>
				<App />
			</OnboardingProvider>
		</ChakraProvider>
	</React.StrictMode>,
	document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()