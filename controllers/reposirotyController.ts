import { Request, Response } from "express";
const Repository = require("../models/Repository"); // Asegúrate de importar tu modelo Repository

// Listar todos los repositorios
export async function index(req: Request, res: Response) {
  try {
    const repositories = await Repository.find();
    return res.status(200).json(repositories);
  } catch (error) {
    return res.status(500).json({ error: "Error al listar los repositorios" });
  }
}

// Obtener un repositorio por ID
export async function show(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ message: "Repositorio no encontrado" });
    }
    return res.status(200).json(repository);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el repositorio" });
  }
}

// Buscar repositorios por nombre
export async function findRepositoryByName(req: Request, res: Response) {
  const { repositoryName } = req.params;

  try {
    const repository = await Repository.findOne({ nombre: repositoryName });

    if (!repository) {
      return res.status(404).json({ error: "Repositorio no encontrado" });
    }

    res.status(200).json(repository);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar repositorio por nombre" });
  }
}

// Crear un nuevo repositorio
export async function store(req: Request, res: Response) {
  const { nombre, descripcion, tecnologia, tecnologias, publico } = req.body;
  const userId = req.user._id; // Obtén el ID del usuario actualmente autenticado

  const newRepository = new Repository({
    nombre,
    descripcion,
    tecnologia,
    tecnologias,
    publico,
    autor: userId,
  });

  try {
    await newRepository.save();
    return res.status(201).json(newRepository);
  } catch (error) {
    return res.status(500).json({ error: "Error al crear el repositorio" });
  }
}

// Actualizar un repositorio por ID
export async function update(req: Request, res: Response) {
  const { id } = req.params;
  const { nombre, descripcion, tecnologia, tecnologias, publico } = req.body;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ message: "Repositorio no encontrado" });
    }

    // Actualiza los campos del repositorio según los datos recibidos
    if (nombre) {
      repository.nombre = nombre;
    }
    if (descripcion) {
      repository.descripcion = descripcion;
    }
    if (tecnologia) {
      repository.tecnologia = tecnologia;
    }
    if (tecnologias) {
      repository.tecnologias = tecnologias;
    }
    if (publico !== undefined) {
      repository.publico = publico;
    }

    await repository.save();
    return res.status(200).json(repository);
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar el repositorio" });
  }
}

// Eliminar un repositorio por ID
export async function destroy(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ message: "Repositorio no encontrado" });
    }

    await repository.remove();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar el repositorio" });
  }
}

/*module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  findRepositoryByName,
};*/
