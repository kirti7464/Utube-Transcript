const express = require("express")
const app= express()
const cors = require("cors")
const {spchTxt} = require("./Controller/controller.js")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post('/transcribe-audio',spchTxt );
  
app.listen(5000,()=>{
    console.log("App listening at http://localhost:5000")
})
