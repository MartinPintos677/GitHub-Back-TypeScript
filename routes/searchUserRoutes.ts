import express from 'express'
import * as searchUserController from '../controllers/searchUserController'
import authenticateUser from '../Auth/authenticateUser'

const router = express.Router()

// Rutas protegidas
router.use(authenticateUser)

// Rutas relacionadas a los usuarios buscados:
router.post('/', searchUserController.searchAndSaveResults)
router.get('/', searchUserController.getAllSearchUsers)
router.get('/:id', searchUserController.getSearchUserById)
router.patch('/:id', searchUserController.updateSearchUserById)
router.delete('/:id', searchUserController.deleteSearchUserById)

export default router
