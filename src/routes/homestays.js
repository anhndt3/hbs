const express = require('express');
const {
    getHomestays,
    getHomestay,
    createHomestay,
    updateHomestay,
    deleteHomestay
} = require('../controllers/homestays');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect, getHomestays)
    .post(protect, authorize('admin'), createHomestay);

router
    .route('/:id')
    .get(protect, getHomestay)
    .put(protect, updateHomestay)
    .delete(protect, authorize('admin'), deleteHomestay);

module.exports = router;