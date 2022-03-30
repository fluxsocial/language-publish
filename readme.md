# Language Publish

# Overview

This is a command line tool which can be used for publishing multiple or single ad4m languages at once. By default the languageLanguage that is published to is: https://github.com/fluxsocial/language-publish. In order for languages published here, your application must share the same languageLanguage. If you wish to change the languageLanguage that is used for publishing, you can point to a different remote bundle by changing the `const languageLanguage` inside `scripts/prepareBootstrapSeed.js`.

# Usage

If you wish to publish multiple languages, you must change the values found inside languagePublishData. The key's for these languages are used as the name for the given language to be published, the meta is the meta information for the language as it is published and resource is the local path or remote location of the bundle path to be published. <br><br>

Once you have set the languages you wish you publish, you can begin the publishing with the following steps:


#### Prepare
```
npm i && npm run prepare && npm run build
```

#### Publish Multiple Languages

```
node dist/index.js --agent /path/to/agent/to/publish/with --config ./languagePublishData
```

#### Publish A Single Language

```
node dist/index.js --agent /path/to/agent/to/publish/with --bundle /path/to/bundle.js --meta '{\"name\":\"Name of lang\",\"description\":\"Description of lang\",\"sourceCodeLink\":\"LinkToSourceCOde\" \"possibleTemplateParams\":[\"templateParams\", ...]}'
```

