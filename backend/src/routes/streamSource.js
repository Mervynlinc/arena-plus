import { Router } from 'express';
import { getStreamBySource } from '../controllers/streamsController.js';

const router = Router();

router.get('/:source/:id', getStreamBySource);

export default router;
