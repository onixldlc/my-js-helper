function getYtIdFromUrl(Url){
	var pattern = /(?:https:\/\/)(?:www\.youtube\.com\/|youtu\.be)(?:watch\?v=|embed\/|\/)(.*)/
	return Url.match(pattern)[1]
}
