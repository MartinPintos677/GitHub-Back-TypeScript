import mongoose, { Connection } from 'mongoose'

mongoose.connect(process.env.DB_CONNECTION)

const db: { mongoose: typeof mongoose; db: Connection } = {
  mongoose,
  db: mongoose.connection
}

db.db.on(
  'error',
  console.error.bind(console, 'Error de conexión a la base de datos:')
)
db.db.once('open', () => {
  console.log('Conexión a la base de datos exitosa.')
})

export default db
