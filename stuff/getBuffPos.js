
function closestBracketForward(buffer, index){
  for(let i=index, i < buffer.length, i++){
    if(buffer[i]=="{"){
      return i
    }
  }
  throw "Error: closest '{' was not found in buffer" 
}



function getBuffPos(buffer, index){
  let counter = 0
  let len = buffer.length
  let start = closestBracketForward(buffer, index)
  let end = 0
  let i = start

  do{
    
    let character = buffer[i];
    if(character == "{"){
      counter++
    }else if(character == "}"){
      counter--
    }
    i++
    
  }while( counter && i < len)
  end=i
  
  if( i >= len ){ 
    throw "Error: either you forgot to add '}' or the buffer is corrupted" 
  }
  
  return [start, end]
}
