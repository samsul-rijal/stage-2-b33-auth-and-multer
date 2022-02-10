const { product, user, category, productCategory } = require("../../models");

exports.getProduct = async (req, res) => {
  try {
    let data = await product.findAll({
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: productCategory,
            as: "bridge",
            attributes: [],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    data = JSON.parse(JSON.stringify(data))

    data = data.map((item) => {
      return {
        ...item,
        image: process.env.FILE_PATH + item.image
      }
    })


    res.send({
      status: "success...",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { data } = req.body;
    
    // code here
    let newProduct = await product.create({
      ...data,
      image: req.file.filename,
      idUser: req.user.id
    })


    newProduct = JSON.parse(JSON.stringify(newProduct))

    newProduct = {
      ...newProduct,
      image: process.env.FILE_PATH + newProduct.image
    }
    
    // code here
    res.send({
      status: 'success',
      data: {
        newProduct
      }

    })


  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
