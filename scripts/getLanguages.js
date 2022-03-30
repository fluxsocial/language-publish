///Get the data for the languages that are going to be published
const fs = require("fs-extra");
const wget = require("node-wget-js");
const path = require("path");

const languagesDirectory = path.join("./languages");
const languages = JSON.parse(fs.readFileSync("./languagePublishData.json").toString());

fs.ensureDirSync(languagesDirectory);

for (const language in languages) {
    console.debug("Fetching language with name", language);
    const bundlePath = path.join(languagesDirectory, language, "build");
    fs.ensureDirSync(bundlePath);

    if (languages[language].resource) {
        let url = languages[language].resource;
        let dest = path.join(bundlePath, "bundle.js");
        console.debug("Saving resource: ", url, "to path: ", dest);
        if (url.slice(0, 8) != "https://" && url.slice(0, 7) != "http://") {
          fs.copyFileSync(url, dest);
        } else {
          wget({ url, dest });
        }
    } else {
        throw new Error("Expected to find a resource for languages");
    }
}