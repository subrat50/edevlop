const userModel = require("../models/userModel.js");
const noticeModel = require("../models/noticeModel.js");

const createNotice = async (req, res) => {
  try {
    let requestbody = req.body;
    let {userId } = requestbody;
    const finduser = await userModel.findById({ _id: userId });
    console.log(finduser.role);
    if (!finduser) return res.status(404).send({ msg: "User Not Found" });

    if (finduser.role === "ADMIN") {
      let addnotice = await noticeModel.create(requestbody);
      return res.status(201).send({
        status: true,
        message: "Notice Create Successfully",
        data: addnotice,
      });
    } else{
      return res.status(401).send({
        status: true,
        message: "Not Authorised",
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getNotice = async function (req, res) {
  try {
    const query = req.query;
    let findNotice = await noticeModel.find(query);

    return res
      .status(200)
      .send({ staus: true, msg: "All notice", data: findNotice });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateNotice = async function (req, res) {
  try {
    
    req.userId;
    let finduser = await userModel.findById(req.userId);
    console.log(finduser.role);
    if (!finduser)
      return res.status(404).send({ status: false, message: "User Not Found" });
    if (finduser.role === "ADMIN") {
      const requestbody = req.body;
      let NoticeId = req.params.id;
      const findNotice = await noticeModel.findById(NoticeId);
      if (!findNotice)
        return res.status(404).send({ status: false, msg: "Notice not Found" });
  
      const updateNotice = await noticeModel.findByIdAndUpdate(
        { _id: NoticeId },
        requestbody,
        { new: true }
      );
      return res
        .status(200)
        .send({
          status: true,
          msg: "Notice  Update Successfully",
          data: updateNotice,
        });
    } else {
      return res.status(200).send({
        status: false,
        message: "Unautrorized User",
      });
    }


  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });

  }
 
};

const deleteNotice = async function (req, res) {
 try {
  req.userId;
  let finduser = await userModel.findById(req.userId);
  console.log(finduser.role);
  if (!finduser)
    return res.status(404).send({ status: false, message: "User Not Found" });
  if (finduser.role === "ADMIN") {
    let NoticeId = req.params.id;
    console.log(NoticeId);

    const findNotice = await noticeModel.findById(NoticeId);
    if (!findNotice)
      return res.status(404).send({ status: false, msg: "Notice not Found" });

    let deleteNotice = await noticeModel.findByIdAndDelete({
      _id: NoticeId,
    });
    return res.status(200).send({
      status: true,
      message: "Notice Deleted Successfully",
      data: deleteNotice,
    });
  } else {
    return res.status(200).send({
      status: false,
      message: "Unautrorized User",
    });
  }

 } catch (error) {
  return res.status(500).send({ status: false, message: error.message });

 }
  
};
module.exports = { createNotice, getNotice, updateNotice, deleteNotice };
