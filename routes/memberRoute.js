const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/memberValidator");

const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require("../services/memberService");

const authMemberService = require("../services/authMemberService");

const router = express.Router();

router.get("/getMe", getLoggedUserData, getUser);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);

router.put(
  "/changePassword/:id",
  authMemberService.protect,
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(
    authMemberService.protect,
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
