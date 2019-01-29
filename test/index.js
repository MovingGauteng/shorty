"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const env = process.env.NODE_ENV || 'development', config = require('../config/config')[env];
const packageDefinition = protoLoader.loadSync(path.join(__dirname + '/../proto/shorty.proto'), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const Proto = grpc.loadPackageDefinition(packageDefinition);
const TestClient = new Proto.shorty.ShortyService(config.db.bind, grpc.credentials.createInsecure());
const shorten = (data) => {
    let metadata = new grpc.Metadata();
    metadata.add('data', 'test');
    TestClient.shorten(data, metadata, (err, resp) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(resp);
    });
};
// run tests
shorten({
    url: "http://movinggauteng.co.za/stops/529f390a291117065f00049e/swardlelie_ave__rossouw%20st%20%7C%20die%20wilgers",
    campaign: {
        utm_source: '',
        utm_campaign: '',
        utm_content: '',
        utm_term: '',
        utm_medium: ''
    }
});
TestClient.getUrl({
    url: 'https://rwt.to/obkm5d78'
}, (err, resp) => {
    console.log(err, resp);
});
