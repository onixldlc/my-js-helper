var max = temp.reduce((prev,curr)=>{
	if(parseInt(curr.length) > parseInt(prev.length)){
		return curr
	}else
		return prev
},{"length":"0"})
console.log(max)
