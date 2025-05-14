const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    guestName: {
        type: String,
        required: [true, 'Please add a guest name']
    },
    guestEmail: {
        type: String,
        required: [true, 'Please add a guest email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    guestPhone: {
        type: String,
        required: [true, 'Please add a guest phone number']
    },
    checkIn: {
        type: Date,
        required: [true, 'Please add a check-in date']
    },
    checkOut: {
        type: Date,
        required: [true, 'Please add a check-out date']
    },
    guestsCount: {
        type: Number,
        required: [true, 'Please add number of guests']
    },
    totalPrice: {
        type: Number,
        required: [true, 'Please add total price']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    specialRequests: {
        type: String
    },
    guestUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add validation for check-out date must be after check-in date
BookingSchema.pre('validate', function (next) {
    if (this.checkOut <= this.checkIn) {
        this.invalidate('checkOut', 'Check-out date must be after check-in date');
    }
    next();
});

module.exports = mongoose.model('Booking', BookingSchema);