const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Details route is under construction' });
});

module.exports = router;
