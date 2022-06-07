const express = require("express")

app = express()

app.get("/test",(req, res)=>{
    res.send("test")
})

app.listen(3001)




app.get("/get_something", (req, res)=>{
    let resultObject = {}
    con.query("", (err, result, fields)=>{
        if (err) throw err
        resultObject.title = result[0]["Title"]
        resultObject.content = result[0]["Content"]
        resultObject.Date = result[0]["Date"]
    })

    // do something with resultObject
})