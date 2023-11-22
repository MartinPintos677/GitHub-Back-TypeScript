import mongoose, { Document, Schema, Model } from 'mongoose'
const bcrypt = require('bcryptjs')

export interface IUser extends Document {
  nombre: string
  username: string
  password: string
  biografia: string
  avatar_url: string
  createdAt: Date
  updatedAt: Date
  siguiendo: Number
  seguidores: Number

  // Definir la función comparePassword en la interfaz
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    maxlength: 18
  },
  password: {
    type: String,
    required: true,
    maxlength: 18
  },
  biografia: {
    type: String
  },
  avatar_url: {
    type: String
  },
  seguidores: {
    type: Number
  },
  siguiendo: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

userSchema.set('toJSON', { virtuals: true })

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function (this: IUser, next) {
  // Solo hashear la contraseña si ha sido modificada o es nueva
  if (!this.isModified('password')) {
    return next()
  }

  try {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(this.password, 10)
    // Reemplazar la contraseña en texto plano por la contraseña hasheada
    this.password = hashedPassword
    return next()
  } catch (error: any) {
    return next(error)
  }
})

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw error
  }
}

const User: Model<IUser> = mongoose.model('User', userSchema)

//module.exports = User
export default User
