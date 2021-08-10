const newUserSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      maxLength: 20,
    },
    password: {
      type: "string",
    },
  },
  required: ["username", "password"],
};

const getTaskSchema = {
  type: "object",
  properties: {
    start_date: {
      type: "string",
    },
    end_date: {
      type: "string",
    },
    required: ["start_date", "end_date"],
  },
};

module.exports = {
  newUserSchema,
  getTaskSchema,
};
