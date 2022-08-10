// this is not mine, credit: komodo
function shortName(name, maxChar=24) {
  // Check apakah nama sudah memenuhi kriteria
  if(name.length <= maxChar) return name;
  
  // Merubah nama lengkap menjadi array dengan dipisahkan oleh spasi
  const names = name.split(" ");
  let lastWordIndex = names.length - 1;
  
  // Check apakah kata terahkir merupakan huruf tunggal/sudah di short
  for(let i = 0; names.length > i; i++) {
    const val = names[i];
    
    if((val.length == 2 && val.includes(".")) || val.length == 1) {
      lastWordIndex = i - 1;
      break;
    }
  }
  
  const lastWord = names[lastWordIndex];

  // Rearrange names
  names[lastWordIndex] = lastWord.substr(0, 1)+".";
   
  return shortName(names.join(" "));
  
}



function nameShorter(name, maxLen=24) {
  var editedName = name
  var nameLen = name.length
  if(nameLen  > maxLen){
    editedName = editedName.split(" ")
    console.log(nameLen, maxLen)
    for(var x = editedName.length-1; nameLen > maxLen; x--){
      editedName[x]=editedName[x].substring(0,1).toUpperCase()+"."
      nameLen = editedName.reduce((previousValue, currentValue)=>{
        return previousValue + currentValue.length
      }, 0)
      nameLen += editedName.length
      console.log(nameLen)
    }
    editedName = editedName.join(" ")
  }
  return editedName
}
