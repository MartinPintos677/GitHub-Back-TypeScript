/*import { Request, Response, NextFunction } from "express";
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

export default authenticateUser;*/

import jwt from 'jsonwebtoken'
import { isTokenBlacklisted } from './blacklist'
import { Request, Response, NextFunction } from 'express'

// Extender la interfaz de Request para incluir la propiedad 'user'
interface AuthenticatedRequest extends Request {
  user?: any // Puedes ajustar el tipo de 'user' según lo que esperas
}

function authenticateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.header('Authorization') // Asumiendo que el token se envía en el encabezado "Authorization"
  // console.log('Token recibido en el backend:', token)

  if (!token || isTokenBlacklisted(token)) {
    res.status(401).json({ error: 'Usuario no autorizado.' })
  } else {
    try {
      // Verificar el token y obtener la información del usuario
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '')
      req.user = decoded // Agregar el usuario decodificado al objeto de solicitud
      next() // Continuar con la siguiente función en la ruta
    } catch (error) {
      res.status(401).json({ error: 'Usuario no autorizado.' })
    }
  }
}

export default authenticateUser
