const mongoose = require('mongoose')
const Schema = mongoose.Schema

//mongoose.connect(process.env.DB_CONNECTION)

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

export default { mongoose, Schema }
