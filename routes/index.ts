import { Express } from 'express'
import userRoutes from './userRoutes'
//import searchUserRoutes from './searchUserRoutes'
import searchReposRoutes from './searchReposRoutes'

export default (app: Express) => {
  app.use('/user', userRoutes)
  // app.use('/searchuser', searchUserRoutes)
  app.use('/searchrepos', searchReposRoutes)
}
