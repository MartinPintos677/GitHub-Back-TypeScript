import { Router } from 'express'
import * as searchReposController from '../controllers/searchRepoController'
import authenticateUser from '../Auth/authenticateUser'

// Rutas protegidas
const router = Router()
router.use(authenticateUser)

// Rutas relacionadas a los repositorios buscados:
router.post('/', searchReposController.searchAndSaveResults)
router.get('/', searchReposController.getAllSearchRepositories)
router.get('/:id', searchReposController.getSearchRepositoryById)
router.patch('/:id', searchReposController.updateSearchRepositoryById)
router.delete('/:id', searchReposController.deleteSearchRepositoryById)

export default router
