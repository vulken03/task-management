const newUserSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      maxLength:20
    },
    email: {
      type: "string",
      format: "email"

    },
    phoneno: {
      type: "integer",
      pattern: "^[0-9()\-\.\s]+$" ,
      maxLength:20
    },
    password: {
      type: "string",
    },
  },
  required: ["username", "password"],
};

module.exports = {
  newUserSchema,
};
