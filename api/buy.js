const express = require('express');
const pool = require('../db');  // Assuming DB connection in separate module
const router = express.Router();

// Get all buy records
router.get('/api/buy', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM buy');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching buy records' });
  }
});

// Add a new buy record
router.post('/api/buy', async (req, res) => {
  const { product_name, party_name, rate, date, payment_status } = req.body;

  // Validation: Check for missing fields
  if (!product_name || !party_name || !rate || !date || !payment_status) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO buy (product_name, party_name, rate, date, payment_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [product_name, party_name, rate, date, payment_status]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error adding buy record' });
  }
});

// update buy record
 
router.put('/api/buy/:id', async (req, res) => {
  const { id } = req.params;
  const { product_name, party_name, rate, payment_status, date } = req.body;

  const dateObj = new Date(date); 
  const utcDate = dateObj.toISOString(); 

  try {
    const result = await pool.query(
      `UPDATE buy SET product_name = $1, party_name = $2, rate = $3, payment_status = $4, date = $5 WHERE id = $6`,
      [product_name, party_name, rate, payment_status, utcDate, id]
    );
    

    if (result.rowCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

 // Delete a buy record
 router.delete('/api/buy/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM buy WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting buy record' });
  }
});

module.exports = router;
