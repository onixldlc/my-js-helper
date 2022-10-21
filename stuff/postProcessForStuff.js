function postProcess(arr, filename){
	return arr.map((value, index)=>{
		let tempData = createData(value, filename)
		tempData.index=index;
		return tempData;
	})
}

function createData(data, filename){
	const dataTemplate = (url, length, creator, title)=>{
		return{
			index:0,
			url:url,
			length:length,
			creator:creator,
			title:title
		}
	}
	let dataFunc={
		videos:{
			idFunc:(textData)=>{
				return grabValueFrom(textData, ["webCommand"]).url;
			},
			lengthFunc:(textData)=>{
				let tempTime =  grabValueFrom(textData, ["TimeStatus", "simpleText"]);
				return String(convertToSecondSimple(tempTime));
			},
			creator:(textData, filename)=>{
				return filename;
			}
		},
		playlist:{
			idFunc:(textData)=>{
				return grabValueFrom(textData, ["webCommand"], {index:2}).url.split("&")[0];
			},
			lengthFunc:(textData)=>{
				return grabValueFrom(textData, ["lengthSeconds"]);
			},
			creator:(textData, filename)=>{
				return grabValueFrom(textData, ["shortBylineText", "text"]); 
			}
		}
	}

	let baseurl=location.origin;
	let textData = JSON.stringify(data);
	let mode = location.pathname.split("/").at(-1)
	let id = dataFunc[mode].idFunc(textData);
	
	let url = baseurl+id;
	let title = grabValueFrom(textData, "text");
	let length= dataFunc[mode].lengthFunc(textData);
	length = (length != "NaN") ? length : "1"
	let creator= dataFunc[mode].creator(textData, filename);
	return dataTemplate(url, length, creator, title)
}
