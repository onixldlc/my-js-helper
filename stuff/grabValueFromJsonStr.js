function grabValueFrom(buffer, key){
  let keyPos = buffer.indexOf(key)
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
  let counter = 0
  let len = buffer.length
  let start = closestBracketForward(buffer, index)
  let end = 0
  let i = start

  do{
    
    let character = buffer[i];
    if(character == "{" || character == "["){
      counter++
    }else if(character == "}" || character == "]"){
      counter--
    }
    i++
    if( i >= len ){ 
      throw "Error: either you forgot to add '}' or the buffer is corrupted" 
    }

  }while( counter && i < len)
  end=i

  return [start, end]
}
