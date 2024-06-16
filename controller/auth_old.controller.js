// OLD BY NEW BACKEND
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


// OLD BY ME
// import { query } from "../database/db.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();
// const register = async (req, res) => {
//   // console.log(req.body);
//   const { username, email, password, confPassword } = req.body;

//   // Validasi input kosong
//   if (!username || !email || !password || !confPassword)
//   {
//     return res.status(400).json({ error: "Field must not be empty" });
//   }

//   // Validasi konfirmasi password
//   if (password !== confPassword) {
//     return res.status(400).json({ error: "Password not match" });
//   }

//   try {
//     const salt = await bcrypt.genSalt(12);
//     const hash = await bcrypt.hash(password, salt);

//     //  Insert ke database dengan roles default "umum"
//     await query("INSERT INTO usertable (email, username, password) values (?,?,?)", [
//       email,
//       username,
//       hash,
//     ]);

//     return res.status(200).json({ username });
//   } catch (error) {
//     return res.status(500).json({ error: "Terjadi kesalahan" });
//   }
// };

// // Controller Login
// const login = async (req, res) => {
//   const { username, password: inputPass } = req.body;
//   // const password = //TODO get HASHED password from database
//   // TODO Validasi username dan password

//   // Validasi input kosong
//   if (!username || !inputPass) {
//     return res.status(400).json({ error: "Field must not be empty" });
//   }

//   try {
//     //cek user ada
//     // const [user] = await query("select id_user, username, password from usertable where username=?", [username]);
//     // if (!user) {
//     //   return res.status(400).json({ error: "User not found" })
//     // }
//     const [validation] = await query(
//       "select id_user, username, password from usertable where username=?", [username]);
//       if (!user) {
//         return res.status(400).json({ error: "User not found" })
//       }

//     if (validation === undefined) {
//       return res.status(400).json({ error: "User not found" });
//     }
//     const [check] = await query(
//       "select id_user, username, password from usertable where id_user=?",
//       [validation.id_user]
//     );

//     //cek password
//     const isMatch = await bcrypt.compare(inputPass, check.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Password is wrong" });
//     }

//     const data = {
//       id_user: check.id_user,
//       username: check.username,
//     };

//     jwt.sign(data, process.env.SECRETKEY, (err, token) => {
//       if (err) throw err;
//       return res.status(200).json({ Authorization: `Bearer ${token}` });
//     });
//   } catch (error) {
//     return res.status(500).json({ error: "Terjadi kesalahan pada server" });
//   }
// };

// export { register, login };
