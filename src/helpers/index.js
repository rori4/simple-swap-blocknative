export const shortenAddress = (address, trim) => {
	const len = address.length
	return address.substring(0, trim) + "..." + address.substring(len - trim, len)
}
