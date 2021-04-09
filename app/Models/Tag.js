'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tag extends Model {
    blog() {
        return this.belongsToMany('App/Models/Blog')
        // .pivotTable('blog_tag')
    }
}

module.exports = Tag
