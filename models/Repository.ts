import { Schema, Document, model } from "mongoose";

export interface IRepository extends Document {
  nombre: string;
  descripcion: string;
  tecnologia: string;
  tecnologias: string[];
  createdAt: Date;
  updatedAt: Date;
  publico: boolean;
  autor: Schema.Types.ObjectId;
}

const repositorySchema = new Schema<IRepository>({
  nombre: {
    type: String,
    required: true,
    maxlength: 50,
  },
  descripcion: {
    type: String,
  },
  tecnologia: {
    type: String,
    maxlength: 50,
  },
  tecnologias: [
    {
      type: String,
      maxlength: 50,
    },
  ],
  publico: {
    type: Boolean,
    default: true,
  },
  autor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

repositorySchema.set("toJSON", { virtuals: true });

const Repository = model<IRepository>("Repository", repositorySchema);

export default Repository;
