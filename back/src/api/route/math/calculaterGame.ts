import express from 'express';
import { createQuestion } from '../../controller/math/calculaterGameController';

const router = express.Router();

// GETリクエスト
router.get('/', createQuestion);

export default router;