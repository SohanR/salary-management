import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DataEmployeeSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
      default: () => mongoose.Types.ObjectId().toString(),
    },
    nid: {
      type: String,
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: String,
    gender: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    joinDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    url: String,
    accessRights: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const EmployeeModel = mongoose.model("Employee", DataEmployeeSchema);

export default EmployeeModel;
