import mongoose from "mongoose";

const { Schema } = mongoose;

const DeductionSchema = new Schema(
  {
    deduction: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Deduction = mongoose.model("Deduction", DeductionSchema);

export default Deduction;
