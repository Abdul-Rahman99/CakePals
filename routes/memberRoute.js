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

router.get("/getMe", authMemberService.protect, getLoggedUserData, getUser);
router.put(
  "/changeMyPassword",
  authMemberService.protect,
  updateLoggedUserPassword
);
router.put(
  "/updateMe",
  authMemberService.protect,
  updateLoggedUserValidator,
  updateLoggedUserData
);
router.delete("/deleteMe", authMemberService.protect, deleteLoggedUserData);

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
