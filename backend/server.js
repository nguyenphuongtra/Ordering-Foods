require('dotenv').config();
const express = require("express")
const session = require('express-session');
const connectDB = require("./config/database")
const cors = require("cors")
const app = express()
const port = 4000;

const authRouter =  require("./routes/auth")
const userRouter = require("./routes/user");
const foodRouter = require("./routes/food");
const categoryRouter = require("./routes/category");
const adminRouter = require("./routes/admin");
// const tableRouter = require("./routes/table");
app.use(express.json())
app.use(cors())
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));
connectDB();



app.use("/api/user",userRouter)
app.use("/api/food", foodRouter);
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
// app.use("api/table", tableRouter );
app.use("/admin", adminRouter);
app.get("/",(req,res)=>{
    res.send("Hello Team 1")
})

app.listen(port,()=>{
    console.log(`Server running on port http://localhost:${port}`)
})
