import express from 'express';
import calculaterGame from './calculaterGame';

const router = express.Router();

// v1以下のルーティング
router.use('/calculater-game', calculaterGame);

export default router;