import config from './config.js';
import express from 'express';
import busboy from 'busboy';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.post('/picture', function (req, res) {
  const bb = busboy({ headers: req.headers });

  bb.on('file', function(name, file, info) {
    const { filename, encoding, mimeType } = info;
    // TODO: use unique name
    // TODO: infer file extension from mime type
    // TODO: reject unwanted files
    const saveTo = path.join(config.imageUploadDirectory, 'test.jpg');
    file.pipe(fs.createWriteStream(saveTo));
  });

  bb.on('close', () => {
    res.writeHead(200, { 'Connection': 'close' });
    res.end('Upload complete.');
  });

  req.pipe(bb);

  return;
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
