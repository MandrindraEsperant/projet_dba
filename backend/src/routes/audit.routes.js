const express = require("express");
const router = express.Router();
const auditController = require("../controllers/audit.controller");

// Read all logs
router.get("/", auditController.getAuditLogs);

// Read single log
router.get("/:id", auditController.getAuditLogById);

// Delete log
router.delete("/:id", auditController.deleteAuditLog);

module.exports = router;