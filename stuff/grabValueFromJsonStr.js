function grabValueFrom(buffer, key){
  let keyPos = buffer.indexOf(key)
  if (keyPos == -1){console.log("key not found !!!");return}
  let buffPos = getBuffPos(buffer, keyPos)
  let data = buffer.slice(...buffPos)
  return JSON.parse(data)
}

function closestBracketForward(buffer, index){
  for(let i=index; i < buffer.length; i++){
    if(buffer[i]=="{" ||  buffer[i]=="["){
      return i
    }
  }
  throw "Error: closest '{' or '[' was not found in buffer" 
}



function getBuffPos(buffer, index){
  let stack1 = []
  let stack2 = []
  let len = buffer.length
  let start = closestBracketForward(buffer, index)
  let end = 0
  let i = start

  do{
    
    let character = buffer[i];
    if(character == "{"){
      stack1.pop(character)
    }else if(character == "["){
      stack2.push(character)
    }
    else if(character == "}"){
      stack1.pop()
    }else if(character == "]"){
      stack2.pop()
    }
    i++
    if( i >= len ){ 
      throw "Error: either you forgot to add '}' or the buffer is corrupted" 
    }

  }while( stack1.length > 0 && stack2.length > 0 && i < len)
  end=i

  return [start, end]
}
