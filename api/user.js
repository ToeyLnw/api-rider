const express = require('express');
const router = express.Router();

module.exports = router;

class UserPostRequest {
    constructor(UID, tel, pass, name, address, img) {
        this.UID = UID,
            this.tel = tel;
        this.pass = pass;
        this.name = name;
        this.address = address;
        this.img = img;
    }
}

router.get('/getAll', (req, res) => {
    const db = req.db; // รับ db จาก req

    // ตรวจสอบว่า db ถูกกำหนดไว้หรือไม่
    if (!db) {
        return res.status(500).json({ message: 'Database connection not available' });
    }

    db.all(`SELECT * FROM user`, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ message: 'Error fetching users', error: err.message });
        }
        res.json(rows);
    });
});

router.get('/find/:id', (req, res) => {
    const db = req.db;
    let id = +req.params.id;

    db.all(`SELECT * FROM user where UID = ?`, [id], (err, result) => {
        if (err) throw err;
        return res.status(200).json(result);
    });
});

router.get('/findtel/:tel', (req, res) => {
    const db = req.db;
    let tel = req.params.tel; // ไม่ต้องแปลงเป็นตัวเลข
    console.log(tel);
    
    db.all(`SELECT * FROM user WHERE tel = ?`, [tel], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
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

    db.all(`SELECT count(*) AS count FROM user WHERE tel = ? 
        UNION 
        SELECT count(*) AS count FROM rider WHERE tel = ?`, [tel, tel], function (err, results) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        // ตรวจสอบผลลัพธ์จากทั้งสองตาราง
        const totalCount = results.reduce((sum, row) => sum + row.count, 0);

        if (totalCount > 0) {
            return res.status(400).json({ message: 'This phone already exists' });
        } else {
            // ถ้าไม่มีข้อมูลซ้ำ ทำการบันทึกข้อมูลใหม่
            db.run(`INSERT INTO user (tel, pass, name, address, GPS, img) VALUES (?, ?, ?, ?, ?, ?)`,
                [tel, pass, name, address, "", img], function (err) {
                    if (err) {
                        return res.status(400).json({ message: 'Error inserting user', error: err.message });
                    }
                    res.json({ message: 'User added successfully', uid: this.lastID });
                });
        }
    });
    // เพิ่มข้อมูลผู้ใช้ใหม่เข้าไปในตาราง users
});

router.delete('/del/:id', (req, res) => {
    const db = req.db;
    let id = +req.params.id;

    db.run(`DELETE FROM user WHERE UID = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error deleting user', error: err.message });
        }

        // ตรวจสอบว่ามีแถวที่ถูกลบหรือไม่
        if (this.changes > 0) {
            return res.status(200).json({
                message: 'User deleted successfully naja!',
                affected_row: this.changes
            });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    });
});


router.put("/update/:id", (req, res) => {
    const db = req.db;
    let id = +req.params.id;
    let User = new UserPostRequest(
        id,
        req.body.tel,
        req.body.pass,
        req.body.name,
        req.body.address,
        req.body.GPS,
        req.body.img,
    )
    let sql =
        "UPDATE user set `tel`=?, `pass`=?, `name`=?, `address`=?, `GPS`=?, `img`=? where `UID`=?";
    db.run(sql, [
        User.tel,
        User.pass,
        User.name,
        User.address,
        User.GPS,
        User.img,
        id
    ], function (err) {
        if (err) {
            return res.status(400).json({ message: 'Error inserting user', error: err.message });
        }
        res.status(201).json({ message: 'User Updated successfully', uid: id });
    });
});

router.get("/", (req, res) => {
    if (req.query.id) {
        res.send("Get in user.js Query id: " + req.query.id);
    } else {
        res.send("Get in user.js");
    }
});

router.get("/:id", (req, res) => {
    return res.json({ message: "Get in user.js id: " + req.params.id });
    // res.send();
});