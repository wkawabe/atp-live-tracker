const https = require('https');

// Helper to fetch keys
const fetchAPI = (path) => {
    return new Promise((resolve) => {
        const options = {
            method: 'GET',
            hostname: process.env.RAPIDAPI_HOST,
            path: path,
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Use env var
                'x-rapidapi-host': process.env.RAPIDAPI_HOST
            }
        };

        const req = https.request(options, (res) => {
            const body = [];
            res.on('data', c => body.push(c));
            res.on('end', () => {
                resolve({ status: res.statusCode, body: Buffer.concat(body).toString() });
            });
        });
        req.end();
    });
};

const date = new Date().toISOString().split('T')[0]; // 2026-02-15
const dateNoHyphen = date.replace(/-/g, ''); // 20260215
const dateDMY = '15-02-2026';
const dateDMYslashes = '15/02/2026';

async function run() {
    const paths = [
        `/api/tennis/events/${date}`,
        `/api/tennis/events/${dateNoHyphen}`,
        `/api/tennis/events/${dateDMY}`,
        `/api/tennis/matches/${date}`,
        `/api/tennis/daily/${date}`,
        '/api/tennis/calendar'
    ];

    for (const p of paths) {
        const res = await fetchAPI(p);
        console.log(`${p} -> ${res.status}`);
        if (res.status === 200) console.log("SUCCESS BODY START:", res.body.substring(0, 100));
    }
}

run();
