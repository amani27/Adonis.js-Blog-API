'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BlogTag extends Model {
    tag() {
        return this.belongsTo('App/Models/Tag')
    }
}

module.exports = BlogTag
