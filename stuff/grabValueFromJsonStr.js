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
		else if(character == "'" && !isString){
			isString = true
			stack.push(character)
		}
		
		else if(character == "\"" && stack.slice(-1) == "\"" && isString){
			isString = false
			stack.pop()
		}
		else if(character == "'"  && stack.slice(-1) == "'" && isString){
			isString = false
			stack.pop()
		}

		else if(character == "}" && stack.slice(-1) == "{" ){
			stack.pop()
		}
		else if(character == "]" && stack.slice(-1) == "["){
			stack.pop()
		}
		i++
		prefchar = character
		if( i >= len ){ 

			if(mode_debug===1){
				debugger
			}

			throw "Error: either you forgot to add '}' or the buffer is corrupted" 
		}

	var isStackEmpty = stack.length < 1
	var sliceHasJson =  buffer.slice(start, i).match(/["'{}\[\]]/)
	
	if(isStackEmpty && sliceHasJson){

		if(mode_debug===1){
			console.log(stack, buffer.slice(start, i))
		}

		break;
	}

	}while(i < len)
	end=i
	return [start, end]
}
