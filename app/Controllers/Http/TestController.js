'use strict'
const Helpers = use('Helpers')

class TestController {

    ////////////////////////////////// upload file
    async uploadFile({ request, response }) {
        const file = request.file('file', {
            allowedExtensions: ['jpg', 'png', 'jpeg'],
            maxSize: '100mb',
        })

        if (file) {
            const type = file.toJSON().extname;
            const name = `file_${new Date().getTime()}.${type}`

            // UPLOAD THE file TO UPLOAD FOLDER
            await file.move(Helpers.publicPath('uploads'), {
                name: name
            })

            if (!file.moved()) {
                console.log('upload error')
                return file.error()
            }

            // return attahcment
            return response.status(200).json({
                message: 'File has been uploaded successfully!',
                // url: name,
                url: `http://127.0.0.1:3333/uploads/${name}`,
                // url: `http://localhost:3333/tmp/uploads/${name}`,
                // url: `${Env.get('SITE_URL')}/uploads/${name}`,
                extension: type,
            })
        }

        return response.status(402).json({
            'message': 'Invalid file type. Only image is allowed',
            'success': false,
        })
    }

    // ////////////////////////////////// upload file
    // async uploadMultipleFiles({ request, response }) {
    //     const file = request.file('files', {
    //         allowedExtensions: ['jpg', 'png', 'jpeg'],
    //         maxSize: '100mb',
    //     })

    //     if (file) {
    //         const type = file.toJSON().extname;
    //         const name = `file_${new Date().getTime()}.${type}`

    //         // UPLOAD THE file TO UPLOAD FOLDER
    //         await file.move(Helpers.publicPath('uploads'), {
    //             name: name
    //         })

    //         if (!file.moved()) {
    //             console.log('upload error')
    //             return file.error()
    //         }

    //         // return attahcment
    //         return response.status(200).json({
    //             message: 'File has been uploaded successfully!',
    //             url: `http://127.0.0.1:3333/uploads/${name}`,
    //             extension: type,
    //         })
    //     }

    //     return response.status(402).json({
    //         'message': 'Invalid file type. Only image is allowed',
    //         'success': false,
    //     })
    // }

}

module.exports = TestController
