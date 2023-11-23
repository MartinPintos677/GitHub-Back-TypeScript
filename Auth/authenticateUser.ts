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
  const token = req.header('Authorization')

  if (!token || isTokenBlacklisted(token)) {
    res.status(401).json({ error: 'Usuario no autorizado.' })
  } else {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '')
      req.user = decoded
      next()
    } catch (error) {
      //res.status(401).json({ error: 'Usuario no autorizado.' })
      console.error('Error al iniciar sesión:', error)
      res
        .status(500)
        .json({ error: 'Error al iniciar sesión', details: error.message })
    }
  }
}

export default authenticateUser
