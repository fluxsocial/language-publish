//Remove languageLanguage bundle so that when publish & making commit to github, the languageLanguage bundle is not comitted also
const fs = require("fs");

const bootstrapSeedPath = "./bootstrapSeed.json";

async function main() {
    if (fs.existsSync(bootstrapSeedPath)) {
        const bootstrapSeed = JSON.parse(fs.readFileSync(bootstrapSeedPath).toString());
        bootstrapSeed["languageLanguageBundle"] = "";
        fs.writeFileSync(bootstrapSeedPath, JSON.stringify(bootstrapSeed));
    } else {
        throw new Error(`Could not find boostrapSeed at path: ${bootstrapSeedPath}`)
    }
}

main();