const express = require('express');
const router = express.Router();

module.exports = router;

// class UserPostRequest {
//     constructor(UID ,tel, pass, name, address, GPS, img) {
//         this.UID = UID,
//         this.tel = tel;
//         this.pass = pass;
//         this.name = name;
//         this.address = address;
//         this.GPS = GPS;
//         this.img = img;
//     }
// }

router.get('/getAll', (req, res) => {
    const db = req.db; // รับ db จาก req

    // ตรวจสอบว่า db ถูกกำหนดไว้หรือไม่
    if (!db) {
        return res.status(500).json({ message: 'Database connection not available' });
    }

    db.all(`SELECT * FROM rider`, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ message: 'Error fetching users', error: err.message });
        }
        res.json({ data: rows });
    });
});

router.get("/", (req, res) => {
    if (req.query.id) {
        res.send("Get in user.js Query id: " + req.query.id);
    } else {
        res.send("Get in rider.js");
    }
});

router.get("/:id", (req, res) => {
    return res.json({ message: "Get in rider.js id: " + req.params.id });
    // res.send();
});

router.get('/find/:id', (req, res) => {
    const db = req.db;
    let id = +req.params.id;

    db.all(`SELECT * FROM rider where RID = ?`, [id], (err, result) => {
        if (err) throw err;
        return res.status(200).json(result);
    });
});



router.post('/add', (req, res) => {
    const db = req.db;
    const { tel, pass, name, address, img } = req.body;

    // ตรวจสอบว่ามีการส่งข้อมูลครบหรือไม่
    // if (!name || !phone || !password || !address || !gps) {
    //   return res.status(400).json({ message: 'Please provide all required fields: name, phone, password, address, gps' });
    // }

    // เพิ่มข้อมูลผู้ใช้ใหม่เข้าไปในตาราง users
    db.run(`INSERT INTO rider (tel, pass, name, address, license_plate, img) VALUES (?, ?, ?, ?, ?, ?)`,
        [tel, pass, name, address, "", img], function (err) {
            if (err) {
                return res.status(400).json({ message: 'Error inserting rider', error: err.message });
            }
            res.json({ message: 'Rider added successfully', rid: this.lastID });
        });
});

router.delete('/del/:id', (req, res) => {
    const db = req.db;
    let id = +req.params.id;

    db.run(`DELETE FROM rider where RID = ?`, [id], (err, result) => {
        if (err) throw err;
        return res.status(200).json({
            message: 'Rider deleted successfully naja!',
            affected_row: result.affectedRows
        });
    });
});

// router.put("/update/:id", (req, res) => {
//     const db = req.db;
//     let id = +req.params.id;
//     let User = new UserPostRequest(
//         id,
//         req.body.tel,
//         req.body.pass,
//         req.body.name,
//         req.body.address,
//         req.body.GPS,
//         req.body.img,
//     )
//     let sql =
//         "UPDATE user set `tel`=?, `pass`=?, `name`=?, `address`=?, `GPS`=?, `img`=? where `UID`=?";
//     db.run(sql, [
//         User.tel,
//         User.pass,
//         User.name,
//         User.address,
//         User.GPS,
//         User.img,
//         id
//     ], function (err) {
//             if (err) {
//                 return res.status(400).json({ message: 'Error inserting user', error: err.message });
//             }
//             res.status(201).json({ message: 'User Updated successfully', uid: id });
//         });
// });