import React, { useEffect, useState } from "react"
import { gql, useQuery } from "@apollo/client"
import { chakra, useColorModeValue } from "@chakra-ui/system"
import { Box, Flex, HStack } from "@chakra-ui/layout"
import { StarIcon } from "@chakra-ui/icons"
import { formatCurrency, getCurrencyFormatNumbersOnly } from "../../helpers"
import { Spinner } from "@chakra-ui/react"

const GET_PAIR_DATA = gql`
	query GetPoolStats($pair: String!) {
		pairDayDatas(
			first: 1
			orderBy: date
			orderDirection: desc
			where: { pairAddress: $pair }
		) {
			date
			dailyVolumeToken0
			dailyVolumeToken1
			dailyVolumeUSD
			reserveUSD
		}
	}
`

function PoolStats({ pair }) {
	const { loading, data, refetch, networkStatus } = useQuery(GET_PAIR_DATA, {
		variables: { pair },
		notifyOnNetworkStatusChange: true,
	})

	const [stats, setStats] = useState()

	useEffect(() => {
		if (data) {
			const { pairDayDatas } = data
			setStats(pairDayDatas[0])
		}
	}, [data])
	return (
		<Flex
			width="100%"
			maxW={"438px"}
			bg={useColorModeValue("#F9FAFB", "gray.600")}
			alignItems="center"
			justifyContent="center"
		>
			<Flex
				// mx="auto"
				width="100%"
				bg={useColorModeValue("white", "gray.800")}
				shadow="lg"
				rounded="lg"
				overflow="hidden"
			>
				<Box
					w={1 / 3}
					bgSize="cover"
					style={{
						backgroundImage:
							"url('https://unsplash.com/photos/JKUTrJ4vK00/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjQyMzQ2Njgz&force=true&w=1920&q=80')",
					}}
				></Box>

				<Box w={2 / 3} p={{ base: 4, md: 4 }}>
					<Flex alignContent="center" justifyContent="space-between">
						<chakra.h1 fontSize="2xl" fontWeight="bold" color={"white"}>
							Pool Stats
						</chakra.h1>
						{loading && <Spinner size="md" />}
					</Flex>
					<Box py={2}>
						<chakra.h1 color="gray.400" fontWeight="bold" fontSize="sm">
							Daily Volume WETH
						</chakra.h1>
						<chakra.h2 color="white" fontWeight="bold" fontSize="sm">
							{stats ? formatCurrency(stats?.dailyVolumeToken1) : "-"} WETH
						</chakra.h2>
					</Box>
					<Box py={2}>
						<chakra.h1 color="gray.400" fontWeight="bold" fontSize="sm">
							Daily Volume DAI
						</chakra.h1>
						<chakra.h2 color="white" fontWeight="bold" fontSize="sm">
							{stats ? formatCurrency(stats?.dailyVolumeToken0) : "-"} DAI
						</chakra.h2>
					</Box>
					<Box py={2}>
						<chakra.h1 color="gray.400" fontWeight="bold" fontSize="sm">
							Daily Volume USD
						</chakra.h1>
						<chakra.h2 color="white" fontWeight="bold" fontSize="sm">
							$ {stats ? formatCurrency(stats?.dailyVolumeUSD) : "-"}
						</chakra.h2>
					</Box>
					<Box py={2}>
						<chakra.h1 color="gray.400" fontWeight="bold" fontSize="sm">
							Reserve Total Amount (USD)
						</chakra.h1>
						<chakra.h2 color="white" fontWeight="bold" fontSize="sm">
							$ {stats ? formatCurrency(stats?.reserveUSD) : "-"}
						</chakra.h2>
					</Box>
				</Box>
			</Flex>
		</Flex>
	)
}

export default PoolStats
