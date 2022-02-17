function convertToSecond(len){
	var lookupTable = {
		"hou":3600,
		"min":60,
		"sec":1
	}
	var finalLen = 0
	len.split(", ").forEach((value)=>{
		value = value.match(/(\d+?) (\w{3})/)
		finalLen += parseInt(value[1]) * lookupTable[value[2]]
	})
	return finalLen;
}
