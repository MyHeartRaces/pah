const { pool } = require('../models/db');

exports.createAction = async (req, res) => {
    const { action, product_id, store_id, details } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO actions (action, product_id, store_id, details) VALUES ($1, $2, $3, $4) RETURNING *',
            [action, product_id, store_id, details]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getActions = async (req, res) => {
    const { store_id, product_id, action, date_from, date_to, page, limit } = req.query;

    let query = 'SELECT * FROM actions WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (store_id) {
        params.push(store_id);
        query += ` AND store_id = $${paramIndex++}`;
    }

    if (product_id) {
        params.push(product_id);
        query += ` AND product_id = $${paramIndex++}`;
    }

    if (action) {
        params.push(action);
        query += ` AND action = $${paramIndex++}`;
    }

    if (date_from) {
        params.push(date_from);
        query += ` AND timestamp >= $${paramIndex++}`;
    }

    if (date_to) {
        params.push(date_to);
        query += ` AND timestamp <= $${paramIndex++}`;
    }

    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNumber - 1) * pageSize;

    query += ` ORDER BY timestamp DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(pageSize, offset);

    try {
        const result = await pool.query(query, params);
        res.json({
            page: pageNumber,
            limit: pageSize,
            data: result.rows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
