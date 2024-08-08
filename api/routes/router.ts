import { Request, Response, Router } from "express"

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.redirect(`${req.baseUrl}/health-check`);
});

router.get('/health-check', (req: Request, res: Response) => {
    res.json({ it: 'works' });
});

export default router;