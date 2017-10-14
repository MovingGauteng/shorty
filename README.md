# Shorty

URL shortener met 'n bang 💥

Shorty is a small URL shortener that takes a link, and optional Google Analytics campaign tags, to create a shortened URL.
It is built with MongoDB and gRPC in Node.js.

There is nothing special about Shorty, as there's tons of URL shorteners out there. 
We created it so that we could run our own shortener.

We currently use Shorty in our automated public transit tweets.

## Stack

### MongoDB

We used MongoDB because it's what we use for most data storage in our platform. 
If there's interest, we can create a SQL adapter (we use MSSQL and PostgreSQL, so any of those two).

### [gRPC](https://grpc.io)

We've been using gRPC for our microservices since August 2016. We're rooting for more projects to support gRPC out of the box!


## Running

### Configuring

There is a `./config/config.sample.js` file that has configuration information. Modify the info, and save as `./config/config.js`.

### Server

Shorty will run a gRPC server on whatever interface/port you specify. It'll run on `0.0.0.0:8081` by default.

Clone the repo, then install dependencies.

```bash
$ npm install
```

You can then start `index.js` with your favourite Node.js runner, e.g. `node index.js`

### Client

Creating a gRPC client is out of the scope of this project. [//grpc.io](https://grpc.io) has tutorials etc. on how to create clients in various programming languages.

The gRPC contract is in `./proto/shorty.proto`. There are 3 methods:

```proto
service ShortyService {
    // shorten an url
    rpc Shorten(ShortenRequest) returns (Shorty) {}
    // increment number of times the url has been viewed
    rpc AddCounter(Counter) returns (Empty) {}
    // get url, you only need to provide the url (shortened suffix)
    rpc GetUrl (Shorty) returns (Shorty) {}
}
```

### Tests

We hadn't included tests in the repo, because we wrote the tests separately in Kotlin (much more pleasant).
We'll move the tests to this repo when we get a chance.

## Routing

Please note that as Shorty will be routed to `POST[/shorty.ShortyService/*]`. If you're using nghttp2, you'll need to proxy traffic appropriately.
We have a blog post about how to do that here: [https://rwt.to/cN4dUmoa]("https://rwt.to/cN4dUmoa") *the url points to [https://movinggauteng.co.za/blog/2016/08/03/grpc-with-nghttp2/](https://movinggauteng.co.za/blog/2016/08/03/grpc-with-nghttp2/) and has no analytics tracker, was just showing an example*.

## Contributing

Please feel free to use Shorty as you please. I thought of refactoring it and publishing it as an NPM module, but I don't see much benefit in that.

The best way would probably be to just fork the project and customise it for your needs. PRs are welcome though.

We'll keep the Node dependencies up-to-date if there are breaking changes in gRPC that need attention. Ping [twittet::@nevi_me](https://twitter.com/nevi_me) if you have specific gRPC questions, I'm happy to answer where I can.
I've been writing services and clients in gRPC with Python, Node and Java+Android for over a year now.