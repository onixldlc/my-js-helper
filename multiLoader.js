function multiLoad(arrScript, baseUrl) {
 arrScript.forEach((value)=>{
   let script = document.createElement("script")
   script.src = `${baseUrl}/${value}.js` 
   document.head.appendChild(script)
 })
}
