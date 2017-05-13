"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("grpc");
const shortener_1 = require("../controllers/shortener");
const shorty_1 = require("../models/shorty");
/**
 * gRPC endpoints
 */
const shorten = (call, callback) => {
    // make a request to create short url
    shortener_1.shorten(call.request).then((res) => {
        return callback(null, {
            id: res._id.toString(),
            url: res.url
        });
    }).catch(e => {
        return callback({
            code: grpc.status.UNIMPLEMENTED,
            details: "Method not implemented"
        });
    });
};
const addCounter = (call, callback) => {
    shorty_1.ShortenedUrlModel.addCounter(call.request.id, call.request.value);
    console.log(`incremented ${call.request.id} by ${call.request.value}.`);
    return callback(null, {});
};
const getUrl = (call, callback) => {
    shorty_1.ShortenedUrlModel.findOriginal(call.request.url.trim())
        .then((res) => {
        if (!res) {
            // not found
            return callback({
                code: grpc.status.NOT_FOUND,
                details: "url not found"
            });
        }
        return callback(null, {
            url: res.constructed,
            id: res._id.toString()
        });
    }).catch(err => {
        console.error(err);
        return callback({
            code: grpc.status.UNKNOWN,
            details: "Error getting url, please try again"
        });
    });
};
exports.endpoints = { shorten, addCounter, getUrl };
