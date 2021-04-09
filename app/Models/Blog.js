'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Blog extends Model {
    user() {
        return this.belongsTo('App/Models/User')
    }

    blog_tag() {
        return this.hasMany('App/Models/BlogTag')
    }

    tags() {
        return this.hasMany('App/Models/Tag')
    }

    blog_images() {
        return this.hasMany('App/Models/BlogImage')
    }

    ratings() {
        return this.hasMany('App/Models/Rating')
    }

    category() {
        // return this.belongsTo('App/Models/Category', "category_id", "id")
        return this.belongsTo('App/Models/Category')
    }
}

module.exports = Blog
