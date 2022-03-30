///Get the languageLanguage and inject into the bootstrap seed

const fs = require("fs-extra");
const wget = require("node-wget-js");
const path = require("path");

const languagesDirectory = "./languages";
const bootstrapSeed = "./bootstrapSeed.json";
const languageLanguage = "https://github.com/fluxsocial/language-persistence/releases/download/0.0.18/bundle.js";
const languageLanguageBundlePath = path.join(languagesDirectory, "languageLanguage", "bundle.js");

if (!fs.existsSync(path.join(languagesDirectory))) {
    fs.mkdirSync(path.join(languagesDirectory));
}

if (!fs.existsSync(path.join(languagesDirectory, "languageLanguage"))) {
    fs.mkdirSync(path.join(languagesDirectory, "languageLanguage"));
}

wget({ url: languageLanguage, dest: languageLanguageBundlePath }, () => {
    const languageLanguageBundle = fs.readFileSync(languageLanguageBundlePath).toString();
    let bootstrapSeedData = JSON.parse(fs.readFileSync(bootstrapSeed).toString());
    bootstrapSeedData["languageLanguageBundle"] = languageLanguageBundle;
    fs.writeFileSync(bootstrapSeed, JSON.stringify(bootstrapSeedData));
});