function getYtInfoFrmUrl(ytUrl){
	var pattern = /(?:https:\/\/)(?:www\.youtube\.com\/|youtu\.be)(?:watch\?v=|embed\/|\/)(\w+)(?:(?:&t=)(\d+)|)/
	var matched = ytUrl.match(pattern)
	matched.shift()
	return matched
}
