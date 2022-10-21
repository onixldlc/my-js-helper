function postProcess(arr, channelName=""){
	return arr.map((value, index)=>{
		let tempData = createData(value, channelName)
		tempData.index=index;
		return tempData;
	})
}

function createData(data, channelName){
	const dataTemplate = (url, length, creator, title)=>{
		return{
			index:0,
			url:url,
			length:length,
			creator:creator,
			title:title
		}
	}

	let baseurl=location.origin;
	let textData = JSON.stringify(data);
	let id = grabValueFrom(textData, ["webCommand"]).url;
	
	let url = baseurl+id;
	let title = grabValueFrom(textData, "text");
	let length="";
	let creator="";
	if(location.pathname.split("/").at(-1) == "videos"){
		let tempTime = grabValueFrom(textData, ["TimeStatus", "label"])
		length = String(convertToSecondSimple(tempTime));
		creator = channelName || ""
	}else if(location.pathname.split("/").at(-1) == "playlist"){
		length = grabValueFrom(textData, "lengthSeconds");
		creator = grabValueFrom(textData, ["shortBylineText", "text"])
	}
	return dataTemplate(url, length, creator, title)
}
