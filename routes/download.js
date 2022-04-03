const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid/:ext', async (req, res) => {
  // Extract link and get file from storage send download stream
  const file = await File.findOne({ uuid: req.params.uuid });
  // Link expired
  if (!file) {
    return res.status(404).json({ error: 'Link has been expired or invalid.' });
  }
  const response = await file.save();
  const filePath = `${__dirname}/../${file.path}`;
  res.download(filePath, `file-sher-${req.params.uuid}.${req.params.ext}`, () => {
    console.log("file downloaded");
  });
});

module.exports = router;
