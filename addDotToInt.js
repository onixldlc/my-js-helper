function addDotToInt(num){
	num = parseInt(num)
	if(num<1000){return String(num)}
	let dotted = addDotToInt(num/1000)+".000"
	return String(dotted);
}

function addDotToIntV2(num){
	let numStr = String(num).replaceAll(/[A-z]|\.\d\d$|\.|,|,\d\d$|\W/g,"")
	if(numStr.length<4){return numStr}
	let lower = "."+numStr.slice(-3)
	let dotted = addDotToIntV2(numStr.slice(0,-3))+lower
	return dotted;
}


function convertToIDR(num){
	let currency = num
	return `Rp${addDotToIntV2(currency)},00`
}
