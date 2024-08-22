const fs = require("fs");

/*fs.writeFile("message.txt", "Hello from nodeJSS!", (err)=>{
    if(err)
        throw err;
    console.log("Created file!");
})*/

fs.readFile('message.txt', "utf-8", (err, data)=>{
    if(err)
        throw err;
    //var string = new String(data)
    console.log(data);
});