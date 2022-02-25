import config from './config.js';
import express from 'express';
import busboy from 'busboy';
import fs from 'fs';
import path from 'path';

const mimeTypes = {
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/png': 'png',
};

const app = express();
app.use(express.static('public'));

app.post('/picture', function (req, res) {
  const bb = busboy({ headers: req.headers });

  bb.on('file', function(_, file, info) {
    // TODO: reject unwanted files
    const saveTo = getUploadPath(info.mimeType);
    file.pipe(fs.createWriteStream(saveTo));
  });

  bb.on('close', () => {
    res.writeHead(200, { 'Connection': 'close' });
    res.end('Upload complete.');
  });

  req.pipe(bb);

  return;
});

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
});

function getUploadPath(mimeType) {
  const fileBaseName = Date.now();
  const fileExtension = mimeTypes[mimeType];
  return path.join(config.imageUploadDirectory, `${fileBaseName}.${fileExtension}`);
}
