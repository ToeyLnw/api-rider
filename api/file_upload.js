const express = require('express');
const multer = require('multer');
const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");

const router = express.Router();

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4f5YzpMdt91YAevxglDXw5Q99Ns2lhH8",
  authDomain: "call-rider-3c587.firebaseapp.com",
  projectId: "call-rider-3c587",
  storageBucket: "call-rider-3c587.appspot.com",
  messagingSenderId: "465197385010",
  appId: "1:465197385010:web:29507b664ac67c8fb7c32b",
  measurementId: "G-W0NM449QP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// ตั้งค่า multer ให้ใช้ memory storage
const upload = multer({ storage: multer.memoryStorage() });

// ฟังก์ชันสำหรับดึงวันเวลาในปัจจุบัน
const giveCurrentDateTime = () => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
};

// Route สำหรับอัปโหลดไฟล์
router.post("/", upload.single("filename"), async (req, res) => {
    console.log("file");
  try {
    const dateTime = giveCurrentDateTime();
    const fileName = req.file.originalname + " " + dateTime;

    // สร้าง Reference ไปยังตำแหน่งใน Firebase Storage
    const storageRef = ref(storage, `files/${fileName}`);

    // กำหนด metadata ของไฟล์
    const metadata = {
      contentType: req.file.mimetype,
    };

    // อัปโหลดไฟล์ไปยัง Firebase Storage
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

    // ดึง URL สำหรับดาวน์โหลดไฟล์
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('File successfully uploaded.');
    return res.send({
      message: 'File uploaded to Firebase Storage',
      name: req.file.originalname,
      type: req.file.mimetype,
      downloadURL: downloadURL
    });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    return res.status(400).send({ message: error.message });
  }
});

module.exports = router;
