const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Homestay = require('../models/Homestay');
const HomestayOwner = require('../models/HomestayOwner');

// @desc    Get all homestays
// @route   GET /api/homestays
// @access  Private
exports.getHomestays = asyncHandler(async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    if (req.user.role === 'admin') {
        // Admins can see all homestays
        query = Homestay.find(JSON.parse(queryStr));
    } else if (req.user.role === 'owner') {
        // Owners can only see their own homestays
        const owner = await HomestayOwner.findOne({ user: req.user.id });

        if (!owner) {
            return next(
                new ErrorResponse(`No homestay owner profile found for this user`, 404)
            );
        }

        query = Homestay.find({
            ...JSON.parse(queryStr),
            owner: owner._id
        });
    } else {
        // Guests cannot access this endpoint
        return next(
            new ErrorResponse(`User not authorized to access this route`, 403)
        );
    }

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Homestay.countDocuments(query);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const homestays = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: homestays.length,
        pagination,
        data: homestays
    });
});

// @desc    Get single homestay
// @route   GET /api/homestays/:id
// @access  Private
exports.getHomestay = asyncHandler(async (req, res, next) => {
    const homestay = await Homestay.findById(req.params.id);

    if (!homestay) {
        return next(
            new ErrorResponse(`Homestay not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is authorized to view homestay
    if (req.user.role !== 'admin') {
        const owner = await HomestayOwner.findOne({ user: req.user.id });

        if (!owner || homestay.owner.toString() !== owner._id.toString()) {
            return next(
                new ErrorResponse(`User not authorized to access this homestay`, 403)
            );
        }
    }

    res.status(200).json({
        success: true,
        data: homestay
    });
});

// @desc    Create new homestay
// @route   POST /api/homestays
// @access  Private (Admin only)
exports.createHomestay = asyncHandler(async (req, res, next) => {
    // Check if admin
    if (req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Only admins can create homestays`, 403)
        );
    }

    // Check if owner exists
    const owner = await HomestayOwner.findById(req.body.owner);
    if (!owner) {
        return next(
            new ErrorResponse(`No homestay owner found with id ${req.body.owner}`, 404)
        );
    }

    const homestay = await Homestay.create(req.body);

    res.status(201).json({
        success: true,
        data: homestay
    });
});

// @desc    Update homestay
// @route   PUT /api/homestays/:id
// @access  Private
exports.updateHomestay = asyncHandler(async (req, res, next) => {
    let homestay = await Homestay.findById(req.params.id);

    if (!homestay) {
        return next(
            new ErrorResponse(`Homestay not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is authorized to update homestay
    if (req.user.role !== 'admin') {
        const owner = await HomestayOwner.findOne({ user: req.user.id });

        if (!owner || homestay.owner.toString() !== owner._id.toString()) {
            return next(
                new ErrorResponse(`User not authorized to update this homestay`, 403)
            );
        }
    }

    homestay = await Homestay.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: homestay
    });
});

// @desc    Delete homestay
// @route   DELETE /api/homestays/:id
// @access  Private (Admin only)
exports.deleteHomestay = asyncHandler(async (req, res, next) => {
    // Check if admin
    if (req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Only admins can delete homestays`, 403)
        );
    }

    const homestay = await Homestay.findById(req.params.id);

    if (!homestay) {
        return next(
            new ErrorResponse(`Homestay not found with id of ${req.params.id}`, 404)
        );
    }

    // Instead of deleting, set isActive to false
    homestay.isActive = false;
    await homestay.save();

    res.status(200).json({
        success: true,
        data: {}
    });
});