function getAllOriginalUrls(){
	var listImageList = Array.from(document.getElementsByClassName("FnImage")).slice(1).map((value)=>{
		var temp = value.children[0].style.backgroundImage 
		return temp.substr(5,temp.length-7)
	})
	return listImageList
}


function convertToAnm(){
	return getAllOriginalUrls().map((value)=>{
		return value.replace("@2x.png", "_animation@2x.png")
	})
}
