'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

////////////////////// login-register //////////////////////
Route.on('/').render('welcome');
Route.get('users', 'UserController.users');
Route.post('createUser', 'UserController.createUser');
Route.post('login', 'UserController.authenticate');

////////////////////// blogs /////////////////////////
// Grouped
Route.group(() => {
    Route.get('allBlogsList', 'BlogController.getAllBlogsList');
    Route.post('createBlog', 'BlogController.createBlog');
    Route.post('updateBlog', 'BlogController.updateBlog').middleware(['auth:jwt']);
    Route.post('deleteBlog', 'BlogController.deleteBlog').middleware(['auth:jwt']);
    Route.post('rateBlog', 'BlogController.rateBlog').middleware(['auth:jwt']);

}).prefix('api/blogs')

///////////////////// blog-categories /////////////////////////
Route.get('allCategoriesList', 'CategoryController.getAllCategoriesList')

///////////////////// blog-tags /////////////////////////
Route.get('allTagsList', 'TagController.getAllTagsList')

//////////////////// file upload ////////////////////////
Route.post('uploadFile', 'TestController.uploadFile');
// Route.post('uploadMultipleFiles', 'TestController.uploadMultipleFiles');


