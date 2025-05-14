const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    settingName: {
        type: String,
        required: [true, 'Please add a setting name'],
        unique: true,
        trim: true
    },
    settingValue: {
        type: String,
        required: [true, 'Please add a setting value']
    },
    settingGroup: {
        type: String,
        required: [true, 'Please add a setting group']
    }
});

module.exports = mongoose.model('Setting', SettingSchema);