module.exports = (sequelize, Sequelize) => {
  const task = sequelize.define('task', {
    task_id:{

      type:Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      notNull:true
    },
    task_name: {
      type: Sequelize.STRING(20),
      allowNull:false

    },
    is_complete: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue:0
    },
    completed_on:{
    type: Sequelize.DATE
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })
  task.associate=(models)=>{
    task.belongsTo(models.user,{foreignKey:'user_id',onDelete:'CASCADE',onUpdate:'CASCADE'})
  }

  return task
}
