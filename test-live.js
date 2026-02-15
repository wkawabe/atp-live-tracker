const https = require('https');

const options = {
    method: 'GET',
    hostname: process.env.RAPIDAPI_HOST,
    port: null,
    path: '/api/tennis/events/live', // Checking documentation or guessing based on common paths. 
    // Let's try /api/tennis/events/live which is common for this API provider judging by the rankings path style.
    // Wait, I need to be sure about the endpoint. 
    // The search results mentioned "TennisApi" on RapidAPI. 
    // Let's assume the path is /api/tennis/events/live based on typical patterns, 
    // but if it fails I'll need to check the docs or try another one.
    // Actually, let's try a safer bet. The previous search had `/api/tennis/rankings/atp`.
    // Likely it is `/api/tennis/events/live`.
    headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST
    }
};

const req = https.request(options, function (res) {
    const chunks = [];

    res.on('data', function (chunk) {
        chunks.push(chunk);
    });

    res.on('end', function () {
        const body = Buffer.concat(chunks);
        console.log(body.toString());
    });
});

req.end();
