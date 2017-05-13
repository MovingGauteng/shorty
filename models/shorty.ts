
import * as mongoose from 'mongoose';
import {GoogleAnalyticsCampaign, ShortyRequest} from "../proto/shorty";

export interface IShortenedUrl {
  url: string;
  original: string;
  constructed: string;
  ga_campaign: GoogleAnalyticsCampaign;
  created: Date;
  accessed: Date;
  visits: number;
}

let ShortySchema: mongoose.Schema = new mongoose.Schema({
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
  visits: {type: Number, default: 0}
});

/**
 *
 * @param args
 * @returns {Promise<IShortenedUrlDocument>}
 */
ShortySchema.statics.findUrl = function(args: ShortyRequest) {
  let query = this.model('ShortenedUrl').findOne();
  query.where('original', args.url.toLowerCase().trim());
  // if there are conditions, test them
  if (args.campaign) {
    if (args.campaign.utm_content) query.where('ga_campaign.utm_content', args.campaign.utm_content);
    if (args.campaign.utm_medium) query.where('ga_campaign.utm_medium', args.campaign.utm_medium);
    if (args.campaign.utm_source) query.where('ga_campaign.utm_source', args.campaign.utm_source);
    if (args.campaign.utm_campaign) query.where('ga_campaign.utm_campaign', args.campaign.utm_campaign);
    if (args.campaign.utm_term) query.where('ga_campaign.utm_term', args.campaign.utm_term);
  }
  return query.exec();
};

ShortySchema.statics.addCounter = function(id: string, counter: number) {
  return this.model('ShortenedUrl').update({_id: id}, {
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
ShortySchema.statics.findOriginal = function(url: string) {
  return this.model('ShortenedUrl').findOne({'url': url}).exec();
};

/**
 *
 * @param cb
 * @returns {Promise<WriteOpResult>|Promise<ShortySchema.methods>|void}
 */
ShortySchema.methods.saveShorty = function(cb: (err: any, res: any) => void) {
  return this.save(cb)
};

export const ShortenedUrlModel: mongoose.Model<IShortenedUrlDocument> = mongoose.model<IShortenedUrlDocument>('ShortenedUrl', ShortySchema);

/**
 * Interfaces
 */
export interface IShortenedUrlDocument extends IShortenedUrl, mongoose.Document {
  findUrl: (args: ShortyRequest) => Promise<IShortenedUrlDocument>;
  findOriginal: (url: string) => Promise<IShortenedUrlDocument>;
  addCounter: (id: string, counter: number) => void;
  saveShorty: () => Promise<IShortenedUrlDocument>;
}
