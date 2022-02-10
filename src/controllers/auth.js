// import model
const { user } = require("../../models");

// import joi validation
const Joi = require("joi");

// import package here
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {
  // our validation schema here
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  // do validation and get error object from schema.validate
  const { error } = schema.validate(req.body);

  // if error exist send validation error message
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    // code here

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = await user.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    res.status(200).send({
      status: "success...",
      data: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  // our validation schema here
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  // do validation and get error object from schema.validate
  const { error } = schema.validate(req.body);

  // if error exist send validation error message
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    // code here

    if (!userExist) {
      return res.status(400).send({
        status: 'failed',
        message: 'Email or password not match'
      })
    }


    const isValid = await bcrypt.compare(req.body.password, userExist.password)

    if(!isValid) {
      return res.status(400).send({
        status: 'failed',
        message: "Email or password not match"
      })
    }

    res.status(200).send({
      status: "success...",
      data: {
        name: userExist.name,
        email: userExist.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
