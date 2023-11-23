import { Router } from 'express'
import * as authController from '../controllers/authController'
import authenticateUser from '../Auth/authenticateUser'

// Rutas relacionadas al usuario:
const router = Router()

router.post('/login', authController.loginUser)

// Middleware de autenticación para las rutas protegidas
router.use(authenticateUser)
router.get('/logout', authController.logout)
router.get('/:username', authController.getUserProfile)

export default router
