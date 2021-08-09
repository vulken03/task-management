const convict = require('convict')
const path = require('path')

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'qa'],
    default: 'development'
  },
  host: {
    doc: 'host name',
    format: String,
    default: 'localhost'
  },
  port: {
    doc: 'port number',
    format: Number,
    default: 8080
  },
  database: {
    name: {
      doc: 'Databse name',
      format: String,
      default: 'todo'
    },
    username: {
      doc: 'Database username',
      format: String,
      default: 'admin'
    },
    password: {
      doc: 'Database password',
      format: String,
      default: 'Admin@123'
    },
    dialect: {
      doc: 'Sequelize dialect',
      format: String,
      default: 'mysql'
    }
  },
  jwt: {
    key: {
      doc: 'JWT key',
      format: String,
      default: 'encrypt@098'
    }
  } 
})

config.loadFile(path.join(__dirname, 'config-' + config.get('env') + '.json'))

config.validate()

module.exports = config