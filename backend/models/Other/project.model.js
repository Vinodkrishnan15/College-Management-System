const mongoose = require("mongoose");

const Project = new mongoose.Schema({
  student: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  projectUrl: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  certifications: [{
    filename: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Project", Project);