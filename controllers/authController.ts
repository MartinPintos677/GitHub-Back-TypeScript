import { Request, Response } from "express";
import User, { IUser } from "../models/User";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
import formidable, { Fields, Files } from "formidable";

// Controlador para registrar un nuevo usuario
export async function registerUser(req: Request, res: Response) {
  const form = formidable({
    multiples: false,
    uploadDir: __dirname + "/../public/img",
    keepExtensions: true,
  });

  form.parse(req, async (err: any, fields: formidable.Fields, files: formidable.Files) => {
    console.log(fields.username);
    const existingUser = await User.findOne({
      username: fields.username,
    });

    if (existingUser) {
      return res.status(409).send({ message: "Ya existe usuario con el Username." });
    } else {
      // const stringifyPass = fields.password; ???
      const newUser = await User.create({
        nombre: fields.nombre,
        biografia: fields.biografia,
        username: fields.username,
        password: fields.password,
      });

      if (files.avatar_url) {
        newUser.avatar_url = files.avatar_url[0].newFilename;
        newUser.save();
      }
      if (newUser) {
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1h",
        });
        const userToFront = { userId: newUser.id, token: token, username: newUser.username };

        return res.status(201).json(userToFront);
      } else {
        return res.status(502).send({ message: "Usuario no ha sido creado, intente de nuevo." });
      }
    }
  });
}

// Controlador para iniciar sesión
export async function loginUser(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    const user: IUser | null = await User.findOne({ username });

    // Modificar después para "Credenciales incorrectas."
    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Generar un token JWT
    const token: string = jwt.sign(
      { username: user.username, _id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}

// Controlador para cerrar sesión
export async function logout(req: Request, res: Response) {
  res.clearCookie("token");
  console.log("Sesión cerrada con éxito");
  res.status(200).json({ message: "Sesión cerrada con éxito" });
}

//module.exports = { registerUser, loginUser, logout };
/*export function registerUser(arg0: string, loginUser: any) {
  throw new Error("Function not implemented.");
}*/
