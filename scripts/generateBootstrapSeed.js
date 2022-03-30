/// Generate a bootstrap seed from published languages and agent found in OS app data path / ad4m-publish (as created by publishing languages)
const getAppDataPath = require('appdata-path');
const fs = require("fs-extra");
const wget = require("node-wget-js");
const path = require("path");

//Prepare const values
const publishingAgentPath = path.join(getAppDataPath("ad4m-publish"), "ad4m", "agent.json");
const languagesDirectory = path.join("./languages");
const ad4mBootstrapSeed = "./ad4mBootstrapSeed.json";
const languageLanguage = fs.readFileSync("./scripts/languageLanguageResource").toString();
const languageLanguageBundlePath = path.join(languagesDirectory, "languageLanguage", "bundle.js");
const publishedLanguagesPath = path.join("./publishedLanguages.json");
const publishedLanguages = JSON.parse(fs.readFileSync(publishedLanguagesPath).toString());

//Check that publishedLanguages contains all required languages
if (!publishedLanguages["socialContext"]) {
    throw new Error("publishedLanguages.json does not contain a socialContext hash")
}
if (!publishedLanguages["agentLanguage"]) {
    throw new Error("publishedLanguages.json does not contain a agentLanguage hash")
}
if (!publishedLanguages["directMessageLanguage"]) {
    throw new Error("publishedLanguages.json does not contain a directMessageLanguage hash")
}
if (!publishedLanguages["perspectiveLanguage"]) {
    throw new Error("publishedLanguages.json does not contain a perspectiveLanguage hash")
}
if (!publishedLanguages["neighbourhoodLanguage"]) {
    throw new Error("publishedLanguages.json does not contain a neighbourhoodLanguage hash")
}

let seedData = {
    "trustedAgents":[], 
    "knownLinkLanguages":[],
    "agentLanguage":"",
    "directMessageLanguage":"",
    "perspectiveLanguage":"",
    "neighbourhoodLanguage":"",
    "languageLanguageBundle": ""
};

fs.ensureDirSync(languagesDirectory);

const ad4mAgent = JSON.parse(fs.readFileSync(publishingAgentPath).toString())["did"];

if (fs.existsSync(languageLanguageBundlePath)) {
    fs.rmSync(languageLanguageBundlePath);
}

wget({ url: languageLanguage, dest: languageLanguageBundlePath }, () => {
    seedData["trustedAgents"] = [ad4mAgent];
    seedData["knownLinkLanguages"] = [publishedLanguages["socialContext"]];
    seedData["agentLanguage"] = publishedLanguages["agentLanguage"];
    seedData["directMessageLanguage"] = publishedLanguages["directMessageLanguage"];
    seedData["perspectiveLanguage"] = publishedLanguages["perspectiveLanguage"];
    seedData["neighbourhoodLanguage"] = publishedLanguages["neighbourhoodLanguage"];
    const languageLanguageBundle = fs.readFileSync(languageLanguageBundlePath).toString();
    seedData["languageLanguageBundle"] = languageLanguageBundle;

    fs.writeFileSync(ad4mBootstrapSeed, JSON.stringify(seedData));
});