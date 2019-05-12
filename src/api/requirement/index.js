const Hapi = require('@hapi/hapi');
const routes = require('./route');


 function init(server) {
    routes.init();
}

exports.init=init;