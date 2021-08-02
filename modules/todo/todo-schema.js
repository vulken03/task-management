const newUserSchema={
    type:'object',
    properties:{
        username:{
            type:'string'
        },
        password:{
            type:'string'
        }
    },
    required:[
        'username','password'
    ]
}

const newTaskSchema={
    type:'object',
    properties:{
        task_name:{
            type:'string'
        },
        start_date:{
            type:'string'
        }
    },
    required:[
        'task_name','start_date'
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
    newUserSchema,
    newTaskSchema,
    getTaskSchema
}