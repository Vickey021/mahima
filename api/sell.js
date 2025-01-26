const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all sell records
 // Example of the /api/sell GET endpoint
 router.get('/api/sell', async (req, res) => {
  try {
    // Query the database to get all sales data
    const result = await pool.query('SELECT * FROM sell');
    res.status(200).json({ success: true, data: result.rows });
    // console.log(result);
  } catch (err) {
    console.error('Error fetching sales:', err);
    res.status(500).json({ success: false, message: 'Error fetching sales data' });
  }
  // console.log(result);
});

// Add a new sell record
router.post('/api/sell', async (req, res) => {
  const { product_id, party_name, rate, date, payment_status } = req.body;

  try {
    // Validate if the product_id exists in the buy table
    const productResult = await pool.query('SELECT * FROM buy WHERE id = $1', [product_id]);

    if (productResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid product_id. Product not found in buy records.' });
    }

    // Fetch the product_name from the Buy table
    const productResults = await pool.query('SELECT product_name FROM buy WHERE id = $1', [product_id]);
    if (productResults.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    const product_name = productResults.rows[0].product_name;

    // Insert into the sell table
    const result = await pool.query(
      'INSERT INTO sell (product_id, product_name, party_name, rate, date, payment_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [product_id, product_name, party_name, rate, date, payment_status]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error in /api/sell:', err);
    res.status(500).json({ success: false, message: 'Error adding sell record' });
  }
});

// Update a sell record
router.put('/api/sell/:id', async (req, res) => {
  const { id } = req.params;
  const { product_id, product_name, party_name, rate, date, payment_status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE sell SET product_id = $1, product_name = $2, party_name = $3, rate = $4, date = $5, payment_status = $6 WHERE id = $7 RETURNING *',
      [product_id, product_name, party_name, rate, date, payment_status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating sell record' });
  }
});

 // Delete a sell record
 router.delete('/api/sell/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM sell WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting sell record' });
  }
});

module.exports = router;
