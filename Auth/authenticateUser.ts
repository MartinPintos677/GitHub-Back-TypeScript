import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

declare module "express-serve-static-core" {
  interface Request {
    user?: any; // Define la propiedad 'user' en el tipo Request
  }
}

function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const token = req.get("Authorization"); // Asumiendo que el token se envía en el encabezado "Authorization"

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY) as any;
    req.user = decoded; // Agregar el usuario decodificado al objeto de solicitud
    next(); // Continuar con la siguiente función en la ruta
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export default authenticateUser;
