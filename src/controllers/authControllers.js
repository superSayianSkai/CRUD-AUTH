const { signupSchema, signinSchema } = require("../middlewares/validator");
const jwt = require("jsonwebtoken");
//by convention a model should start with a capital letter
const User = require("../models/usersModel");
const { doHash, comparePassword,HmacProcess } = require("../utils/Hashing");
const transport = require("../middlewares/sendMail");

exports.signUp = async (req, res) => {
  const { email, password } = req.body;
  try {
    //validating the email and password of the user's request
    const { error } = signupSchema.validate({ email, password });

    if (error) {
      return res.status(401).json({
        success: "false",
        message: error.details.map((detail) => detail.message),
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "user already exist" });
    }

    const hashedPassword = await doHash(password, 12);
    //created a a structure based on the blueprint which is the schema
    const newUser = new User({ email, password: hashedPassword });
    const result = await newUser.save();
    result.password = undefined;
    return res.status(201).json({
      success: true,
      message: "Your account has been created successfully",
      result,
    });
  } catch (error) {
    //i have to return an error message
    console.log(error);
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error } = signinSchema.validate({ email, password });
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details.map((detail) => detail.message),
      });
    }

    const existingUser = await User.findOne({ email }).select("+password");
    if (existingUser) {
      const result = await comparePassword(password, existingUser.password);
      if (result) {
        // return res
        //   .status(200)
        //   .json({ success: true, message: "user successfully signed in" });

        //explaining the JWT process
        // a JWT contains the header, the payload, and the signature
        // to generate a JWT you would have to pass
        // -a payload,-a secret key ,v -an expiration time it is optional
        const token = jwt.sign(
          {
            userId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified,
          },
          process.env.TOKEN_SECRET,
          { expiresIn: "8h" }
        );
        return res
          .cookie("Authorization", `Bearer ${token}`, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
          })
          .json({
            success: true,
            token: token,
            message: "logged in successfully",
          });
        //the cookie should contain
        // - name of the cookie , the value, the token, expiring time ,
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Password is invalid try again" });
      }
    } else {
      return res
        .status(401)
        .json({ success: false, message: "user does not exist" });
    }
  } catch (error) {
    console.log(error);
  }

  //user provides a user email
  //user provides a password
  // the email has to be checked if it exist in the database
  // the password also have to be checked if its matches the email provided
  // note that the password is stored in a hashed
  // i need to hash the incoming password and compare it to the stored has password
  // none of this match an error message should be displayed
  // if it matches a success message should be displayed
  // also the user data should be sent to the client
};

exports.logOut = async (req, res) => {
  res
    .clearCookie(`Authorization`)
    .status(200)
    .json({ success: true, message: "successfully logged out" });
  //how do i suggest to logOut
  //you want the user to not have access to the token any longer
  // here i am not creating a new token rather i would undefine the existence of the token.\
};
// "password":"Tester121$"

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist" });
    }
    if (existingUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: "You are already verified" });
    }
    const codeValue = Math.floor(Math.random() * 1000000).toString();
    let info = await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Verification code",
      html: `<h1>` + codeValue + `</h1>`,
    });

    if (info.accepted[0] === existingUser.email) {
      const hashedCodeValue = HmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      existingUser.verificationCode = hashedCodeValue;
      existingUser.verificationCodeValidation = Date.now();
      await existingUser.save();
      return res.status(200).json({ success: true, message: "code sent!" });
    }
    return res
      .status(200)
      .json({ success: true, message: "code sent failed!" });
  } catch (error) {
    console.log(error);
  }
};
