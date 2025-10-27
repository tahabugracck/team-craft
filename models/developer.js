// models/developer.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const developerSchema = new Schema(
  {
    name: { type: String, required: true },
    skills: { type: String, required: true },
    linkedin: { type: String },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Developer = mongoose.model("Developer", developerSchema);
module.exports = Developer;
