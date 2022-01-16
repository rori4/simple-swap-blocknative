export const shortenAddress = (address, trim) => {
	const len = address.length
	return address.substring(0, trim) + "..." + address.substring(len - trim, len)
}

export function getCurrencyFormatWithSymbol(currencyCode) {
	return {
		style: "currency",
		currency: currencyCode,
		currencyDisplay: "symbol",
	}
}

export function getCurrencyFormatWithIsoCode(currencyCode) {
	return {
		style: "currency",
		currency: currencyCode,
		currencyDisplay: "code",
	}
}

export function getCurrencyFormatWithLocalName(currencyCode) {
	return {
		style: "currency",
		currency: currencyCode,
		currencyDisplay: "name",
	}
}

export function getCurrencyFormatNumbersOnly(currencyCode) {
	return {
		style: "currency",
		currency: currencyCode,
		currencyDisplay: "none",
	}
}

export function formatCurrency(
	value,
	format = getCurrencyFormatNumbersOnly("USD"),
	lang = "en-US"
) {
	const stripSymbols = format.currencyDisplay === "none"
	const localFormat = stripSymbols
		? { ...format, currencyDisplay: "code" }
		: format
	let result = Intl.NumberFormat(lang, localFormat).format(value)
	if (stripSymbols) {
		result = result.replace(/[a-z]{3}/i, "").trim()
	}
	return result
}
