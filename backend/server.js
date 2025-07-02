require('dotenv').config();
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/database")

const app = express()
const port = 4000;



app.use(express.json())
app.use(cors())
connectDB();


// // api endpoints
// app.use("/api/food",foodRouter)
// app.use("/api/user",userRouter)
// app.use("/api/cart",cartRouter)
// app.use("/api/order",orderRouter)



app.get("/",(req,res)=>{
    res.send("Hello Team 1")
})

app.listen(port,()=>{
    console.log(`Server running on port http://localhost:${port}`)
})
