const { name, engines } = require('../package.json');

const { node: requiredNodeVersion } = engines;
const { node: currentNodeVersion } = process.versions;

if (currentNodeVersion < requiredNodeVersion || currentNodeVersion > requiredNodeVersion) {
    console.log(
        '\x1b[31m',
        'ERROR',
        '\x1b[0m',
        `Unsupported engine for ${name}. Wanted: ${requiredNodeVersion} Current: ${currentNodeVersion}.`
    );

    process.exit(1);
}