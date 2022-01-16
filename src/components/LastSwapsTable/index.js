import { Badge, Flex, Heading, Link } from "@chakra-ui/layout"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table"
import React, { useEffect, useState } from "react"
import { Spinner, Text, Box, Button, useColorModeValue } from "@chakra-ui/react"
import { gql, NetworkStatus, useQuery } from "@apollo/client"
import moment from "moment"
import { AiOutlineSearch } from "react-icons/ai"
import { shortenAddress } from "../../helpers"

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
	const { loading, data, refetch, networkStatus } = useQuery(GET_PAIR_SWAPS, {
		variables: { pair },
		notifyOnNetworkStatusChange: true,
	})
	const [swaps, setSwaps] = useState([])
	useEffect(() => {
		if (data) {
			const { swaps } = data
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
					<Flex
						justifyContent="space-between"
						alignItems="center"
						gap="4"
						flexWrap="wrap"
						my={2}
					>
						<Heading fontSize="3xl">Latest WETH / DAI swaps</Heading>
						{networkStatus === NetworkStatus.refetch ? (
							<Spinner />
						) : (
							<Button size="sm" onClick={() => refetch()}>
								Refresh
							</Button>
						)}
					</Flex>

					<Table
						w="full"
						borderRadius="md"
						bg={"gray.700"}
						display={{
							base: "block",
							md: "table",
						}}
						sx={{
							"@media print": {
								display: "table",
							},
						}}
					>
						<Thead
							display={{
								base: "none",
								lg: "table-header-group",
							}}
							sx={{
								"@media print": {
									display: "table-header-group",
								},
							}}
						>
							<Tr>
								{header.map((x) => (
									<Th key={x}>{x}</Th>
								))}
							</Tr>
						</Thead>
						<Tbody
							display={{
								base: "block",
								lg: "table-row-group",
							}}
							sx={{
								"@media print": {
									display: "table-row-group",
								},
							}}
						>
							{swaps?.map((data, tid) => {
								return (
									<Tr
										key={tid}
										display={{
											base: "grid",
											lg: "table-row",
										}}
										sx={{
											"@media print": {
												display: "table-row",
											},
											gridTemplateColumns: "minmax(0px, 35%) minmax(0px, 65%)",
											gridGap: "10px",
										}}
									>
										<Td
											display={{
												base: "table-cell",
												sx: "none",
											}}
											sx={{
												"@media print": {
													display: "none",
												},
												textTransform: "uppercase",
												// eslint-disable-next-line react-hooks/rules-of-hooks
												color: "gray.400",
												fontSize: "xs",
												fontWeight: "bold",
												letterSpacing: "wider",
												fontFamily: "heading",
											}}
										>
											{moment(new Date(data.timestamp * 1000)).fromNow()}
										</Td>
										<Td
											display={{
												base: "table-cell",
												// sx: "none",
											}}
											sx={{
												"@media print": {
													display: "none",
												},
												textTransform: "uppercase",
												// eslint-disable-next-line react-hooks/rules-of-hooks
												color: "gray.400",
												fontSize: "xs",
												fontWeight: "bold",
												letterSpacing: "wider",
												fontFamily: "heading",
											}}
										>
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
										<Td
											display={{
												base: "table-cell",
												sx: "none",
											}}
											sx={{
												"@media print": {
													display: "none",
												},
												textTransform: "uppercase",
												// eslint-disable-next-line react-hooks/rules-of-hooks
												color: "gray.400",
												fontSize: "xs",
												fontWeight: "bold",
												letterSpacing: "wider",
												fontFamily: "heading",
											}}
										>
											<Text>
												{data.amount0In !== "0"
													? data.amount0In
													: data.amount1In}
											</Text>
										</Td>
										<Td
											display={{
												base: "table-cell",
												sx: "none",
											}}
											sx={{
												"@media print": {
													display: "none",
												},
												textTransform: "uppercase",
												// eslint-disable-next-line react-hooks/rules-of-hooks
												color: "gray.400",
												fontSize: "xs",
												fontWeight: "bold",
												letterSpacing: "wider",
												fontFamily: "heading",
											}}
										>
											<Text>
												{data.amount1Out !== "0"
													? data.amount1Out
													: data.amount0Out}
											</Text>
										</Td>
										<Td
											display={{
												base: "table-cell",
												sx: "none",
											}}
											sx={{
												"@media print": {
													display: "none",
												},
												textTransform: "uppercase",
												// eslint-disable-next-line react-hooks/rules-of-hooks
												color: "gray.400",
												fontSize: "xs",
												fontWeight: "bold",
												letterSpacing: "wider",
												fontFamily: "heading",
											}}
										>
											<Link
												href={`https://etherscan.io/address/${data.to}`}
												target="_blank"
												rel="noreferrer noopener"
											>
												<Text>{shortenAddress(data.to, 4)}</Text>
											</Link>
										</Td>
										<Td
											display={{
												base: "table-cell",
												sx: "none",
											}}
											sx={{
												"@media print": {
													display: "none",
												},
												textTransform: "uppercase",
												// eslint-disable-next-line react-hooks/rules-of-hooks
												color: "gray.400",
												fontSize: "xs",
												fontWeight: "bold",
												letterSpacing: "wider",
												fontFamily: "heading",
											}}
										>
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
