const mongoose = require("mongoose");

const BillingSchema = new mongoose.Schema(
{
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    discount: { type: String, require: true},
    services: [
    {
        name: { type: String, required: true },
        cost: { type: Number, required: true },
    },
    ],
    medications: [
    {
        name: { type: String, required: true },
        cost: { type: Number, required: true },
    },
    ],
    doctorTax: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
},
{ timestamps: true }
);

module.exports = mongoose.model("Billing", BillingSchema);
