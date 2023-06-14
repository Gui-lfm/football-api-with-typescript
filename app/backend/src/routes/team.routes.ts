import { Request, Response, Router } from 'express';
import TeamController from '../controllers/TeamController';

const teamController = new TeamController();

const router = Router();

router.get('/teams', (req: Request, res: Response) => teamController.getTeams(req, res));

export default router;
