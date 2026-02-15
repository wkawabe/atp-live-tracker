const https = require('https');

const pathsToTry = [
    '/api/tennis/events/today',
    '/api/tennis/events/tomorrow',
    '/api/tennis/events/finished',
    '/api/tennis/matches/live', // maybe?
    '/api/tennis/tournaments', // maybe fetch tournament then matches?
];

function checkPath(path) {
    return new Promise((resolve) => {
        const options = {
            method: 'GET',
            hostname: process.env.RAPIDAPI_HOST,
            port: null,
            path: path,
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': process.env.RAPIDAPI_HOST
            }
        };

        const req = https.request(options, function (res) {
            console.log(`Checking ${path}: Status ${res.statusCode}`);
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`SUCCESS: ${path}`);
                } else {
                    // console.log(body);
                }
                resolve(true);
            });
        });
        req.end();
    });
}

async function run() {
    for (const path of pathsToTry) {
        await checkPath(path);
    }
}

run();
