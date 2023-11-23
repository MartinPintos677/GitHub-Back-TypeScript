import { Request, Response } from 'express'
import SearchRepository, { ISearchRepository } from '../models/SearchRepository'
import { IUser } from '../models/User'
import axios from 'axios'

interface AuthenticatedRequest extends Request {
  user?: IUser
  body: {
    searchTerm: string // Asegúrate de que el tipo de searchTerm sea correcto
  }
}

// Controlador para realizar una búsqueda en la API de GitHub y guardar los resultados
const searchAndSaveResults = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { searchTerm } = req.body
  const userId = (req.user as IUser)?._id

  // Convertir el término de búsqueda a minúsculas
  const searchTermLowercase = searchTerm.toLowerCase()

  try {
    const existingSearch = await SearchRepository.findOne({
      search: searchTermLowercase
    })

    if (existingSearch) {
      res.status(200).json(existingSearch.toObject())
    } else {
      const {
        data: { items: githubRepos }
      } = await axios.get(
        `https://api.github.com/search/repositories?q=${searchTerm}&per_page=100`
      )

      const reposList = githubRepos.map((repo: any) => ({
        name: repo.name,
        user: repo.owner.login,
        description: repo.description,
        language: repo.language,
        url: repo.url,
        created_at: repo.created_at,
        pushed_at: repo.pushed_at
      }))

      // Crear un nuevo registro de búsqueda en la base de datos y asociarlo al usuario autenticado
      const newSearch = new SearchRepository({
        search: searchTermLowercase,
        reposlist: reposList,
        comment: '',
        user: userId
      })

      const savedSearch = await newSearch.save()

      res.status(201).json(savedSearch.toObject())
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al obtener las búsquedas de repositorios' })
  }
}

// Controlador para obtener todas las búsquedas de repositorios
const getAllSearchRepositories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const searches = await SearchRepository.find()
    res.status(200).json(searches)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al obtener las búsquedas de repositorios' })
  }
}

// Controlador para obtener una búsqueda de repositorios por su ID
const getSearchRepositoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params
  try {
    const searchRepository = await SearchRepository.findById(id).populate(
      'user',
      'username'
    )
    if (!searchRepository) {
      res.status(404).json({ error: 'Búsqueda de repositorios no encontrada' })
    } else {
      res.status(200).json(searchRepository)
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al obtener la búsqueda de repositorios' })
  }
}

// Controlador para actualizar una búsqueda de repositorios por su ID
const updateSearchRepositoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params
  const { comment } = req.body
  try {
    const updatedSearchRepository = await SearchRepository.findByIdAndUpdate(
      id,
      { comment, updatedAt: new Date() },
      { new: true }
    )
    if (!updatedSearchRepository) {
      res.status(404).json({ error: 'Búsqueda de repositorios no encontrada' })
    } else {
      res.status(200).json({ message: 'Modificación realizada con éxito' })
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al actualizar la búsqueda de repositorios' })
  }
}

// Controlador para eliminar una búsqueda de repositorios por su ID
const deleteSearchRepositoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params
  try {
    const deletedSearchRepository = await SearchRepository.findByIdAndRemove(id)
    if (!deletedSearchRepository) {
      res.status(404).json({ error: 'Búsqueda de repositorios no encontrada' })
    } else {
      res
        .status(200)
        .json({ message: 'Búsqueda de repositorio eliminada con éxito' })
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al eliminar la búsqueda de repositorios' })
  }
}

export {
  searchAndSaveResults,
  getAllSearchRepositories,
  getSearchRepositoryById,
  updateSearchRepositoryById,
  deleteSearchRepositoryById
}
