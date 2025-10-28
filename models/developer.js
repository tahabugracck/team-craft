const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const developerSchema = new Schema(
  {
    name: { type: String, required: true },
    skills: { type: String, 
    },
    linkedin: { type: String },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cvFilePath: {
      type: String,
    },
  },
  { timestamps: true }
);

const Developer = mongoose.model("Developer", developerSchema);
module.exports = Developer;
