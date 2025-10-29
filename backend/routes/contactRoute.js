const express = require('express');
const { sendContactEmail } = require('../controllers/contactController');

const router = express.Router();

// Route to handle contact form submissions
router.post('/contact', sendContactEmail);

module.exports = router;