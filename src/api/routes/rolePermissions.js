const express = require("express");
const router = express.Router();
const {
  addRoleAndPermissions,
  getPermissionsByRoleId,
} = require("../controllers/rolePermissionController");

router.post("/", addRoleAndPermissions);
router.get("/:id", getPermissionsByRoleId);

module.exports = router;
