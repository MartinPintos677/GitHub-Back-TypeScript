import { Request, Response } from 'express'
import SearchUser from '../models/SearchUser'
import axios from 'axios'

interface AuthenticatedRequest extends Request {
  user: {
    _id: string
  }
  body: {
    searchTerm: string
  }
}

// Controlador para realizar una búsqueda en la API de GitHub y guardar los resultados
const searchAndSaveResults = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { searchTerm } = req.body
  const userId = req.user._id

  // Convertir el término de búsqueda a minúsculas
  const searchTermLowercase = searchTerm.toLowerCase()

  try {
    // Verificar si ya existe una búsqueda en la base de datos con el mismo término
    const existingSearch = await SearchUser.findOne({
      search: searchTermLowercase
    })

    if (existingSearch) {
      // Si ya existe una búsqueda previa, responder con los resultados almacenados
      res.status(200).json(existingSearch)
    } else {
      // Realizar la búsqueda en la API de GitHub y obtener los resultados
      const githubResponse = await axios.get(
        `https://api.github.com/search/users?q=${searchTerm}&per_page=100`
      )
      const usersList = githubResponse.data.items.map((user: any) => ({
        username: user.login,
        avatar: user.avatar_url,
        url: user.html_url
      }))

      // Crear un nuevo registro de búsqueda en la base de datos y asociarlo al usuario autenticado
      const newSearch = new SearchUser({
        search: searchTermLowercase,
        usersList: usersList,
        comment: '',
        user: userId
      })

      const savedSearch = await newSearch.save()

      res.status(201).json(savedSearch)
    }
  } catch (error) {
    res.status(500).json({
      error: 'Error al realizar la búsqueda y almacenar los resultados'
    })
  }
}

// Controlador para obtener todas las búsquedas de usuarios
const getAllSearchUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const searches = await SearchUser.find()
    res.status(200).json(searches)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al obtener las búsquedas de usuarios' })
  }
}

// Controlador para obtener una búsqueda de usuarios por su ID
const getSearchUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params
  try {
    const searchUser = await SearchUser.findById(id).populate(
      'user',
      'username'
    )

    if (!searchUser) {
      res.status(404).json({ error: 'Búsqueda de usuarios no encontrada' })
    } else {
      res.status(200).json(searchUser)
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la búsqueda de usuarios' })
  }
}

// Controlador para actualizar una búsqueda de usuarios por su ID
const updateSearchUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params
  const { comment } = req.body

  try {
    const updatedSearchUser = await SearchUser.findByIdAndUpdate(
      id,
      { comment, updatedAt: new Date() },
      { new: true }
    )

    if (!updatedSearchUser) {
      res.status(404).json({ error: 'Búsqueda de usuarios no encontrada' })
    } else {
      res.status(200).json({ message: 'Modificación realizada con éxito' })
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al actualizar la búsqueda de usuarios' })
  }
}

// Controlador para eliminar una búsqueda de usuarios por su ID
const deleteSearchUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params
  try {
    const deletedSearchUser = await SearchUser.findByIdAndRemove(id)

    if (!deletedSearchUser) {
      res.status(404).json({ error: 'Búsqueda de usuarios no encontrada' })
    } else {
      res
        .status(200)
        .json({ message: 'Búsqueda de usuario eliminada con éxito' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la búsqueda de usuarios' })
  }
}

export {
  searchAndSaveResults,
  getAllSearchUsers,
  getSearchUserById,
  updateSearchUserById,
  deleteSearchUserById
}
