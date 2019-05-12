const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const controller = require('./controller');
const Model = require('./requirement.js');
const Validator = require('./requirement-validator');

function init(server) {

    server.route({
        method: 'GET',
        path: '/getImage',
        handler: controller.downloadImage,
        options: {
         auth: 'jwt',
         tags: ["api"],
         validate: {
            headers: Joi.object({'authorization': Joi.string().required()}).unknown()
        }
        }
       

    });

    server.route({
        method: 'POST',
        path: '/generate_JWT_token',
        handler: controller.generateToken,
        options: {
            tags: ["api"],
            validate: {
                payload: {
                    user: Joi.string().required(),
                    pwd: Joi.string().required()
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/jsonPatch',
        handler: controller.update,
        options: {
            auth: 'jwt',
            tags: ["api"],
            validate: {
                payload: {
                    json: Joi.object().required(),
                    patch: Joi.array().required()
                },
                headers: Joi.object({'authorization': Joi.string().required()}).unknown()
            }
        }
    });

}

exports.init = init;

