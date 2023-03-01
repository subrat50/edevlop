const express = require('express');
const router=express.Router()
const {createUser,userOtpSend,userLogin}=require("../controllers/userController")
const {createNotice, getNotice, updateNotice, deleteNotice}=require("../controllers/noticeController.js");
const { authenticate } = require('../middleWire/auth');
const { createDocument, getDocument, updateDocument, deleteDocument } = require('../controllers/documentModel');

// user routes
router.post("/register",createUser)
router.post("/user/sendotp",userOtpSend);
router.post("/user/login",userLogin);

// notice routes
router.post("/createNotice",createNotice);
router.get("/getNotice",getNotice);
router.put("/updateNotice/:id",authenticate,updateNotice);
router.delete("/deleteNotice/:id",authenticate,deleteNotice);

// document routes
router.post("/createDocument",createDocument);
router.get("/getDocument",getDocument);
router.put("/updateDocument/:id",authenticate,updateDocument);
router.delete("/deleteDocument/:id",authenticate,deleteDocument);
module.exports=router