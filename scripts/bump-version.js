const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');
const packageLockJson = require('../package-lock.json');
let configXml = fs.readFileSync(path.join(__dirname, '..', 'config.xml')).toString();

const version = packageJson.version;
const numericalVersion = version.split('.').map(a => parseInt(a, 10));
const command = process.argv[2];

switch(command) {
    case 'patch':
        numericalVersion[2]++;
        break;
    case 'minor':
        numericalVersion[1]++;
        numericalVersion[2] = 0;
        break;
    case 'major':
        numericalVersion[0]++;
        numericalVersion[1] = 0;
        numericalVersion[2] = 0;
        break;
    default:
        throw 'Unknown version name';
}

const newVersion = numericalVersion.join('.');
console.log(`Changing from ${version} to ${newVersion}.`);

packageJson.version = newVersion;
packageLockJson.version = newVersion;
configXml = configXml.replace(`version="${version}"`, `version="${newVersion}"`);

fs.writeFileSync(path.join(__dirname, '..', 'package.json'), JSON.stringify(packageJson, null, 2));
fs.writeFileSync(path.join(__dirname, '..', 'package-lock.json'), JSON.stringify(packageLockJson, null, 2));
fs.writeFileSync(path.join(__dirname, '..', 'config.xml'), configXml);