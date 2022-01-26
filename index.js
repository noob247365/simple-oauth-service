const express = require('express');

const app = express();
const port = process.env.PORT ?? 3000;
const codes = {};

app.get('/', (req, res) => res.send('Hello World!'));
app.get(`/:guid`, (req, res) => {
    if (!codes.hasOwnProperty(req.params.guid)) {
        res.json({ success: false, message: `Unknown ID: '${req.params.guid}'` });
        return;
    }
    res.json({ success: true, result: codes[req.params.guid] });
});
app.get('/:guid/create', (req, res) => {
    if (codes.hasOwnProperty(req.params.guid)) {
        res.json({ success: false, message: `Already present in cache: '${req.params.guid}'` });
        return;
    }
    codes[req.params.guid] = null;
    res.json({ success: true });
});
app.get('/:guid/callback', (req, res) => {
    if (!codes.hasOwnProperty(req.params.guid)) {
        res.json({ success: false, message: `Unknown ID: '${req.params.guid}'\n\nQuery:\n${JSON.stringify(req.query, null, '  ')}` });
        return;
    }
    codes[req.params.guid] = JSON.parse(JSON.stringify(req.query));
    res.json({ success: true });
});
app.get(`/:guid/delete`, (req, res) => {
    if (!codes.hasOwnProperty(req.params.guid)) {
        res.json({ success: false, message: `Unknown ID: '${req.params.guid}'` });
        return;
    }
    delete codes[req.params.guid];
    res.json({ success: true });
});

app.listen(port, () => console.log(`Listening on ${port}`));