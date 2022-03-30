# Language Publish

# Overview

This is a command line tool which can be used for publishing multiple or single ad4m languages at once. By default the languageLanguage that is published to is: https://github.com/fluxsocial/language-publish. In order for languages published here to be resolvable in your app, you must also use the same languageLanguage. If you wish to change the languageLanguage that is used for publishing, you can point to a different remote bundle by changing the `const languageLanguage` inside `scripts/prepareBootstrapSeed.js`.

# Usage

If you wish to publish multiple languages, you must change the values found inside `languagePublishData.json`. The key's for these languages are used as the name for the given language to be published, the meta is the meta information for the language as it is published and resource is the local path or remote location of the bundle path to be published. <br>

Once you have set the languages you wish you publish, you can begin the publishing with the following steps:


#### Prepare
```
npm i && npm run prepare && npm run build
```

#### Publish Multiple Languages

```
node dist/index.js --agent /path/to/agent/to/publish/with --passphrase passphraseOfAgent --config ./languagePublishData.json
```

#### Publish A Single Language

```
node dist/index.js --agent /path/to/agent/to/publish/with --passphrase passphraseOfAgent --bundle /path/to/bundle.js --meta '{\"name\":\"Name of lang\",\"description\":\"Description of lang\",\"sourceCodeLink\":\"LinkToSourceCOde\" \"possibleTemplateParams\":[\"templateParams\", ...]}'
```

# F&Q's
#### Where can I get an agent.json used for publishing?

An `agent.json` file that is used to represent your agent can be created by first running the [ad4m-cli](https://github.com/perspect3vism/ad4m-host), and init'ing an agent. This will create an `agent.json` file in an ad4m directory found in your OS's app data directory.