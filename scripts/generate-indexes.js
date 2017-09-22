const fs = require('fs');
const path = require('path');

const isDirectory = (source) => fs.lstatSync(source).isDirectory();
const flatten = (a, b) => a.concat(b);

const getDirectoriesFromPath = (p)  => {
    const mainResult = fs.readdirSync(p)
        .map(name => path.join(p, name))
        .filter(isDirectory);
    const subResult = mainResult
        .map((path) => getDirectoriesFromPath(path))
        .reduce(flatten, [])
        .filter((a) => a.length > 0);
        
    const result = mainResult.concat(subResult);
    return result;
}

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
        // console.log(indexFilePath, output);
        fs.writeFileSync(indexFilePath, output);
    });

};

module.exports = generateIndexes;

const rootPath = path.join(__dirname, '..', 'www', 'js');
const directories = getDirectoriesFromPath(rootPath);
generateIndexes(directories);
console.log(`${directories.length} directories processed under ${rootPath}.`);