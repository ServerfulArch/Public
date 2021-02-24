
"use strict";

const FS   = require("fs");
const Path = require("path");
const ETag = require("etag");

/**
 * Instantiates a file serving extension for a Serverful server.
 * @param {String} Pathlike Directory with "public" files to handle.
 * @param {Number} [Cache] Amount of seconds to cache this resource on the client.
 * @returns {Function} A gateway handler.
 */
module.exports = (Pathlike, Cache = 300) => {

    const Endpoints = new Map();

    for (const Dest of FS.readdirSync(Pathlike)) {
        const Endpoint = Path.join(Pathlike, Dest);
        const Resource = FS.readFileSync(Endpoint, {
            encoding: "utf-8"
        });
    
        Endpoints.set(Dest.toLowerCase(), {
            Resource: Resource instanceof Buffer ?
                Buffer.from(Resource) : Resource,
            Type: {
                js:   "application/javascript",
                json: "application/json",
                png:  "image/png",
                svg:  "image/svg+xml",
                ico:  "image/x-icon",
                html: "text/html",
                css:  "text/css",
            }[Dest.split(".").pop()]
        });
    }

    return Packet => {
        const URL = Packet.URL.Endpoint.toLowerCase();
        const Content = Endpoints.get(URL);
        if (!Content) return Packet.Request.End(404);

        Packet.Request.Headers({
            "ETag":          ETag(Content.Resource),
            "Cache-Control": Cache === -1 ? "no-store" : `max-age=${Cache}`,
            "Content-Type":  Content.Type
        });

        Packet.Request.Write(Content.Resource);
        return Packet.Request.End(200);
    }
}
