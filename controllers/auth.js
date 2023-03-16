import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import users from "../models/auth.js";

export const signup = async (req, res) => {
  console.log(signup);
  try {
    const { name, email, password } = req.body;
    const existinguser = await users.findOne({ email });
    console.log(existinguser);

    if (existinguser) {
      return res.status(404).json({ message: "User already Exist." });
    }  console.log(existinguser);

    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(hashedPassword);
    const newUser = await users.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log(newUser);

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log(token);

    res.status(200).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json("Something went worng...");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existinguser = await users.findOne({ email });
    console.log(login);

    if (!existinguser) {
      return res.status(404).json({ message: "User don't Exist." });
    }console.log(existinguser);

    const isPasswordCrt = await bcrypt.compare(password, existinguser.password);
    console.log(isPasswordCrt);
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Invalid credentials" });
    }console.log(isPasswordCrt);

    const token = jwt.sign( 
      { email: existinguser.email, id: existinguser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      console.log(token)

    res.status(200).json({ result: existinguser, token });
  } catch (error) {
    res.status(500).json("Something went worng...");
  }
};