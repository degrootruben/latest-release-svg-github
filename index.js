const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const { makeBadge } = require('badge-maker');
const method = LRSG.prototype;
const api = "https://api.github.com";

function LRSG() {

}

method.generateSVG = async function(owner, repo, filePath, fileName, prefix = "newest release", color = "#4c1") {
    return new Promise(async function(resolve, reject) {
        try {
            const url = `${api}/repos/${owner}/${repo}/releases`;
            console.log(url);
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/vnd.github.v3+json"
                }
            });
            const latestRelease = await response.json();

            const newestReleaseDate = new Date(Math.max(...latestRelease.map(element => new Date(element.published_at))));
            const newestRelease = latestRelease.find(e => new Date(e.published_at).getTime() === newestReleaseDate.getTime());
            const tagName = newestRelease.tag_name;
            
            const format = {
                label: prefix,
                message: tagName,
                color: color,
            };
               
            const svg = makeBadge(format);
            
            fs.writeFileSync(path.join(filePath, fileName), svg);
            resolve("Resolved");
        } catch(err) {
            reject(err);
        }
    });
}

module.exports = LRSG;
