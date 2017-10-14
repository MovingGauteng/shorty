"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shorty_1 = require("./proto/shorty");
const mongoose = require("mongoose");
const cluster = require('cluster');
const env = process.env.NODE_ENV || 'development', config = require('./config/config')[env];
if (cluster.isMaster) {
    let cpuCount = 1;
    let i, worker;
    for (i = 0; i < cpuCount; i++) {
        worker = cluster.fork();
    }
    // respawn dying workers
    cluster.on('exit', (worker) => {
        console.log(`worker ${worker.id} has died`);
        cluster.fork();
    });
}
else {
    // single connection to MongoDB
    mongoose.Promise = global.Promise;
    let db;
    // check environments
    if (env === 'production') {
        db = mongoose.connect(config.db.url);
    }
    else {
        db = mongoose.connect(config.db.url);
    }
    // start gRPC service
    const grpc = require('grpc');
    const path = require('path');
    const PROTO_PATH = path.join(__dirname, '/proto/shorty.proto');
    // load the service
    const ShortyProto = grpc.load(PROTO_PATH).shorty;
    const gRPCServer = new grpc.Server();
    gRPCServer.addService(ShortyProto.ShortyService.service, shorty_1.endpoints);
    gRPCServer.bind(config.bind || '0.0.0.0:8081', grpc.ServerCredentials.createInsecure());
    gRPCServer.start();
    console.log('shorty service started');
}
