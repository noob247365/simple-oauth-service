const express = require('express');

const app = express();
const port = process.env.PORT ?? 3000;
const codes = {};

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/:guid/create', (req, res) => {
    if (codes.hasOwnProperty(req.params.guid)) {
        res.json({ success: false, message: `Already present in cache: '${req.params.guid}'` });
        return;
    }
    codes[req.params.guid] = null;
    res.json({ success: true });
});
app.get('/:guid/delete', (req, res) => {
    if (!codes.hasOwnProperty(req.params.guid)) {
        res.json({ success: false, message: `Unknown ID: '${req.params.guid}'` });
        return;
    }
    delete codes[req.params.guid];
    res.json({ success: true });
});
app.get('/:guid/view', (req, res) => {
    if (!codes.hasOwnProperty(req.params.guid)) {
        res.json({ success: false, message: `Unknown ID: '${req.params.guid}'` });
        return;
    }
    res.json({ success: true, result: codes[req.params.guid] });
});

app.get('/spotify-callback', (req, res) => {
    res.json(JSON.parse(JSON.stringify(req.query)));
});

app.listen(port, () => console.log(`Listening on ${port}`));