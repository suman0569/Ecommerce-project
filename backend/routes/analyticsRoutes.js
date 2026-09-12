const express = require('express');
const {getAdminStats} = require('../controller/analyticsController');
const {protect} = require('../middleware/authMiddleware');
const {admin} = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', protect, admin, getAdminStats);

module.exports = router;