require('dotenv').config();
const express = require("express")
const path = require("path");
const session = require('express-session');
const connectDB = require("./config/database")
const cors = require("cors")
const app = express()
const PORT = process.env.PORT || 4000;

const authRouter =  require("./routes/auth")
const userRouter = require("./routes/user");
const foodRouter = require("./routes/food");
const categoryRouter = require("./routes/category");
// const adminRouter = require("./routes/admin");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const reviewRouter = require("./routes/review");
const tableRouter = require("./routes/table");
const statsRouter = require("./routes/stats");
app.use(express.json())
const allowedOrigins = [
  'http://localhost:3000',
  'https://ordering-foods.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));
connectDB();



app.use("/api/users",userRouter)
app.use("/api/foods", foodRouter);
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/tables", tableRouter);
app.use("/api/stats", statsRouter);
// app.use("/admin", adminRouter);
app.get("/",(req,res)=>{
    res.send("Hello Team 1")
})

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
    });
}

app.listen(PORT,()=>{
    console.log(`Server running on port http://localhost:${PORT}`)
})
