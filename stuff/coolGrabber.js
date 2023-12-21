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
var name = stickersTitles.innerText

if(isAnimated){
	urlList = stickerList.map(value=>value.style.backgroundImage.match(/url\("(.*)"\)/)[1].replaceAll("@2x.png", "_animation@2x.png"))
}else{
	urlList = stickerList.map(value=>value.style.backgroundImage.match(/url\("(.*)"\)/)[1])
}

var finalDatas = {
	stickerNames:stickersTitles.innerText,
	stickers:urlList
}

console.log(JSON.stringify(finalDatas, null, 2))
