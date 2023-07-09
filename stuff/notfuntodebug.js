(async ()=>{class scrape_helper{
	constructor(initdata){
		this.initdata = initdata
		this.name = grabValueFrom(JSON.stringify(initdata.header), "title")
		this.continuation = grabValueFrom(JSON.stringify(initdata), ["continuation", "token"])
		this.pathname = grabValueFrom(initdata, "apiUrl")
		this.videoCount = grabValueFrom(initdata, ["videosCount", "text"])
		this.apikey = this._get_apikey()
		this.url = `${location.origin}${this.pathname}?key=${this.apikey}`
		this.version = this._get_version()
		this.videos = grabValueFrom(initdata, ["content", "contents"])
		this.videosJson = []
		this.videosM3U = ""
		this.filename = ""

		// remove continue token
		// this.videos.pop()
	}

	_get_version(){
		var scripts = Array.from(document.scripts)
		var version = scripts
			.map(value=>value.innerHTML.match(/clientVersion":"(.+?)"/))
			.filter(value=>value)
		return version[0][1]
	}

	_get_apikey(){
		var scripts = Array.from(document.scripts)
		var apikey = scripts
			.map(value=>value.innerHTML.match(/IN+ER...._API_KEY":"(.+?)"/))
			.filter(value=>value)
		return apikey[0][1]
	}


	async _getBatch(){
		var payload =`
		{
			"context": {
				"client": {
					"clientName": "WEB",
					"clientVersion": "${this.version}",
				},
			},
			"continuation": "${this.continuation}"
		}`

		var retValue = {}
		await fetch(this.url, {
			"headers": {
				"Accept": "*/*",
				"Content-Type": "application/json"
			},
			"body": payload,
			"method": "POST"
		})
		.then(async (responseData) => {retValue = await responseData.json()});
		return retValue;
	}

	async getAllVids(){
		var x = 0
		if(this.videos.length >= this.videoCount){
			return this.videos
		}

		console.log(this.videos.length, this.videoCount)
		console.log("fetching...")
		var notFinish = true
		while(x<100 && notFinish){
			console.log(`page: ${x}`)
			var resp = await this._getBatch()
			// debugger
			var videos = grabValueFrom(resp, "continuationItems")

			try{
				var new_continuation = grabValueFrom(resp, ["continuationEndpoint", "token"])
				this.continuation = new_continuation
			}catch{
				notFinish = false
			}
			
			// console.log(videos.length, videos)
			// console.log(videos.length, videos.slice(-1))

			this.videos = this.videos.concat(videos) 
			x++
			await sleep(500)
		}
		this.videos = this.videos.filter(value=>!Object.keys(value)[0].includes("continuationItem"))
		// console.log(this.videos)
		return this.videos
	}

	async getAllAsJson(){
		if(this.videosJson.length > 0){
			return this.videosJson
		}
		this.videosJson = await this.getAllVids()
		this.videosJson = postProcess(this.videosJson, this.name)
		return this.videosJson
	}

	async getAllAsM3U(){
		if(this.videosM3U.length != ""){
			return this.videosM3U
		}
		this.videosM3U = await this.getAllAsJson()
		this.videosM3U = convertToM3U(this.videosM3U)
		return this.videosM3U
	}
	
	async downloadAsJson(){
		var jsonPlaylist = await this.getAllAsJson()
		console.save(jsonPlaylist, `${this.name}.json`)
	}

	async downloadAsM3U(){
		var M3UPlaylist = await this.getAllAsM3U()
		console.save(M3UPlaylist, `${this.name}.M3U8`)
	}

	async downloadPlaylist(){
		await downloadAsM3U()
		await downloadAsJson()
	}
}












































function grabValueFrom(buffer, key, {offset=0, index=1}={}){
	if(typeof buffer !== 'string' ){
		buffer = JSON.stringify(buffer)
	}
	var formartedBuff = buffer.replaceAll(/(:\s+)(\d+)/g,"$1\"$2\"")
	if(!key.length){throw "Error: need array or string"}
	let keys = (typeof key == "string")?[key]:key
	let data = buffer

	if(!isKeyExist(buffer, keys)){
		// debugger
		throw(`keys/path [${keys.join(" > ")}] dont exist`)
	}

	for(key of keys){
		let keyPos = getKeyPos(data, key, index)
		if(keyPos == -1){throw `Error: key not found in buffer`}
		let buffPos = getBuffPos(data, keyPos+offset)
		data = data.slice(...buffPos)	
	}
	try{
		return JSON.parse(data)
	}catch{
		console.log(data)
		throw "error, not a valid json!"
	}
}

function isKeyExist(buffer, keys){
	var pattern = keys.join(".*?")
	return buffer.match(new RegExp(pattern))
}

function getKeyPos(buffer, toFind, index){
	return buffer.split(toFind, index).join(toFind).length;
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














(function(console){

console.save = function(data, filename){

    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, '\t')
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 }
})(console)














function convertToM3U(data){
	let m3u = "#EXTM3U\n\n"
	let converted = data.map((value)=>{
		return `#EXTINF:${value.length},${value.title}\n${value.url}`
	})
	return m3u+converted.join("\n")
}

















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
	
	if(mode_debug===1){
		debugger
	}
	
	let length= dataFunc[mode].lengthFunc(textData);
	length = (length != "NaN") ? length : "1"
	let creator= dataFunc[mode].creator(textData, filename);
	// console.log(dataTemplate(url, length, creator, title))
	return dataTemplate(url, length, creator, title)
}













function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}










function convertToM3U(data){
	let m3u = "#EXTM3U\n\n"
	let converted = data.map((value)=>{
		return `#EXTINF:${value.length},${value.title}\n${value.url}`
	})
	return m3u+converted.join("\n")
}








function convertToSecondSimple(time){
	const timeConvertTable=[1, 60, 3600, 86400]
	return time.split(":").reverse().reduce((prev,curr,index)=>{
		return prev + parseInt(curr)*timeConvertTable[index]
	}, 0)
}

mode_debug = 0

// to run
// var custom_handler = new scrape_helper(initdata)
// var temp = await custom_handler.getAllVids()
// var temp2 = await custom_handler.getAllAsJson()
// var temp3 = await custom_handler.getAllAsM3U()
// custom_handler.downloadPlaylist()
})()
