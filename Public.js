
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

    (function Directory (Destination) {
        const Source = Path.join(Pathlike, Destination);
        for (const File of FS.readdirSync(Source)) {
            if (/^[\._]/.test(File)) return;
            const SourceFile = Path.join(Source, File);
            const Endpoint = Path.join(Destination, File);

            if (FS.statSync(SourceFile).isDirectory()) {
                Directory(Endpoint);
                continue;
            }

            const Resource = FS.readFileSync(SourceFile, {encoding: "utf-8"});

            Endpoints.set(Endpoint.toLowerCase(), {
                Resource: Resource instanceof Buffer ?
                    Buffer.from(Resource) : Resource,
                Type: {
                    js:   "application/javascript",
                    json: "application/json",
                    png:  "image/png",
                    svg:  "image/svg+xml",
                    ico:  "image/x-icon",
                    html: "text/html",
                    css:  "text/css"
                }[File.split(".").pop()]
            });
        }
    })("/");

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
