const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser'); // เพิ่มการใช้ body-parser
const path = require('path');
const riderRouter = require("./api/rider");
const userRouter = require("./api/user");
const loginRouter = require("./api/login");
const orderRouter = require("./api/order");
const fileRouter = require("./api/file_upload");

const app = express();
const PORT = 3000;

// เชื่อมต่อกับฐานข้อมูล SQLite (สร้างไฟล์ database_delivery.db ถ้ายังไม่มี)
const dbPath = path.resolve(__dirname, 'rider.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } 
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware สำหรับส่ง db ให้กับ router
app.use((req, res, next) => {
    req.db = db;
    next();
  });

app.use("/rider", riderRouter);
app.use('/user', userRouter);
app.use('/login', loginRouter);
app.use('/order', orderRouter);
app.use('/file', fileRouter);


// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

// fang narak makkkkk
// ok kub

//node index.js