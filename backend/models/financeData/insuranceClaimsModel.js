const mongoose = require('mongoose');

const InsuranceClaimSchema = new mongoose.Schema({
  claimDate: {
    type: Date,
    required: true,
  },
  claimAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  claimType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('InsuranceClaim', InsuranceClaimSchema);
