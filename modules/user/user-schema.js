const newUserSchema={
    type:'object',
    properties:{
        username:{
            type:'string'
        },
        email:{
            type:'string'
        },
        phoneno:{

            type:'integer'
        },
        password:{
            type:'string'
        }
    },
    required:[
        'username','password'
    ]
}



module.exports={
    newUserSchema
}