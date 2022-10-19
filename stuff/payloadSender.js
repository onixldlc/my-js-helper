var payload = (clientVersion, continuation="") => `
{
	"context": {
		"client": {
			"clientName": "WEB",
			"clientVersion": "${clientVersion}"
		}
	}
	${(continuation)?`,"continuation": "${continuation}"`:""}
}`


async function grabBatch(url, version, continuation){
	var retValue = ""
	await fetch(url, {
		"headers": {
			"Accept": "*/*",
			"Content-Type": "application/json"
		},
		"body": `${payload(version,continuation)}`,
		"method": "POST"
	})
	.then(async (responseData) => {retValue = await responseData.json()});
	return retValue;
}
