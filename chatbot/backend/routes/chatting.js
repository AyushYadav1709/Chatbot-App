const express = require("express");

const chattingController = require("../controller/chatting");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/all-chats", isAuth, chattingController.getAllChats);

router.get("/fetch-chat/:chatID", isAuth, chattingController.getSpecificChat);

router.post(
  "/chatting/:chatID",
  isAuth,
  chattingController.postExistingChatting
);

router.post("/chatting-new", isAuth, chattingController.postNewChatting);

module.exports = router;
