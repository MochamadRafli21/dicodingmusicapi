const fs = require('fs');

class StorageService{
    constructor(folder){
        this._folder = folder;
        if(!fs.existsSync(folder)){
            fs.mkdirSync("folder", {recursive:true});
        }
    }

    writeFile(file, meta){
        const metaName = meta.filename.replace(/\s+/g, '_').toLowerCase();
        const filename = +new Date() + metaName;
        const path = `${this._folder}/${filename}`;

        const fileStream = fs.createWriteStream(path);

        return new Promise((resolve, reject) => {
            fileStream.on('error', (error) => reject(error));
            file.pipe(fileStream);
            file.on('end', () => resolve(filename));
        });
    }
}

module.exports = StorageService;