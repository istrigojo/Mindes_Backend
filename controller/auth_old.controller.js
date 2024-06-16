import { query } from "../database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const register = async (req, res) => {
  // console.log(req.body);
  const { username, email, password, confPassword } = req.body;

  // Validasi input kosong
  if (!username || !email || !password || !confPassword)
  {
    return res.status(400).json({ error: "Field must not be empty" });
  }

  // Validasi konfirmasi password
  if (password !== confPassword) {
    return res.status(400).json({ error: "Password not match" });
  }

  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    //  Insert ke database dengan roles default "umum"
    await query("INSERT INTO usertable (email, username, password) values (?,?,?)", [
      email,
      username,
      hash,
    ]);

    return res.status(200).json({ username });
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan" });
  }
};

// Controller Login
const login = async (req, res) => {
  const { username, password: inputPass } = req.body;
  // const password = //TODO get HASHED password from database
  // TODO Validasi username dan password

  // Validasi input kosong
  if (!username || !inputPass) {
    return res.status(400).json({ error: "Field must not be empty" });
  }

  try {
    //cek user ada
    // const [user] = await query("select id_user, username, password from usertable where username=?", [username]);
    // if (!user) {
    //   return res.status(400).json({ error: "User not found" })
    // }
    const [validation] = await query(
      "select id_user, username, password from usertable where username=?", [username]);
      if (!user) {
        return res.status(400).json({ error: "User not found" })
      }

    if (validation === undefined) {
      return res.status(400).json({ error: "User not found" });
    }
    const [check] = await query(
      "select id_user, username, password from usertable where id_user=?",
      [validation.id_user]
    );

    //cek password
    const isMatch = await bcrypt.compare(inputPass, check.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Password is wrong" });
    }

    const data = {
      id_user: check.id_user,
      username: check.username,
    };

    jwt.sign(data, process.env.SECRETKEY, (err, token) => {
      if (err) throw err;
      return res.status(200).json({ Authorization: `Bearer ${token}` });
    });
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};

export { register, login };
