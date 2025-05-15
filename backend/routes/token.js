// routes/token.js
const express = require('express');
const router = express.Router();
const { StreamVideoServerClient } = require('@stream-io/video-node');

const apiKey = 'qy9c2x5ggknp';
const apiSecret = 's3av4rwke3d568e6xd4vsvz4y5ecgv22egm3ytn55q4jyv8cr87aky3xcqwxe9qa';

const videoClient = new StreamVideoServerClient({ apiKey, apiSecret });

router.post('/', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Falta userId' });

  const token = videoClient.createToken(userId);
  res.json({ token });
});

module.exports = router;
