import { Schema, model, Document, Types } from 'mongoose'
import { IUser } from './User'

interface IUserList {
  username?: string
  avatar?: string
  url?: string
}

interface ISearchUser extends Document {
  search: string
  usersList: IUserList[]
  comment?: string
  user: Types.ObjectId | IUser
  createdAt: Date
  updatedAt: Date
}

const searchUserSchema = new Schema<ISearchUser>({
  search: {
    type: String,
    required: true,
    maxlength: 50,
    unique: true
  },
  usersList: [
    {
      username: {
        type: String
      },
      avatar: {
        type: String
      },
      url: {
        type: String
      }
    }
  ],
  comment: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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

searchUserSchema.set('toJSON', { virtuals: true })

const SearchUser = model<ISearchUser>('SearchUser', searchUserSchema)

export default SearchUser
