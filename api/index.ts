
import 'dotenv/config';
import express from 'express';
import usersRouter from './routes/users.route';
import sitesRouter from './routes/sites.route';
import linksRouter from './routes/links.route';
import categoriesRouter from './routes/categories.route';
import settingsRouter from './routes/settings.route';

// Create express instance
const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(categoriesRouter);
app.use(linksRouter);
app.use(usersRouter);
app.use(settingsRouter);
app.use(sitesRouter);

const port = process.env['PORT'] || 3001
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port http://localhost:${port}`)
});
