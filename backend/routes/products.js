const express = require('express');
const db = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let {
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'name',
      order = 'ASC',
      page = 1,
      limit = 50,
    } = req.query;

    page = parseInt(page);
    if (isNaN(page) || page < 1) page = 1;

    limit = parseInt(limit);
    if (isNaN(limit) || limit < 1) limit = 50;

    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        query += ' AND price >= ?';
        params.push(min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        query += ' AND price <= ?';
        params.push(max);
      }
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const validSortFields = ['name', 'price', 'rating', 'created_at'];
    let sortField = 'name';
    let sortOrder = 'ASC';

    if (validSortFields.includes(sortBy)) {
      sortField = sortBy;
    }

    if (sortBy === 'price_desc') {
      sortField = 'price';
      sortOrder = 'DESC';
    } else if (sortBy === 'price') {
      sortField = 'price';
      sortOrder = 'ASC';
    } else if (order && ['ASC', 'DESC'].includes(order.toUpperCase())) {
      sortOrder = order.toUpperCase();
    }

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    // Inject limit and offset directly (not as parameters)
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    console.log('SQL Query:', query);
    console.log('Params:', params);

    const [products] = await db.execute(query, params);

    // Count total products
    let countQuery = 'SELECT COUNT(*) AS total FROM products WHERE 1=1';
    const countParams = [];

    if (category && category !== 'All') {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        countQuery += ' AND price >= ?';
        countParams.push(min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        countQuery += ' AND price <= ?';
        countParams.push(max);
      }
    }

    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;
