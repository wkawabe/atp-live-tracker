const https = require('https');

const options = {
    method: 'GET',
    hostname: process.env.RAPIDAPI_HOST, // 'tennisapi1.p.rapidapi.com'
    port: null,
    path: '/api/tennis/rankings/atp',
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
