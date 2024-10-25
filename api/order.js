const express = require('express');
const router = express.Router();

module.exports = router;

class OrderPostRequest {
    constructor(OID , senderID, recieverID, name, description, origin, destination, status, img) {
        this.OID = OID,
        this.senderID = senderID;
        this.recieverID = recieverID;
        this.name = name;
        this.description = description;
        this.origin = origin;
        this.destination = destination;
        this.status = status;
        this.img = img;
    }
}

router.get('/sender/:id', (req, res) => {
    const db = req.db;
    let id = +req.params.id;

    db.all(`SELECT orderITEM.*, 
       sender.name AS sender_name, 
       receiver.name AS receiver_name,
       CASE 
           WHEN orderITEM.status = 1 THEN 'รอไรเดอร์มารับสินค้า'
           WHEN orderITEM.status = 2 THEN 'ไรเดอร์รับงานแล้ว'
           WHEN orderITEM.status = 3 THEN 'ไรเดอร์กำลังเดินทาง'
           WHEN orderITEM.status = 4 THEN 'ไรเดอร์ส่งสินค้าแล้ว'
           ELSE 'ไม่ทราบสถานะ'
        END AS status_message
        FROM orderITEM
        JOIN user AS sender ON orderITEM.senderID = sender.UID
        JOIN user AS receiver ON orderITEM.recieverID = receiver.UID
        WHERE orderITEM.senderID = ?;`, 
            [id], (err, result) => {
        if (err) throw err;
        if (result.length <= 0) {
            return res.status(404).json({ message: 'ไม่มีข้อมูลสำหรับ ID นี้' });
        }
        return res.status(200).json(result);
    });
});

router.get('/reciever/:id', (req, res) => {
    const db = req.db;
    let id = +req.params.id;

    db.all(`SELECT orderITEM.*, 
       sender.name AS sender_name, 
       receiver.name AS receiver_name,
       CASE 
           WHEN orderITEM.status = 1 THEN 'รอไรเดอร์มารับสินค้า'
           WHEN orderITEM.status = 2 THEN 'ไรเดอร์รับงานแล้ว'
           WHEN orderITEM.status = 3 THEN 'ไรเดอร์กำลังเดินทาง'
           WHEN orderITEM.status = 4 THEN 'ไรเดอร์ส่งสินค้าแล้ว'
           ELSE 'ไม่ทราบสถานะ'
        END AS status_message
        FROM orderITEM
        JOIN user AS sender ON orderITEM.senderID = sender.UID
        JOIN user AS receiver ON orderITEM.recieverID = receiver.UID
        WHERE orderITEM.recieverID = ?;`, 
            [id], (err, result) => {
        if (err) throw err;
        if (result.length <= 0) {
            return res.status(404).json({ message: 'ไม่มีข้อมูลสำหรับ ID นี้' });
        }
        return res.status(200).json(result);
    });
});


router.post('/add', (req, res) => {
    const db = req.db;
    db.run("PRAGMA busy_timeout = 3000"); // ตั้งค่าให้รอ 3000 มิลลิวินาที (3 วินาที)
    const { senderID, recieverID, name, description, origin, destinationstatus, status, img } = req.body;

    // เพิ่มข้อมูลผู้ใช้ใหม่เข้าไปในตาราง users
    db.run(`INSERT INTO orderITEM (senderID, recieverID, name, description, origin, destination, status, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [senderID, recieverID, name, description, origin, destinationstatus, status, img], function (err) {
            if (err) {
                return res.status(400).json({ message: 'Error inserting user', error: err.message });
            }
            res.json({ message: 'Order added successfully', uid: this.lastID });
        });
});

router.put("/update/:id", (req, res) => {
    const db = req.db;
    let id = +req.params.id;
    let orderItem = new OrderPostRequest(
        id,
        req.body.senderID,
        req.body.recieverID,
        req.body.name,
        req.body.description,
        req.body.origin,
        req.body.destination,
        req.body.status,
        req.body.img,
    )
    let sql =
        "UPDATE orderItem set `senderID`=?, `recieverID`=?, `name`=?, "
        +"`description`=?, `origin`=?, `destination`=?, `status`=?, `img`=? "
        +"where `OID`=?";
    db.run(sql, [
        orderItem.senderID,
        orderItem.recieverID,
        orderItem.name,
        orderItem.description,
        orderItem.origin,
        orderItem.destination,
        orderItem.status,
        orderItem.img,
        id
    ], function (err) {
            if (err) {
                return res.status(400).json({ message: 'Error inserting user', error: err.message });
            }
            res.status(201).json({ message: 'Order Updated successfully', OID: id });
        });
});

router.get('/details/:id', (req, res) => {
    const db = req.db;
    let id = +req.params.id;

    db.all(`SELECT orderITEM.*, 
       sender.name AS sender_name, 
       receiver.name AS receiver_name,
       CASE 
           WHEN orderITEM.status = 1 THEN 'รอไรเดอร์มารับสินค้า'
           WHEN orderITEM.status = 2 THEN 'ไรเดอร์รับงานแล้ว'
           WHEN orderITEM.status = 3 THEN 'ไรเดอร์กำลังเดินทาง'
           WHEN orderITEM.status = 4 THEN 'ไรเดอร์ส่งสินค้าแล้ว'
           ELSE 'ไม่ทราบสถานะ'
        END AS status_message
        FROM orderITEM
        JOIN user AS sender ON orderITEM.senderID = sender.UID
        JOIN user AS receiver ON orderITEM.recieverID = receiver.UID
        WHERE orderITEM.OID = ?;`, 
            [id], (err, result) => {
        if (err) throw err;
        if (result.length <= 0) {
            return res.status(404).json({ message: 'ไม่มีข้อมูลสำหรับ ID นี้' });
        }
        return res.status(200).json(result);
    });
});