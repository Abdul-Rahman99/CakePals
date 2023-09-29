const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/bakerValidator");

const {
  getUsers,
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
} = require("../services/bakerService");

const authBakerService = require("../services/authBakerService");

const router = express.Router();

router.get("/getMe", authBakerService.protect, getLoggedUserData, getUser);
router.put(
  "/changeMyPassword",
  authBakerService.protect,
  updateLoggedUserPassword
);
router.put(
  "/updateMe",
  authBakerService.protect,
  updateLoggedUserValidator,
  updateLoggedUserData
);
router.delete("/deleteMe", authBakerService.protect, deleteLoggedUserData);

router.put(
  "/changePassword/:id",
  authBakerService.protect,
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(
    authBakerService.protect,
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(authBakerService.protect, deleteUserValidator, deleteUser);

module.exports = router;
