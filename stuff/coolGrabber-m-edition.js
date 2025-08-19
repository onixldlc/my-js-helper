function tableToJson(table) {
    var result = {}
    var body = table.getElementsByTagName("tbody")
    var rows = body[0].getElementsByTagName("td")
    Array.from(rows).forEach((row, index) => {
        if (index % 2 === 0) {
            var key = row.innerText.trim()
            var value = rows[index + 1].innerText.trim()
            result[key] = value
        }
    })
    return result
}

function getList(){
    var list = Array.from(document.getElementsByClassName("has-inner-focus"))
    var filtered_list = list.filter((el)=>{return el.className == "has-inner-focus"})
    var filtered_table = filtered_list.filter((el)=>{return el.innerText.includes("system edition")})
    var titles = filtered_table.map(el=>{return el.previousElementSibling.previousElementSibling.innerText})
    
    var json_table = filtered_table.map(el=>{return tableToJson(el)})
    var final_json = json_table.reduce((acc, curr, index) => {
        acc[titles[index]] = curr
        return acc
    }, {})
    return final_json
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


var result = getList()
console.save(result, "m-stuffies.json")