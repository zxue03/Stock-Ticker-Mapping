const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    Company: {
        type: String,
        required: true,
    },
    Ticker: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Company", companySchema, "companies");