
import * as grpc from "grpc";
import {shorten as Shorten} from "../controllers/shortener";
import {IShortenedUrlDocument, ShortenedUrlModel} from "../models/shorty";

// interfaces
export interface Shorty {
  id: string;
  url: string;
}

export interface ShortyRequest {
  url: string;
  campaign?: GoogleAnalyticsCampaign;
}

export interface GoogleAnalyticsCampaign {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

interface gRPCError {
  code: number;
  details: string;
}

/**
 * gRPC endpoints
 */
const shorten = (call, callback: (err?: gRPCError, result?: Shorty) => void) => {
  // make a request to create short url
  Shorten(call.request).then((res: IShortenedUrlDocument) => {
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

const addCounter = (call, callback: (err?: gRPCError, result?: {}) => void) => {
  ShortenedUrlModel.addCounter(call.request.id, call.request.value);
  console.log(`incremented ${call.request.id} by ${call.request.value}.`);
  return callback(null, {});
};

const getUrl = (call, callback: (err?: gRPCError, result?: Shorty) => void) => {
  ShortenedUrlModel.findOriginal(call.request.url.trim())
    .then((res?: IShortenedUrlDocument) => {
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
  })
};

export const endpoints = { shorten, addCounter, getUrl };