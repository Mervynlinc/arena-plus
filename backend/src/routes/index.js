import { Router } from 'express';
import sportsRoutes from './sports.js';
import streamSourceRoutes from './streamSource.js';
import imagesRoutes from './images.js';
import matchesRoutes from './matches.js';
import healthRoutes from './health.js';
import usersRoutes from './users.js';


export const router = Router();

router.use('/health', healthRoutes);
router.use('/sports', sportsRoutes);
router.use('/stream', streamSourceRoutes);
router.use('/images', imagesRoutes);
router.use('/matches', matchesRoutes);
router.use('/users', usersRoutes);
