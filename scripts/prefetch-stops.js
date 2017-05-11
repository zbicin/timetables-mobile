const fs = require('fs');
const path = require('path');
const request = require('request-promise-native').defaults({ jar: true });

const jsonFilePath = path.join(__dirname, '..', 'www', 'js', 'stopsData.json');
const rozkladyApiBase = 'http://rozklady.lodz.pl';
const headers = {
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.8,pl;q=0.6',
        'Http_Age': 108307,
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Referer': `${rozkladyApiBase}/`,
        'Connection': 'keep-alive',
        'Content-Length': 0
    };

const headOptions = {
    url: rozkladyApiBase,
    headers
};

const postOptions = {
    url: `${rozkladyApiBase}/Home/GetMapBusStopList`,
    headers
};

const parseStop = (stopArray) => {
    return {
        id: stopArray[0],
        name: stopArray[1],
        latitude: stopArray[5],
        longitude: stopArray[4]
    };
};

const handleError = (e) => console.error(e);

request.head(headOptions)
    .then(() => request.post(postOptions))
    .then((body) => {
        const stopsData = JSON.parse(body).map(parseStop);
        const stringifiedData = JSON.stringify(stopsData);
        fs.writeFile(jsonFilePath, stringifiedData, (error) => {
            if(error) {
                handleErrorr(error);
            }
            else {
                console.log(`Prefetched ${stopsData.length} stops (${stringifiedData.length} chars).`);
            }
        });
    }).catch(handleError);