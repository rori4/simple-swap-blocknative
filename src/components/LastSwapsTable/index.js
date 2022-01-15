import { Badge, Flex, Heading, Link } from "@chakra-ui/layout"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table"
import React, { useEffect, useState } from "react"
import { Spinner, Text, Box, Button } from "@chakra-ui/react"
import { gql, NetworkStatus, useQuery } from "@apollo/client"
import moment from "moment"
import { AiOutlineSearch } from "react-icons/ai"

const GET_PAIR_SWAPS = gql`
	query GetPairSwaps($pair: String!) {
		swaps(orderBy: timestamp, orderDirection: desc, where: { pair: $pair }) {
			timestamp
			pair {
				token0 {
					symbol
				}
				token1 {
					symbol
				}
			}
			amount0In
			amount0Out
			amount1In
			amount1Out
			amountUSD
			to
			transaction {
				id
			}
		}
	}
`

function LastSwapsTable({ pair }) {
	const [, updateState] = React.useState()
	const { loading, error, data, refetch, networkStatus } = useQuery(
		GET_PAIR_SWAPS,
		{
			variables: { pair },
			notifyOnNetworkStatusChange: true,
		}
	)
	const [swaps, setSwaps] = useState([])
	useEffect(() => {
		if (data) {
			const { swaps } = data
			console.log(swaps)
			setSwaps(swaps)
		}
	}, [data, networkStatus, loading])

	const header = [
		"Date",
		"Pair",
		"Amount Sold",
		"Amount Received",
		"To Wallet",
		"Action",
	]

	return (
		<Flex
			w="full"
			bg="gray.600"
			p={50}
			alignItems="center"
			justifyContent="center"
		>
			{networkStatus === NetworkStatus.loading ? (
				<Spinner />
			) : (
				<Box>
					<Flex justifyContent="space-between">
						<Heading fontSize="3xl" mb={4}>
							Latest ETH / DAI swaps
						</Heading>
						{networkStatus === NetworkStatus.refetch ? (
							<Spinner />
						) : (
							<Button size="sm" onClick={() => refetch()}>
								Refresh
							</Button>
						)}
					</Flex>

					<Table w="full" borderRadius="md" bg={"gray.700"}>
						<Thead>
							<Tr>
								{header.map((x) => (
									<Th key={x}>{x}</Th>
								))}
							</Tr>
						</Thead>
						<Tbody>
							{swaps?.map((data, tid) => {
								return (
									<Tr key={tid}>
										<Td>{moment(new Date(data.timestamp * 1000)).fromNow()}</Td>
										<Td>
											<Text>
												{data.amount0In !== "0" ? (
													<Badge size="xl" colorScheme="green">
														{`${data.pair.token0.symbol} / ${data.pair.token1.symbol}`}
													</Badge>
												) : (
													<Badge size="xl" colorScheme="red">
														{`${data.pair.token1.symbol} / ${data.pair.token0.symbol}`}
													</Badge>
												)}
											</Text>
										</Td>
										<Td>
											<Text>
												{data.amount0In !== "0"
													? data.amount0In
													: data.amount1In}
											</Text>
										</Td>
										<Td>
											<Text>
												{data.amount1Out !== "0"
													? data.amount1Out
													: data.amount0Out}
											</Text>
										</Td>
										<Td>
											<Text>{data.to}</Text>
										</Td>
										<Td>
											<Link
												href={`https://etherscan.io/tx/${data.transaction.id}`}
												target="_blank"
												rel="noreferrer noopener"
											>
												<AiOutlineSearch />
											</Link>
										</Td>
									</Tr>
								)
							})}
						</Tbody>
					</Table>
				</Box>
			)}
		</Flex>
	)
}

export default LastSwapsTable
