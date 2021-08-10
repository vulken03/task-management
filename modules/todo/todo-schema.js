const newTaskSchema={
    type:'object',
    properties:{
        task_name:{
            type:'string',
            maxLength:20
        },
        start_date:{
            type:'string',
            format:'date-time'
        },
        end_date:{
            type:'string',
            format:'date-time'
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
    },
    required:[
        'start_date','end_date'
    ]
}

module.exports={
    newTaskSchema,
    getTaskSchema
}