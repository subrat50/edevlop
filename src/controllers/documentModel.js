const userModel = require("../models/userModel.js");
const documentModel = require("../models/documentModel.js");

const createDocument = async (req, res) => {
  try {
    let requestbody = req.body;
    let {userId } = requestbody;
    const finduser = await userModel.findById({ _id: userId });
    console.log(finduser.role);
    if (!finduser) return res.status(404).send({ msg: "User Not Found" });

    if (finduser.role === "ADMIN") {
      let addDocument = await documentModel.create(requestbody);
      return res.status(201).send({
        status: true,
        message: "document Create Successfully",
        data: addDocument,
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

const getDocument = async function (req, res) {
  try {
    const query = req.query;
    let findDocument = await documentModel.find(query);

    return res
      .status(200)
      .send({ staus: true, msg: "All document", data: findDocument });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateDocument = async function (req, res) {
  try {
    
    req.userId;
    let finduser = await userModel.findById(req.userId);
    console.log(finduser.role);
    if (!finduser)
      return res.status(404).send({ status: false, message: "User Not Found" });

    if (finduser.role === "ADMIN") {
      const requestbody = req.body;
      let documentId = req.params.id;
      const findDocument = await documentModel.findById(documentId);
      if (!findDocument)
        return res.status(404).send({ status: false, msg: "Document not Found" });
  
      const updateDocument = await documentModel.findByIdAndUpdate(
        { _id: documentId },
        requestbody,
        { new: true }
      );
      return res
        .status(200)
        .send({
          status: true,
          msg: "Document  Update Successfully",
          data:updateDocument
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

const deleteDocument = async function (req, res) {
 try {
  req.userId;
  let finduser = await userModel.findById(req.userId);
  console.log(finduser.role);
  if (!finduser)
    return res.status(404).send({ status: false, message: "User Not Found" });
  if (finduser.role === "ADMIN") {
    let DocumentId = req.params.id;
    console.log(DocumentId);

    const findDocument = await documentModel.findById(DocumentId);
    if (!findDocument)
      return res.status(404).send({ status: false, msg: "Document not Found" });

    let deleteDocument = await documentModel.findByIdAndDelete({
      _id: DocumentId,
    });
    return res.status(200).send({
      status: true,
      message: "Document Deleted Successfully",
      data: deleteDocument,
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
module.exports = { createDocument,getDocument,updateDocument,deleteDocument };
