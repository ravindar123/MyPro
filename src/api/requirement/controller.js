'use strict';
const Hapi = require('@hapi/hapi');
var fs = require('fs');
var request = require('request');
const downloadsFolder = require('downloads-folder');
var path = require("path");
var jsonpatch = require("json-patch");
var boom= require("@hapi/boom");
const jwt = require('jsonwebtoken');
const sharp = require('sharp');

var resizeOption = "contain"; 
var resize= sharp().resize({ width: 50, height: 50 });

var mkdir = 'public';
var methods = {


    downloadImage: function (request, h) {
        try {
            download('https://media.licdn.com/dms/image/C510BAQFrFgKeFpAw5g/company-logo_200_200/0?e=2159024400&v=beta&t=kdbAm-4rnHXDjQMxffJemABW_vq5ujiOfcFV0IiEip4', mkdir + '/cs.jpg', function () {
                console.log('done');
            });
            return "Image successfully downloaded,please check in public foder!!";
        } catch (error) {
            return "Error while downloading image:" + error;
        }
    },

    update: function (request, h) {
         let updatedJson;
        try {
        const payload = request.payload;
        let json = payload.json;
        let patch = payload.patch;     
        updatedJson = jsonpatch.apply(json, patch);
        } catch (error) {
            return error;
        }
        return updatedJson;

    },

    testMethod2: function (request, h) {
        const payload = request.payload;
        console.log(payload);
        let user = payload.user;
        let pwd = payload.pwd;
        return { "user": user, "pwd": pwd };
    },

    generateToken: function (request, h) {
        const payload = request.payload;
        let user = payload.user;
        let pwd = payload.pwd;
        var privateKey = 'donotShare';
        var token = jwt.sign({ user: user }, privateKey, { algorithm: 'HS256', expiresIn: "10m" } );  
        return  {jwt:token, expiresIn:"It will expires in 10 minuts"};
    }


};

module.exports = methods;

function download(uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
}
