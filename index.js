'use strict';

const Hapi = require('@hapi/hapi');
const route = require('./src/api/requirement/route');
const controller = require('./src/api/requirement/controller');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
const jwt = require('jsonwebtoken');


const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    const swaggerOptions = {
        info: {
            title: 'Test API Documentation',
            version: "1",
        },
    };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
    await server.register(require('@hapi/inert'));
    const people = { // our "users database"
        user1: {
            user: 'user1',
            pwd: 'xxxx'
        },
        user2: {
            user: 'user2',
            pwd: 'xxxx'
        },
        user3: {
            user: 'user3',
            pwd: 'xxxx'
        },

    };
    var privateKey = 'donotShare';
    var validate = function (decoded, request) {
        console.log(people[decoded.user]);
        if (!people[decoded.user]) {
            return { isValid: false };
        }
        else {
            return { isValid: true };
        }
    };


    await server.register(require('hapi-auth-jwt2'));

    server.auth.strategy('jwt', 'jwt', {
        key: privateKey,
        validate: validate,
        verifyOptions: { 
            ignoreExpiration: false,
            algorithms: ['HS256'] }  // only allow HS256 algorithm
    });

    //server.auth.default('jwt');  



    route.init(server);

    await server.start();
    console.log('Server running on %ss', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();