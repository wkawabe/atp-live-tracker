const https = require('https');

// Helper to fetch keys
const fetchAPI = (path) => {
    return new Promise((resolve) => {
        const options = {
            method: 'GET',
            hostname: process.env.RAPIDAPI_HOST,
            path: path,
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': process.env.RAPIDAPI_HOST
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                resolve({ status: res.statusCode, body });
            });
        });
        req.end();
    });
};

async function run() {
    console.log("Checking Live Endpoint for 'notstarted' events...");
    const liveRes = await fetchAPI('/api/tennis/events/live');
    if (liveRes.status === 200) {
        try {
            const data = JSON.parse(liveRes.body);
            const events = data.events || [];
            const statuses = new Set(events.map(e => e.status.type));
            console.log("Live Endpoint Statuses found:", Array.from(statuses));

            const notStarted = events.filter(e => e.status.type === 'notstarted');
            console.log(`Found ${notStarted.length} 'notstarted' events in Live endpoint.`);
        } catch (e) {
            console.log("Error parsing live body", e);
        }
    } else {
        console.log("Live endpoint failed:", liveRes.status);
    }

    console.log("\nChecking other schedule paths...");
    const paths = [
        '/api/tennis/matches/today',
        '/api/tennis/fixtures',
        '/api/tennis/events/next',
        '/api/tennis/matches' // maybe list all?
    ];

    for (const p of paths) {
        const res = await fetchAPI(p);
        console.log(`${p} -> ${res.status}`);
    }
}

run();
