const express = require("express");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authMemberValidator");

const {
  signupMember,
  loginMember,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authMemberService");

const router = express.Router();

router.post("/signup", signupValidator, signupMember);
router.post("/login", loginValidator, loginMember);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.put("/resetPassword", resetPassword);

module.exports = router;
