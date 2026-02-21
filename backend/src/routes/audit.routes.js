const express = require("express");
const router = express.Router();
const auditController = require("../controllers/audit.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

// Read all logs
router.get("/", isAuthenticated, auditController.getAuditLogs);

// Read single log
router.get("/:id", isAuthenticated, auditController.getAuditLogById);

// Delete log
router.delete("/:id", isAuthenticated, auditController.deleteAuditLog);

module.exports = router;