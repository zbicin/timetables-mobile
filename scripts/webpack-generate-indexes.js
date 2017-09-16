const path = require('path');
const generateIndexes = require('./generate-indexes');

function WebpackGenerateIndexes(ignorePaths = []) {
    let apply = (compiler) => {
        compiler.plugin('watch-run', (watching, cb) => {
            const watcher = watching.compiler.watchFileSystem.wfs.watcher;
            if(watcher) {
                const files = Object.keys(watcher.mtimes);
                const uniqueDirectories = files
                    .map((f) => path.dirname(f))
                    .filter((d, i, self) => self.indexOf(d) === i)
                    .filter((d) => ignorePaths.indexOf(d) === -1);

                if(uniqueDirectories.length) {
                    console.log('Generating indexes for: ');
                    uniqueDirectories.forEach((d) => console.log(d));
                    generateIndexes(uniqueDirectories);
                }
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