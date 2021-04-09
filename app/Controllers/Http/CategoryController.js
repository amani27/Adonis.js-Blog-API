'use strict'


const Category = use('App/Models/Category')

class CategoryController {
    async getAllCategoriesList({ request, response }) {
        const categories = await Category.all()
        response.send(categories)
    }
}

module.exports = CategoryController
