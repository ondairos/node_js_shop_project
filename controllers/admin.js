const Product = require('../models/product');

//get product info
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};
  //post product info
  exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price,description,imageUrl);
    
    product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created a product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    }) //sequelize 
  };

  //edit product 
  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findByPk(prodId)
      .then(product => {
        if (!product) {
          return res.redirect('/');
        }
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product
        });
      })
      .catch(err => console.log(err));
  };

  //post edit product
  exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
  
    const product = new Product(
      updatedTitle,
      updatedPrice,
      updatedDesc,
      updatedImageUrl,
      prodId
    );
    product
      .save()
      .then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      })
      .catch(err => console.log(err));
  };

  //display products 
  exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
  }; 

  //DELETE product using sequelize and promises
  exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteByPk(prodId)
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
  };