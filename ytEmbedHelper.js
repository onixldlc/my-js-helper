function getYtInfoFrmUrl(ytUrl){
	var pattern = /(?:https:\/\/)(?:www\.youtube\.com\/|youtu\.be)(?:watch\?v=|embed\/|\/)(\w+)(?:(?:&t=)(\d+)|)/
	var matched = ytUrl.match(pattern)
	matched.shift()
	return matched
}

function getYtIdFromUrl(ytUrl){
	var pattern = /(?:https:\/\/)(?:www\.youtube\.com\/|youtu\.be)(?:watch\?v=|embed\/|\/)(.*)/
	return ytUrl.match(pattern)[1]
}
