<<<<<<< HEAD
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id =id ?  new mongodb.ObjectId(id) : null; //_id --> empty id object fix
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      //update the product with mongo db
      dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => console.log(err)); //find mongo method
  }

  static findByPk(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => console.log(err));
  }
=======
const Sequelize = require('sequelize');

const sequelize = require('../util/database');
>>>>>>> parent of 84c6916... added mongo database connection

  static deleteByPk(prodId) {
    const db = getDb();
    //mongodb deleteOne()
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then(result => {
        console.log('Deleted product');
      })
      .catch(err => {
        console.log(err);
      })
  }

}

module.exports = Product;