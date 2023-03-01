const nodemailer = require("nodemailer");
const validator=require("validator")
const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userotp = require("../models/otpModel.js");
const {isValidPassword}=require("../middleWire/validation.js")
const isrole = (value) => {
  return ["ADMIN", "CONTENT MANAGER", "VIEWERS"].indexOf(value) !== -1;
};

const tarnsporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "subrats004@gmail.com",
    pass: "medpxispostdllbj",
  },
});

const createUser = async (req, res) => {
  try {
    const requestbody = req.body;
    const { email, role,password } = requestbody;
    console.log(requestbody);
    if (!validator.isEmail(email)) {
      return res.status(400).send({ status: false, msg: "Enter a valid email" })
  }
    let findEmail = await userModel.findOne({ email: email });

    if (findEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (!isrole(role)) { return res.status(400).send({ status: false, msg: "Password is invalid" }) }

    if(!isValidPassword(password)){
      return res.status(400).send({ status: false, message: `Password  must include atleast one special character[@$!%?&], one uppercase, one lowercase, one number and should be mimimum 8 to 15 characters long` })

    }
    const salt = await bcrypt.genSalt(10);
    requestbody.password = await bcrypt.hash(password, salt);

    const createUser = await userModel.create(requestbody);
    return res.status(201).json(createUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const userOtpSend = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  if (!email) {
    res.status(400).json({ error: "Please Enter Your Email" });
  }

  try {
    const findMail = await userModel.findOne({ email: email });

    if (findMail) {
      const OTP = Math.floor(100000 + Math.random() * 900000);

      const existEmail = await userotp.findOne({ email: email });

      if (existEmail) {
        const updateData = await userotp.findByIdAndUpdate(
          { _id: existEmail._id },
          {
            otp: OTP,
          },
          { new: true }
        );
        await updateData.save();

        const mailOptions = {
          from: "subrats004@gmail.com",
          to: email,
          subject: "Sending Eamil For Otp Validation",
          text: `OTP:- ${OTP}`,
        };

        tarnsporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("error", error);
            res.status(400).json({ error: "email not sending" });
          } else {
            console.log("Email sent", info.response);
            res.status(200).json({ message: "Email sent Successfully" });
          }
        });
      } else {
        const saveOtpData = new userotp({
          email,
          otp: OTP,
        });

        await saveOtpData.save();
        const mailOptions = {
          from: "subrats004@gmail.com",
          to: email,
          subject: "Sending Eamil For Otp Validation",
          text: `OTP:- ${OTP}`,
        };

        tarnsporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("error", error);
            res.status(400).json({ error: "email not send" });
          } else {
            console.log("Email sent", info.response);
            res.status(200).json({ message: "Email sent Successfully" });
          }
        });
      }
    } else {
      res.status(400).json({status:true, error: "This User Not Exist In our Db" });
    }
  } catch (error) {
    res.status(500).json({status:false, message: error.message });
  }
};


const userLogin = async (req, res) => {
  const { email, otp } = req.body;

  if (!otp || !email) {
    res.status(400).json({ error: "Please Enter Your OTP and email" });
  }

  try {
    const otpverification = await userotp.findOne({ email: email });
   
    // res.setHeader("x-api-key", token);
    if (otpverification.otp === otp) {
      const preuser = await userModel.findOne({ email: email });

      // token generate
      const token1 = jwt.sign(
        {
          email: preuser.email.toString(),
          userId: preuser._id.toString(),
          project: "edevlop",
        },
        "abcdefg",
        {
          expiresIn: "72h",
        }
      );
      res.setHeader("x-api-key",token1);
      res.status(200).json({ message: "User Login Succesfully Done", token: token1 });
    } else {
      res.status(400).json({ error: "Invalid Otp" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createUser, userOtpSend, userLogin };
