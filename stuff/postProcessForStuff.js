
function postProcess(arr){
  return arr.map((value, index)=>{
    let tempData = createData(value)
    tempData.index=index;
    return tempData;
  })
}

function createData(data){
	const dataTemplate = (url, length, creator, title)=>{
    return{
      index:0
      url:url,
      length:length,
      creator:creator,
      title:title
    }
  }

  let baseurl=location.origin;
  let textData = JSON.stringify(data);
  let id = grabValueFrom(textData, ["webCommand"], {index:2}).url.split("&")[0];
  
  let url = baseurl+id;
  let title = grabValueFrom(textData, "text");
  let length = grabValueFrom(textData, "lengthSeconds");
  let creator = grabValueFrom(textData, ["shortBylineText", "text"])
  return dataTemplate(url, length, creator, title)
}
