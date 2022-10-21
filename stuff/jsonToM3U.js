function convertToM3U(data){
	let m3u = "#EXTM3U\n\n"
	let converted = data.map((value)=>{
		return `#EXTINF:${value.length},${value.title}\n${value.url}`
	})
	return m3u+converted.join("\n")
}
