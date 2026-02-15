const https = require('https');

const date = new Date().toISOString().split('T')[0];
const day = new Date().getDate();
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();
const formattedDateDMY = `${day}-${month}-${year}`; // 15-2-2026

const pathsToTry = [
    `/api/tennis/events/${formattedDateDMY}`,
    `/api/tennis/schedule/${date}`,
    `/api/tennis/matches/${date}`,
    `/api/tennis/events?date=${date}`,
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
                    // console.log(body.substring(0, 200));
                    resolve(true);
                } else {
                    console.log(`FAILED: ${path} - ${body.substring(0, 100)}`);
                    resolve(false);
                }
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
