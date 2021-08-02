let Validator=require('jsonschema').Validator;
let v=new Validator();
const schemaValidator=(schema,schemaStructure)=>{

    let isValid=false
    let error=null
  
    const validationResult=v.validate(schema,schemaStructure)
  
    if(validationResult.valid){
      isValid=true
    }
  
    else{
  
      error=new Error(validationResult.Error)
    }
    return{
      isValid,error
    }
  }

  module.exports={
      schemaValidator
  }