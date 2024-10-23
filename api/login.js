const express = require('express');
const router = express.Router();

module.exports = router;

router.post('/', (req, res) => {
    const db = req.db;
    const { tel, pass} = req.body;

    db.get(`SELECT *, 'user' as source FROM user  WHERE tel = ? AND pass = ?
            UNION
            SELECT *, 'rider' as source FROM rider WHERE tel = ? AND pass = ?`,
        [tel, pass, tel, pass,], (err,result) => {
            if (err) throw err;
            if (result) {
                return res.status(200).json({ message: 'Login OK', user: result });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            // return res.status(200).json(result)
        });
})