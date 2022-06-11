function convertIntToCurrency(num){
	num = parseInt(num)
	if(num<1000){return String(num)}
	let currency = convertIntToCurrency(num/1000)+".000"
	return currency;
}
