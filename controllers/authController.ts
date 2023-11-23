import { Request, Response } from 'express'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Esto me sirve para que funcione el logout en Postman
import { addToBlacklist } from '../Auth/blacklist'

// Controlador para iniciar sesión
async function loginUser(req: Request, res: Response) {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' })
    }

    const token = jwt.sign(
      { username: user.username, _id: user._id },
      process.env.JWT_SECRET_KEY || ''
      //{ expiresIn: '2h' }
    )

    //console.log('Token generado en el controlador:', token) // Agrega esta línea

    res.status(200).json({ token })
  } catch (error) {
    //res.status(500).json({ error: 'Error al iniciar sesión' })
    console.error('Error al iniciar sesión:', error)
    res.status(500).json({ error: 'Error al iniciar sesión', details: error })
  }
}

// Controlador para cerrar sesión
function logout(req: Request, res: Response) {
  try {
    const token = req.header('Authorization') // Obtén el token del encabezado

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado.' })
    }

    // Agrega el token a la lista negra antes de borrar la cookie o realizar cualquier acción adicional
    addToBlacklist(token)

    // Luego, elimina la cookie
    res.clearCookie('token')

    return res.json({ message: 'Sesión cerrada con éxito' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al cerrar sesión.' })
  }
}

// En el controlador del backend para obtener los datos del usuario logueado
async function getUserProfile(req: Request, res: Response) {
  try {
    // Aquí debes buscar el perfil del usuario en la base de datos usando el username proporcionado en req.params
    const userProfile = await User.findOne({ username: req.params.username })

    if (!userProfile) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Si el usuario se encuentra, devuélvelo como respuesta
    return res.status(200).json(userProfile)
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error)
    return res
      .status(500)
      .json({ error: 'Error al obtener el perfil del usuario' })
  }
}

export { loginUser, logout, getUserProfile }
