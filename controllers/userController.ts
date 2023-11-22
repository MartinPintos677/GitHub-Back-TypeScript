import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import formidable, { Fields, Files } from "formidable";

// Controlador para mostrar todos los usuarios
export async function index(req: Request, res: Response) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la lista de usuarios" });
  }
}

// Controlador para mostrar un usuario específico por su ID
export async function show(req: Request, res: Response) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
}

// Buscar usuario por username
export async function findUserByUsername(req: Request, res: Response) {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar usuario por nombre de usuario" });
  }
}

// Controlador para actualizar el perfil de un usuario
export async function update(req: Request, res: Response) {
  const form = formidable({
    multiples: false,
    uploadDir: __dirname + "/../public/img",
    keepExtensions: true,
  });

  form.parse(req, async (err: any, fields: formidable.Fields, files: formidable.Files) => {
    const userId = req.user._id; // Obtén el ID del usuario actualmente autenticado (asumiendo que está disponible en req.user)

    try {
      // Verifica si el usuario existe
      const existingUser = await User.findById(userId);

      if (!existingUser) {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }

      // Actualiza los campos del usuario según los datos recibidos en "fields"
      if (fields.nombre) {
        existingUser.nombre = fields.nombre[0];
      }
      if (fields.biografia) {
        existingUser.biografia = fields.biografia[0];
      }
      if (fields.username) {
        existingUser.username = fields.username[0];
      }
      if (fields.password) {
        existingUser.password = fields.password[0];
      }

      // Guarda el usuario actualizado
      await existingUser.save();

      // Si se ha subido un nuevo avatar, actualiza el campo correspondiente
      if (files.avatar_url) {
        existingUser.avatar_url = files.avatar_url[0].newFilename;
        await existingUser.save();
      }

      // Devuelve una respuesta exitosa
      return res.status(200).send({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      return res.status(500).send({ message: "Error al actualizar el usuario" });
    }
  });
}

// Controlador para eliminar un usuario por su ID
export async function destroy(req: Request, res: Response) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
}

// Controlador para seguir a un usuario
export async function followUser(req: Request, res: Response) {
  const { userId } = req.params;
  const { currentUser } = req.user; // Suponiendo que el usuario actual esté en req.user

  try {
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!userToFollow.seguidores.includes(currentUser._id)) {
      userToFollow.seguidores.push(currentUser._id);
      await userToFollow.save();
    }

    if (!currentUser.siguiendo.includes(userToFollow._id)) {
      currentUser.siguiendo.push(userToFollow._id);
      await currentUser.save();
    }

    res.status(200).json({ message: "Ahora sigues a este usuario" });
  } catch (error) {
    res.status(500).json({ error: "Error al seguir al usuario" });
  }
}

// Controlador para dejar de seguir a un usuario
export async function unfollowUser(req: Request, res: Response) {
  const { userId } = req.params;
  const { currentUser } = req.user;

  try {
    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Elimina el usuario de la lista de seguidores
    userToUnfollow.seguidores = userToUnfollow.seguidores.filter(
      (followerId) => followerId.toString() !== currentUser._id.toString(),
    );
    await userToUnfollow.save();

    // Elimina el usuario de la lista de seguidos
    currentUser.siguiendo = currentUser.siguiendo.filter(
      (followingId: { toString: () => any }) =>
        followingId.toString() !== userToUnfollow._id.toString(),
    );
    await currentUser.save();

    res.status(200).json({ message: "Has dejado de seguir a este usuario" });
  } catch (error) {
    res.status(500).json({ error: "Error al dejar de seguir al usuario" });
  }
}

export async function getFollowingUsers(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const followingUsers = await User.find({ _id: { $in: user.siguiendo } });

    res.status(200).json(followingUsers);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios seguidos" });
  }
}

export async function getFollowers(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const followers = await User.find({ _id: { $in: user.seguidores } });

    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los seguidores" });
  }
}

/*module.exports = {
  index,
  show,
  update,
  destroy,
  unfollowUser,
  followUser,
  getFollowers,
  getFollowingUsers,
  findUserByUsername,
};*/
