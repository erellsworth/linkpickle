
import 'dotenv/config';
import express from 'express';
import usersRouter from './routes/users.route';
import sitesRouter from './routes/sites.route';

// Create express instance
const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(usersRouter);
app.use(sitesRouter);

const port = process.env['PORT'] || 3001
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port http://localhost:${port}`)
});
