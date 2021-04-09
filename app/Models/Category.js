'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
    blogs() {
        return this.hasMany('App/Models/Blog')
    }
}

module.exports = Category
