const newTaskSchema={
    type:'object',
    properties:{
        task_name:{
            type:'string'
        },
        start_date:{
            type:'string'
        },
        end_date:{
            type:'string'
        }
    },
    required:[
        'task_name','start_date','end_date'
    ]
}

const getTaskSchema={
    type:'object',
    properties:{
        start_date:{
            type:'string'
        },
        end_date:{
            type:'string' 
        }
    }
}

module.exports={
    newTaskSchema,
    getTaskSchema
}