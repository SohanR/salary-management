import mongoose from "mongoose";

const { Schema } = mongoose;

const JobSchema = new Schema({
  job_id: {
    type: String,
    default: () => {
      // Generate UUID using some library or method
      // Example: return generateUUID();
    },
    required: true,
  },
  job_title: {
    type: String,
    required: true,
    maxLength: 120,
  },
  basic_salary: {
    type: Number,
    required: true,
  },
  transportation_allowance: {
    type: Number,
    required: true,
  },
  meal_allowance: {
    type: Number,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
});

const JobModel = mongoose.model("Job", JobSchema);

export default JobModel;
