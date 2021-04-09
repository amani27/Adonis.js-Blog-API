'use strict'

const { validate } = use('Validator')

const Blog = use('App/Models/Blog')
const Tag = use('App/Models/Tag')
const Rating = use('App/Models/Rating')
const BlogImage = use('App/Models/BlogImage')

const Database = use('Database')

class BlogController {

    //////////////////////////////// get all blogs list by different query params
    async getAllBlogsList({ request, response }) {

        let userId = request.input('userId')
        let categoryId = request.input('categoryId')
        let blogId = request.input('blogId')
        let lastId = request.input('lastId')
        let tagId = request.input('tagId')
        let str = request.input('str')
        let sortBy = request.input('sortBy')

        let blogs = Blog.query()

        if (userId) {
            blogs.where('user_id', userId)
        }
        if (categoryId) {
            blogs.where('category_id', categoryId)
        }
        if (blogId) {
            blogs.where('id', blogId)
        }
        if (lastId) {
            blogs.where('id', '>', lastId)
        }
        if (tagId) {
            blogs
                .whereHas('blog_tag.tag',

                    (builder) => {
                        builder.where('tag_id', tagId)
                    }
                )
        }
        if (str) {
            blogs.where((builder) => {
                builder.where('title', 'LIKE', '%' + str + '%')
            })
        }
        if (sortBy == 'asc') {
            blogs.orderBy('average_rating', 'asc')
        }
        if (sortBy == 'desc') {
            blogs.orderBy('average_rating', 'desc')
        }


        let res = await blogs.with('user').with('blog_images').with('blog_tag.tag').with('category').with('ratings').limit(5).fetch()
        // let res = await blogs.with('user').with('tags').with('category').with('ratings').limit(5).fetch()


        response.send(res)
    }

    /////////////////////////////// create new blog
    async createBlog({ request, response }) {
        try {
            const rules = {
                title: 'required',
                content: 'required',
                user_id: 'required'
            }

            const validation = await validate(request.all(), rules)

            if (validation.fails()) {

                return response.status(401).json(
                    {
                        'message': validation.messages()
                    }
                );
            }



            var blog = {
                title: request.body.title,
                content: request.body.content,
                user_id: request.body.user_id,
                category_id: request.body.category_id,
                average_rating: 0,
                rating_count: 0,
            };


            var newBlog = await Blog.create(blog);

            if (request.body.images) {

                for (var i = 0; i < request.body.images.length; i++) {

                    var image = {
                        'blog_id': newBlog.id,
                        'blog_image_path': request.body.images[i],
                    };
                    var newBlogImage = await BlogImage.create(image);
                }

            }

            return newBlog;

        }
        catch (e) {
            return response.status(402).json(
                {
                    'message': e.message

                }
            );
        }
    }



    /////////////////////////////// update new blog
    async updateBlog({ request, response }) {
        try {
            const rules = {
                title: 'required',
                content: 'required',
            }

            const validation = await validate(request.all(), rules)

            if (validation.fails()) {

                return response.status(401).json(
                    {
                        'message': validation.messages()
                    }
                );
            }

            var requestParam = request.body;

            var newBlog = await Blog.query()
                .where('id', requestParam.id)
                // .where('user_id', requestParam.user_id) // remember to check if user is authenticated for thisa action
                .update({
                    title: requestParam.title,
                    content: requestParam.content,
                    // category_id: requestParam.category_id,
                });

            var updatedBlog = await Blog.query()
                .where('id', requestParam.id).first();

            return response.status(200).json(
                {
                    'success': true,
                    'blog': updatedBlog
                }
            );

        }
        catch (e) {
            return response.status(402).json(
                {
                    'message': e.message
                }
            );
        }
    }


    /////////////////////////////// delete new blog
    async deleteBlog({ request, response }) {
        try {

            var newBlog = await Blog.query()
                .where('id', request.body.id)
                .delete();

            return response.status(200).json(
                {
                    'success': true,
                }
            );

        }
        catch (e) {
            return response.status(401).json(
                {
                    'message': e.message
                }
            );
        }
    }

    ////////////////////////////////// rate blog
    async rateBlog({ request, response }) {
        try {
            const rules = {
                blog_id: 'required',
                user_id: 'required',
                rating: 'required',
            }

            const validation = await validate(request.all(), rules)

            if (validation.fails()) {

                return response.status(401).json(
                    {
                        'message': validation.messages()
                    }
                );
            }

            var requestParam = request.body;

            var newRatingEntry = await Rating.create({
                blog_id: requestParam.blog_id,
                user_id: requestParam.user_id,
                rating: requestParam.rating,
            });

            var ratingSum = await Rating.query().where('blog_id', requestParam.blog_id).getSum('rating');
            var ratingsCount = await Rating.query().where('blog_id', requestParam.blog_id).getCount();

            var newAverage = ratingSum / ratingsCount;

            var newBlog = await Blog.query()
                .where('id', requestParam.blog_id)
                .update({
                    average_rating: newAverage,
                });

            var updatedBlog = await Blog.query()
                .where('id', requestParam.blog_id).first();

            return response.status(200).json(
                {
                    'success': true,
                    'blog': updatedBlog
                }
            );

        }
        catch (e) {
            return response.status(402).json(
                {
                    'message': e.message
                }
            );
        }
    }
}

module.exports = BlogController
