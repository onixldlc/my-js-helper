
function grabValueFrom(buffer, key){
	if(!key.length){throw "Error: need array or string"}
	let keys = (typeof key == string)?[key]:key
	let data = buffer
	for(key of keys){
		let keyPos = data.indexOf(key)
		if(keyPos == -1){throw "Error: key not found in buffer"}
		let buffPos = getBuffPos(data, keyPos)
		data = data.slice(...buffPos)	
	}
	return JSON.parse(data)
}

function closestValue(buffer, index){
	for(let i=index; i < buffer.length; i++){
		if(buffer[i]==":"){
			return i+1
		}
	}
	throw "Error: ':' was not found"
}

function getBuffPos(buffer, index){
	let stack = []
	let prefchar = ""
	let len = buffer.length
	let isString = false
	let start = closestValue(buffer, index)
	let end = 0
	let i = start

	do{
		let character = buffer[i];
		if(prefchar == "\\" && isString){
			//do nothing |:
		}
		else if(character == "{"){
			stack.push(character)
		}
		else if(character == "["){
			stack.push(character)
		}
		else if(character == "\"" && !isString){
			isString = true
			stack.push(character)
		}
		
		else if(character == "\"" && isString){
			isString = false
			stack.pop()
		}
		else if(character == "}"){
			stack.pop()
		}
		else if(character == "]"){
			stack.pop()
		}
		i++
		prefchar = character
		if( i >= len ){ 
			throw "Error: either you forgot to add '}' or the buffer is corrupted" 
		}
	}while( stack.length > 0 && i < len)
	end=i
	return [start, end]
}
