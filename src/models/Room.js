const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    homestay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Homestay',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    basePrice: {
        type: Number,
        required: [true, 'Please add a base price']
    },
    capacity: {
        type: Number,
        required: [true, 'Please add capacity']
    },
    beds: {
        type: Number,
        required: [true, 'Please add number of beds']
    },
    roomType: {
        type: String,
        required: [true, 'Please add a room type'],
        enum: ['single', 'double', 'twin', 'family', 'suite']
    },
    amenities: {
        type: Object,
        default: {}
    },
    photoUrls: {
        type: [String],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Room', RoomSchema);