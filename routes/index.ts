import { Express } from "express";
import userRoutes from "./userRoutes";
import repositoryRoutes from "./repositoryRoutes";

export default (app: Express) => {
  app.use("/", userRoutes);
  app.use("/", repositoryRoutes);

  // app.use('/', publicRoutes);
};
