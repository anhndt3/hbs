const mongoose = require('mongoose');

const RoomAvailabilitySchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    specialPrice: {
        type: Number,
        default: null
    }
});

// Compound index to ensure unique date per room
RoomAvailabilitySchema.index({ room: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('RoomAvailability', RoomAvailabilitySchema);