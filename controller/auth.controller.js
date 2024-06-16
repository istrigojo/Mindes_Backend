import { query } from "../database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register Endpoint
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    await query(" INSERT INTO usertable(username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword]);
    return res.status(200).json({ msg: "User registered successfully" });
  } catch (error) {
    console.log("Terjadi kesalahan", error);
    return res.status(500).json({ msg: "Server error occurred" });
  }
};

// Login Endpoint
export const login = async (req, res) => {
  // const { email, password } = req.body;
  console.log(req.body);
  try {
    const [result] = await query("SELECT * FROM usertable WHERE email = ?", [email]);
    if (result.length === 0) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    // console.log(result);
    const user = result;

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ msg: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id_user, username: user.username }, "your_jwt_secret_key", { expiresIn: "1h" });
    const bearerToken = `Bearer ${token}`;
    return res.status(200).json({ msg: "Login successful", token: bearerToken });
  } catch (error) {
    console.log("Terjadi kesalahan", error);
    return res.status(500).json({ msg: "Server error occurred" });
  }
};
