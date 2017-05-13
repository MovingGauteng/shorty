"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let ShortySchema = new mongoose.Schema({
    url: {
        type: String, required: true
    },
    original: {
        type: String, required: true
    },
    constructed: {
        type: String, required: true
    },
    ga_campaign: {
        utm_source: String,
        utm_campaign: String,
        utm_medium: String,
        utm_content: String,
        utm_term: String
    },
    created: Date,
    accessed: Date,
    visits: { type: Number, default: 0 }
});
/**
 *
 * @param args
 * @returns {Promise<IShortenedUrlDocument>}
 */
ShortySchema.statics.findUrl = function (args) {
    let query = this.model('ShortenedUrl').findOne();
    query.where('original', args.url.toLowerCase().trim());
    // if there are conditions, test them
    if (args.campaign) {
        if (args.campaign.utm_content)
            query.where('ga_campaign.utm_content', args.campaign.utm_content);
        if (args.campaign.utm_medium)
            query.where('ga_campaign.utm_medium', args.campaign.utm_medium);
        if (args.campaign.utm_source)
            query.where('ga_campaign.utm_source', args.campaign.utm_source);
        if (args.campaign.utm_campaign)
            query.where('ga_campaign.utm_campaign', args.campaign.utm_campaign);
        if (args.campaign.utm_term)
            query.where('ga_campaign.utm_term', args.campaign.utm_term);
    }
    return query.exec();
};
ShortySchema.statics.addCounter = function (id, counter) {
    return this.model('ShortenedUrl').update({ _id: id }, {
        $inc: {
            visits: 1
        },
        'accessed': new Date()
    }).exec();
};
/**
 *
 * @param url
 * @returns {Promise<IShortenedUrlDocument>}
 */
ShortySchema.statics.findOriginal = function (url) {
    return this.model('ShortenedUrl').findOne({ 'url': url }).exec();
};
/**
 *
 * @param cb
 * @returns {Promise<WriteOpResult>|Promise<ShortySchema.methods>|void}
 */
ShortySchema.methods.saveShorty = function (cb) {
    return this.save(cb);
};
exports.ShortenedUrlModel = mongoose.model('ShortenedUrl', ShortySchema);
