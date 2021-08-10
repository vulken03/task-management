const newUserSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      maxLength: 20,
    },
    email: {
      type: "string",
      format: "email",
    },
    phoneno: {
      type: "string",
      pattern: "^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$",
      maxLength: 20,
    },
    password: {
      type: "string",
    },
  },
  required: ["username", "password", "email", "phoneno"],
};

const newLoginSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      maxLength: 20,
    },
    password: {
      type: "string",
    },
    required: ["username", "password"],
  },
};
module.exports = {
  newUserSchema,
  newLoginSchema,
};
