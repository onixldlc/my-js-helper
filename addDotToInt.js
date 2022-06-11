function addDotToInt(num){
	num = parseInt(num)
	if(num<1000){return String(num)}
	let dotted = addDotToInt(num/1000)+".000"
	return String(dotted);
}

function convertToIDR(num){
	let currency = parseInt(String(num).replaceAll(".",""))
	return `Rp${addDotToInt(currency)},00`
}
