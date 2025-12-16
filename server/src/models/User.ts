import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: {
    type: String,
    required: true,
  },


  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },




  phone: String,
  address: String,
}, { timestamps: true });


export default mongoose.model("User", userSchema);
