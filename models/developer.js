const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const developerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
      required: true,
    },
    linkedin: {
      type: String,
    },
  },
  { timestamps: true }
);

const Developer = mongoose.model("Developer", developerSchema);

module.exports = Developer; // modeli dışa aktar
