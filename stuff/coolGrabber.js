(function(console){

	console.saveData = function(blob, filename){

	    if(!blob) {
	        console.error('Console.saveData: No blob')
	        return;
	    }

	    if(!filename) filename = 'console.json'

	    var e = document.createEvent('MouseEvents'),
	        a = document.createElement('a')

	    a.download = filename
	    a.href = window.URL.createObjectURL(blob)
	    a.dataset.downloadurl =  ['image/png', a.download, a.href].join(':')
	    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
	    a.dispatchEvent(e)
	}
})(console)

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadData(url,name,delay=2){
	var blobData = await fetch(url).then(data=>data.blob())
	await sleep(delay*1000)
	console.saveData(blobData, name)
}










async function start(){
	var stickerIterator = document.evaluate(
		"/html/body/div[1]/div[2]/div[2]/section/div[1]/div[3]/div[2]/div[3]/ul/li/div[1]/span", 
		document,
		null,
	  XPathResult.ANY_TYPE,
	  null)

	var stickerHead = document.evaluate(
		"/html/body/div[1]/div[2]/div[2]/section/div[1]/div[1]", 
		document,
		null,
	  XPathResult.ANY_TYPE,
	  null).iterateNext();

	var stickersTitles = document.evaluate(
		"/html/body/div[1]/div[2]/div[2]/section/div[1]/div[1]/ul/div[1]/p", 
		document,
		null,
	  XPathResult.ANY_TYPE,
	  null).iterateNext();


	var stickerNode = stickerIterator.iterateNext();
	var stickerList = [];

	for(var i = 0;i < 500 && stickerNode; i++){
		stickerList.push(stickerNode);
	  stickerNode = stickerIterator.iterateNext();
	}

	var isAnimated = stickerHead.innerHTML.includes("Animation only icon")

	var urlList = []
	var name = stickersTitles.innerText.replaceAll(" ","_")

	if(isAnimated){
		urlList = stickerList.map(value=>value.style.backgroundImage.match(/url\("(.*)"\)/)[1].replaceAll("@2x.png", "_animation@2x.png"))
	}else{
		urlList = stickerList.map(value=>value.style.backgroundImage.match(/url\("(.*)"\)/)[1])
	}

	for( const [index, url] of urlList.entries()){
		await downloadData(url,name + `__(${String(index)})`)
	}
}

await start()
