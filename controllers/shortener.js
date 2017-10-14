"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = require("querystring");
const shorty_1 = require("../models/shorty");
const _ = require("underscore");
const env = process.env.NODE_ENV || 'development', config = require('../config/config')[env];
const chars = 'nHz2QqF4p51G7a9ef6mXdglBo8sVtLwRjkPxySACrNhMDEUiTJ0KbOuvUcWY3Z';
function numToBase62(n) {
    if (n > 62) {
        return numToBase62(Math.floor(n / 62)) + chars[n % 62];
    }
    return chars[n];
}
/**
 *
 * @param args
 * @returns {Promise<IShortenedUrlDocument>}
 */
exports.shorten = function (args) {
    // join url to shorten
    let url = joinUrl(args);
    return new Promise((fulfill, reject) => {
        // check if url exists before saving it
        shorty_1.ShortenedUrlModel.findUrl(args).then((res) => {
            if (!res) {
                // save url
                let s = new shorty_1.ShortenedUrlModel();
                // proceed to create one
                const idRef = createShortSegment(s._id.toString());
                s.original = args.url;
                s.constructed = url;
                s.url = `${config.prefix}/${idRef}`;
                s.ga_campaign = args.campaign;
                s.visits = 0;
                s.created = new Date();
                s.save().then(res => fulfill(res)).catch(err => reject(err));
            }
            else {
                fulfill(res);
            }
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    });
};
module.exports = { shorten: exports.shorten };
const joinUrl = (request) => {
    let base = `${request.url.toLowerCase().trim()}`;
    if (request.campaign) {
        base += '?';
        if (request.campaign.utm_medium) {
            base += `utm_medium=${querystring_1.escape(request.campaign.utm_medium.trim())}&`;
        }
        if (request.campaign.utm_campaign) {
            base += `utm_campaign=${querystring_1.escape(request.campaign.utm_campaign.trim())}&`;
        }
        if (request.campaign.utm_source) {
            base += `utm_source=${querystring_1.escape(request.campaign.utm_source.trim())}&`;
        }
        if (request.campaign.utm_content) {
            base += `utm_content=${querystring_1.escape(request.campaign.utm_content.trim())}&`;
        }
        if (request.campaign.utm_term) {
            base += `utm_term=${querystring_1.escape(request.campaign.utm_term.trim())}&`;
        }
    }
    return base;
};
const createShortSegment = (id) => {
    let obj = _.first(id, 8);
    let last = _.last(id, 4);
    last = last.concat(obj);
    let memo = '';
    memo = _.reduce(last, function (memo, w) { return memo + w; }, memo, 0);
    let hex = parseInt(memo, 16);
    let share = numToBase62(hex);
    share = share.replace('undefine', ''); // intentionally leaving 'd' to ensure that there's some text
    return share;
};
