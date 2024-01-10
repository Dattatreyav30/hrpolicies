const mongoose = require("mongoose");

const subheadingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  heading: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Heading",
  },
});

const Subheading = mongoose.model("Subheading", subheadingSchema);

module.exports = Subheading;
