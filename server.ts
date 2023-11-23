import dotenv from 'dotenv'
dotenv.config()

import path from 'path'
import express from 'express'
import cors from 'cors'
import db from './db'
import routes from './routes'
const methodOverride = require('method-override')

const APP_PORT = process.env.APP_PORT || 3000
const app = express()

app.use(express.json())
app.use(cors())

// Configuramos el método override después de cors para evitar posibles conflictos
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

routes(app)

db.db.once('open', () => {
  app.listen(APP_PORT, () => {
    console.log(`\n[Express] Servidor corriendo en el puerto ${APP_PORT}.`)
    console.log(`[Express] Ingresar a http://localhost:${APP_PORT}.\n`)
  })
})

process.on('SIGINT', async function () {
  try {
    await db.db.close()
    console.log(
      'Mongoose default connection is disconnected due to application termination.\n'
    )
    process.exit(0)
  } catch (error) {
    console.error('Error al cerrar la conexión a la base de datos:', error)
    process.exit(1)
  }
})
