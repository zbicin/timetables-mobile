const fs = require('fs');
const path = require('path');

const isDirectory = (source) => fs.lstatSync(source).isDirectory();

const generateIndexes = (directories) => {
    directories.forEach((directory) => {
        const indexFilePath = path.join(directory, 'index.ts');
        const nowString = new Date().toISOString();
        const lines = [`// Auto-generated @ ${nowString}`];
        fs.readdirSync(directory).filter((f) => !isDirectory(path.join(directory, f))).forEach((file) => {
            const fileWithoutExtension = file.substr(0, file.length - 3);
            const extension = file.substr(-3);

            if(fileWithoutExtension !== 'index' && extension === '.ts') {
                const line = `export * from './${fileWithoutExtension}'`;
                lines.push(line);
            }
        });
        const output = lines.join('\n');
        //console.log(output);
        fs.writeFileSync(indexFilePath, output);
    });
};

module.exports = generateIndexes;