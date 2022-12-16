const express = require("express");
const router = express.Router();
const {
  addRoleAndPermissions,
  getPermissionsByRoleId,
} = require("../controllers/rolePermissionContoller");

router.post("/", addRoleAndPermissions);
router.get("/:id", getPermissionsByRoleId);

module.exports = router;
