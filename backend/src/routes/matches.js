import { Router } from 'express';
import {
  getAllMatches,
  getPopularAllMatches,
  getTodaysMatches,
  getPopularTodaysMatches,
  getLiveMatches,
  getPopularLiveMatches,
  getMatchesBySport,
  getPopularMatchesBySport,
} from '../controllers/matchesController.js';

const router = Router();

router.get('/all', getAllMatches);
router.get('/all/popular', getPopularAllMatches);
router.get('/all-today', getTodaysMatches);
router.get('/all-today/popular', getPopularTodaysMatches);
router.get('/live', getLiveMatches);
router.get('/live/popular', getPopularLiveMatches);

router.get('/:sport', getMatchesBySport);
router.get('/:sport/popular', getPopularMatchesBySport);

export default router;
