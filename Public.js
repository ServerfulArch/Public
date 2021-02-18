
"use strict";

const FS   = require("fs");
const Path = require("path");

/**
 * Instantiates a file serving extension for a Serverful server.
 * @param {String} Pathlike Directory with "public" files to handle.
 * @returns {Function} A gateway handler.
 */
module.exports = Pathlike => {

    const Endpoints = new Map();

    for (const Dest of FS.readdirSync(Pathlike)) {
        const Endpoint = Path.join(Pathlike, Dest);
        const Resource = FS.readFileSync(Endpoint, {
            encoding: "utf-8"
        });
    
        Endpoints.set(Endpoint, {
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
        const URL = Packet.URL.Raw.toLowerCase();
        const Content = Endpoints.get(URL);
        if (!Content) return Packet.Request.End(404);

        Packet.Request.Headers("Content-Type", Content.Type);
        Packet.Request.Write(Content.Resource);
        return Packet.Request.End(200);
    }
}
