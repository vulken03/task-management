module.exports = (sequelize, Sequelize) => {
  const task = sequelize.define('task', {
    taskId:{

      type:Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      notNull:true
    },
    task_name: {
      type: Sequelize.STRING,
      allowNull:false
    },
    complete_status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue:0
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    end_date: {
      type: Sequelize.DATE
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })
  task.associate=(models)=>{
    task.belongsTo(models.User_Registration,{foreignKey:'userId',onDelete:'CASCADE',onUpdate:'CASCADE'})
  }

  return task
}
