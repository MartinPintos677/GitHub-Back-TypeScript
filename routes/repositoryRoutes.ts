import express from 'express'
import { Router } from 'express'
import * as repositoryController from '../controllers/searchRepoController'
import * as authController from '../controllers/authController'
import authenticateUser from '../Auth/authenticateUser'

const router: Router = express.Router()

// Rutas relacionadas a los artículos:
router.get('/repository', repositoryController.index)
router.get('/repository/:id', repositoryController.show)
//router.get("/repository/list/:userId", repositoryController.getArticlesByUser);

// Rutas protegidas
router.use(authenticateUser)
router.post('/repository', repositoryController.store)
router.patch('/repository/:id', repositoryController.update)
router.delete('/repository/:id', repositoryController.destroy)

export default router
