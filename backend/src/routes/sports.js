import { Router } from 'express';
import {
  getSports,
  getSportById,
  getSportLeagues,
  getSportTeams,
} from '../controllers/sportsController.js';

const router = Router();

router.get('/', getSports);
router.get('/:id', getSportById);
router.get('/:id/leagues', getSportLeagues);
router.get('/:id/teams', getSportTeams);

export default router;
