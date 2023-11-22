//import User from '../models/User'
const User = require('../models/User.ts').default
import db from '../db'

const usersData = [
  {
    nombre: 'Michi',
    username: 'MichiCat',
    password: '123',
    biografia: 'Biografía del Michi',
    avatar_url: 'http://localhost:3000/img/Titi.jpg',
    seguidores: 50,
    siguiendo: 90
  }
]

const userSeeder = async () => {
  try {
    // Espera a que la conexión a la base de datos se establezca
    await db.mongoose.connection
    console.log('Ejecutando seeder de usuarios...')

    for (const userData of usersData) {
      await User.create(userData)
    }

    console.log('Usuarios creados con éxito')
  } catch (error) {
    console.error('Error al crear usuarios:', error)
  } finally {
    // Cierra la conexión a la base de datos después de ejecutar el seeder
    await db.mongoose.connection.close()
  }
}

module.exports = userSeeder
