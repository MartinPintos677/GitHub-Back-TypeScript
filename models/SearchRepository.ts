import { Schema, model, Document, Types } from 'mongoose'
import { IUser } from './User'

interface IRepo {
  name?: string
  user?: string
  description?: string
  language?: string
  url?: string
  created_at?: Date
  pushed_at?: Date
}

export interface ISearchRepository extends Document {
  search: string
  reposlist: IRepo[]
  comment?: string
  user: Types.ObjectId | IUser
  createdAt: Date
  updatedAt: Date
}

const searchRepositorySchema = new Schema<ISearchRepository>({
  search: {
    type: String,
    required: true,
    maxlength: 50
  },
  reposlist: [
    {
      name: {
        type: String
      },
      user: {
        type: String
      },
      description: {
        type: String
      },
      language: {
        type: String
      },
      url: {
        type: String
      },
      created_at: {
        type: Date
      },
      pushed_at: {
        type: Date
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

searchRepositorySchema.set('toJSON', { virtuals: true })

/*const SearchRepository = model<ISearchRepository>(
  'SearchRepository',
  searchRepositorySchema
)*/

export default model<ISearchRepository>(
  'SearchRepository',
  searchRepositorySchema
)

//export default SearchRepository
