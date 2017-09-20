const fs = require('fs');
const path = require('path');
const generateIndexes = require('./generate-indexes');

const isDirectory = (source) => fs.lstatSync(source).isDirectory();
const flatten = (a, b) => a.concat(b);

function getDirectoriesFromWatcher(watcher) {
    const files = Object.keys(watcher.mtimes);
    const result = files
        .map((f) => path.dirname(f))
        .filter((d, i, self) => self.indexOf(d) === i)
        .filter((d) => ignorePaths.indexOf(d) === -1);
    return result;
}

function getDirectoriesFromPath(p) {
    const mainResult = fs.readdirSync(p)
        .map(name => p.join(p, name))
        .filter(isDirectory);
    const subResult = mainResult
        .map((path) => getDirectoriesFromPath(path))
        .reduce(flatten, [])
        .filter((a) => a.length > 0);
        
    const result = mainResult.concat(subResult);
    return result;
}

function WebpackGenerateIndexes(ignorePaths = []) {
    let apply = (compiler) => {
        compiler.plugin('watch-run', (watching, cb) => {
            console.log('watch-run');
            const watcher = watching.compiler.watchFileSystem.wfs.watcher;
            let uniqueDirectories = [];
            if(watcher) {
                uniqueDirectories = getDirectoriesFromWatcher(watcher);
            } else {
                let rootPath = path.dirname(compiler.options.entry.app);
                uniqueDirectories = getDirectoriesFromPath(rootPath);
            }
            
            if(uniqueDirectories.length) {
                console.log('Generating indexes for: ');
                uniqueDirectories.forEach((d) => console.log(d));
                generateIndexes(uniqueDirectories);
            }
            cb();
        });

        compiler.plugin('run', (watching, cb) => {
            console.log('run');
            let rootPath = path.dirname(compiler.options.entry.app);
            let uniqueDirectories = getDirectoriesFromPath(rootPath);
            
            if(uniqueDirectories.length) {
                console.log('Generating indexes for: ');
                uniqueDirectories.forEach((d) => console.log(d));
                generateIndexes(uniqueDirectories);
            }
            cb();
        });
    }
    return {
        apply
    };
}

WebpackGenerateIndexes['default'] = WebpackGenerateIndexes;
module.exports = WebpackGenerateIndexes;