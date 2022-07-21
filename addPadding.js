	function padding(num, len=0){
		var numArr = String(num).split("")
		if(numArr.length < len){
			numArr = [...Array(len - numArr.length).fill(0), ...numArr]
		}
		return numArr.join("")
	}
