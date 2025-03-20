// controllers/recoveryController.js
const recoveryService = require('../service/recoverService');

exports.recoverData = async (req, res) => {
    try {
        const { id, model } = req.body;

        if (!id || !model) {
            return res.status(400).json({ message: "ID and model are required" });
        }

        // Call the recovery service
        const result = await recoveryService.dataRecover({ id, model });

        // Send success response
        res.status(200).json({ message: "Data recovered successfully", data: result });
    } catch (error) {
        console.error("Error in recovery controller:", error);
        res.status(500).json({ message: "Failed to recover data", error: error.message });
    }
};

exports.recoverAllData = async (req, res) => {
    const { model } = req.body;

    if (!model) {
        return res.status(400).json({ message: "Model is required" });
    }

    try {
        const result = await recoveryService.recoverAllData(model);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in recoverAllData controller:", error);
        res.status(500).json({ message: "Failed to recover all data", error: error.message });
    }
};