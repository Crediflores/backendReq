const express=require("express");
const cors=require("cors");
const app=express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(require("../routes/index"))

app.listen(8000,()=>{
  console.log("Servidor escuchando en el puerto 8000")
});     


    