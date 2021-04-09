'use strict'

const Tag = use('App/Models/Tag')

class TagController {
    async getAllTagsList({ request, response }) {
        const tags = await Tag.all()
        response.send(tags)
    }
}

module.exports = TagController
