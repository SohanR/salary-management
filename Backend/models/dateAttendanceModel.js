import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DataAttendanceSchema = new Schema({
    month: {
        type: String,
        required: true
    },
    employeeId: {
        type: String,
        required: true
    },
    employeeName: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    jobTitle: {
        type: String
    },
    present: {
        type: Number
    },
    sick: {
        type: Number
    },
    absent: {
        type: Number
    }
}, { timestamps: true });

const DataAttendance = mongoose.model('DataAttendance', DataAttendanceSchema);

export default DataAttendance;
