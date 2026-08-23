import { Router } from 'express';
import {
  getAllImages,
  getBadgeImage,
  getPosterImage,
  getProxyImage,
} from '../controllers/imagesController.js';

const router = Router();

router.get('/', getAllImages);
router.get('/badge/:id.webp', getBadgeImage);
router.get('/poster/:badge1/:badge2.webp', getPosterImage);
router.get('/proxy/:poster.webp', getProxyImage);

export default router;
