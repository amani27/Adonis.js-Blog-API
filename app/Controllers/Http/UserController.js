'use strict'
const Hash = use('Hash')
const User = use('App/Models/User')
const { validate } = use('Validator')


class UserController {
    async users({ request, response }) {
        const users = await User.all()
        response.send(users)
    }

    async createUser({ request, response }) {
        // /////////////////////// testing user input validation
        // const rules = {
        //     email: 'required|email|unique:users,email',
        //     password: 'required'
        // }
        // const validation = await validate(request.all(), rules)

        // if (validation.fails()) {
        //     return validation.messages()
        // }

        // return 'Validation passed'
        var user = {
            name: request.body.name,
            email: request.body.email,
            password: request.body.password,
        };

        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(user.email)) {
            // return response.status(400).json({
            //     'message': 'Stuck here!',
            //     'success': false
            // })
        }
        else {
            return response.status(402).json({
                'message': 'Invalid email address!',
                'success': false
            })
        }
        user.email = user.email.toLowerCase()
        let check = await User.query().where('email', user.email).first()
        if (check) {
            return response.status(402).json({
                'message': 'This email is already used!',
                'success': false
            })
        }

        var newUser = await User.create(user);

        return newUser;
    }

    async authenticate({ request, response, auth }) {
        const data = request.all()

        // /////////////////////// session auth start ///////////////////////
        // try {
        //     let user = await auth.query().attempt(data.email, data.password)
        //     return response.status(200).json(user)
        // } catch (e) {
        //     return response.status(401).json(
        //         {
        //             'message': e.message // need to logout before logging in again

        //         }
        //     )
        // }
        // /////////////////////// session auth end ///////////////////////


        ////////////////////// jwt auth start ////////////////////////
        try {
            let token = await auth.query().attempt(data.email, data.password);
            let user = null;
            if (token) user = await
                User.findBy('email', data.email);
            return response.status(200).json({
                'token': token.token,
                'user': user,
            });
        } catch (e) {
            return response.status(401).json(
                {
                    'message': e.message

                }
            );
        }
        ////////////////////// jwt auth end ////////////////////////
    }
}

module.exports = UserController
