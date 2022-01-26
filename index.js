const express = require('express');

const app = express();
const port = process.env.PORT ?? 3000;
const codes = {};

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/key/create/:guid', (req, res) => {
    if (codes.hasOwnProperty(req.params.guid)) {
        res.json({ success: false, message: `Already present in cache: '${req.params.guid}'` });
        return;
    }
    if (req.params.guid.length < 10) {
        res.json({ success: false, message: `Must provide an ID with at least 10 characters` });
        return;
    }
    codes[req.params.guid] = null;
    res.json({ success: true });
});
app.get('/key/delete/all12345', (req, res) => {
    for (let key of Object.keys(codes))
        delete codes[key];
    res.json({ success: true });
});
app.get('/key/delete/:guid', (req, res) => {
    if (!codes.hasOwnProperty(req.params.guid)) {
        res.json({ success: false, message: `Unknown ID: '${req.params.guid}'` });
        return;
    }
    delete codes[req.params.guid];
    res.json({ success: true });
});
app.get('/key/view/all12345', (req, res) => {
    res.json({ success: true, result: codes });
});
app.get('/key/view/:guid', (req, res) => {
    if (!codes.hasOwnProperty(req.params.guid)) {
        res.json({ success: false, message: `Unknown ID: '${req.params.guid}'` });
        return;
    }
    res.json({ success: true, result: codes[req.params.guid] });
});

app.get('/spotify/callback', (req, res) => {
    if (!req.query.state || !codes.hasOwnProperty(req.query.state)) {
        res.send(`Error: Unknown ID: '${req.query.state}'`);
        return;
    }
    codes[req.query.state] = JSON.parse(JSON.stringify(req.query));
    res.redirect('/spotify/redirect');
});
app.get('/spotify/redirect', (req, res) => {
    res.send('You may close this tab and return to the application');
});

app.listen(port, () => console.log(`Listening on ${port}`));