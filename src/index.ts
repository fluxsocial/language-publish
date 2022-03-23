#! /usr/bin/env node

import getAppDataPath from 'appdata-path';
import chalk from 'chalk';
import { execSync, spawn } from 'child_process';
import findProcess from 'find-process';
import kill from 'tree-kill'
import path from 'path';
import { resolve as resolvePath} from 'path'
import fs from 'fs-extra';
import { cleanOutput } from './utils';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const logger = {
  info: (...args: any[]) => !global.hideLogs && console.log(chalk.blue('[INFO]'),...args),
  error: (...args: any[]) => !global.hideLogs && console.error(chalk.red('[ERROR]'), ...args)
}

let langAddress: {[x: string]: string} = {}

async function findAndKillProcess(processName: string) {
  try {
    const list = await findProcess('name', processName)

    for (const p of list) {      
      kill(p.pid, 'SIGKILL')
    }
  } catch (err) {
    logger.error(`No process found by name: ${processName}`)
  } 
}

async function publishLanguage(binaryPath: string, bundle: string, meta: string) {
  if (bundle && meta) {
    try {    
      const language = cleanOutput(execSync(`${binaryPath} languages publish --path ${resolvePath(bundle)} --meta '${meta}'`, { encoding: 'utf-8' }))
      logger.info(`Published language: `, language)
      
      return language;
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }
}

async function installLanguageAndPublish(child: any, binaryPath: string, defaultLangPath: string, bundle?: string, meta?: string, configPath?: string, resolve?: any) {  
  const generateAgentResponse = execSync(`${binaryPath} agent generate --passphrase 123456789`, { encoding: 'utf-8' }).match(/did:key:\w+/)
  const currentAgentDid =  generateAgentResponse![0];
  logger.info(`Current Agent did: ${currentAgentDid}`);

  if (configPath) {
    const config = (await import(configPath)).default;

    console.log('config', config);
    
    for (const [lang, meta] of Object.entries(config)) {
      const bundle = path.join(defaultLangPath, lang, "build", "bundle.js");
      const language = await publishLanguage(binaryPath, bundle, JSON.stringify(meta))
      langAddress[lang] = language.address;
    }

    logger.info('Published Languages =>', langAddress)
  } else if (bundle && meta) {
    const language = await publishLanguage(binaryPath, bundle, meta as string);

    logger.info('Language address =>', language.address)
  } else {
    throw Error('No Bunlde, meta or config passed')
  }

  kill(child.pid!, async () => {
    await findAndKillProcess('holochain')
    await findAndKillProcess('lair-keystore')
    resolve(null);
  })
}


export function startServer(relativePath: string, binaryPath: string, defaultLangPath: string, bundle?: string, meta?: string, config?: string, port?: number,) {
  return new Promise(async (resolve, reject) => {
    const dataPath = path.join(getAppDataPath(relativePath), 'ad4m')
    fs.removeSync(dataPath)

    await findAndKillProcess('holochain')
    await findAndKillProcess('lair-keystore')

    execSync(`${binaryPath} init --dataPath ${relativePath}`, { encoding: 'utf-8' });

    logger.info('ad4m-test initialized')

    let child: any;

    child = spawn(`${binaryPath}`, ['serve', '--dataPath', relativePath, '--port', port!.toString()])

    const logFile = fs.createWriteStream(path.join(__dirname, 'ad4m-publish.log'))

    child.stdout.on('data', async (data: any) => {
      logFile.write(data)
    });
    child.stderr.on('data', async (data: any) => {
      logFile.write(data)
    })

    child.stdout.on('data', async (data: any) => {
      if (data.toString().includes('AD4M init complete')) {
        installLanguageAndPublish(child, binaryPath, defaultLangPath, bundle, meta, config, resolve);
      }
    });

    child.on('exit', (code: any) => {
      logger.info(`exit is called ${code}`);
    })

    child.on('error', () => {
      logger.error(`process error: ${child.pid}`)
      findAndKillProcess('holochain')
      findAndKillProcess('lair-keystore')
      findAndKillProcess('ad4m-host')
      reject()
    });
  });
}

async function main() {
  const args = await yargs(hideBin(process.argv))
  .options({
    port: { 
      type: 'number', 
      describe: 'Use this port to run ad4m GraphQL service', 
      default: 4000, 
      alias: 'p'
    },
    binaryPath: {
      type: 'string',
      describe: 'Path to ad4m-host',
      required: true, 
      alias: 'bp'
    },
    config: {
      type: 'string',
      describe: 'Config file to publish all languages at once',
    },
    bundle: {
      type: 'string',
      describe: 'Language bundle for the language to be tested',
      alias: 'b'
    },
    meta: {
      type: 'string',
      describe: 'Meta information for the language to be installed',
      alias: 'm'
    },
    defaultLangPath: {
      type: 'string',
      describe: 'Local bulid-in language to be used instead of the packaged ones',
      default: path.join(__dirname, './test-temp/languages'),
      alias: 'dlp'
    },
  })
  .strict()
  .fail((msg, err) => {
    logger.error(`Error: ${msg}, ${err}`);
    process.exit(1);
  })
  .argv;

  startServer('ad4m-publish', args.binaryPath, args.defaultLangPath, args.bundle, args.meta, args.config, args.port)
}

main();