import 'dotenv/config';
import express from 'express';
import usersRouter from './routes/users.route';
import sitesRouter from './routes/sites.route';
import linksRouter from './routes/links.route';
import categoriesRouter from './routes/categories.route';
import settingsRouter from './routes/settings.route';
import notificationsRouter from './routes/notifications.route';
import { WebSocket, WebSocketServer } from 'ws';
import { LpSocketMessage } from './interfaces/web-socket.interface';
import { Notification } from './models/Notification.model';
import { Link } from './models';

// Create express instance
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(categoriesRouter);
app.use(linksRouter);
app.use(usersRouter);
app.use(settingsRouter);
app.use(sitesRouter);
app.use(notificationsRouter);

const port = process.env['PORT'] || 3001;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port http://localhost:${port}`);
});

export const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  const connectMessage: LpSocketMessage = {
    channel: 'generic',
    message: 'connected',
    fromUserId: 0,
  };
  ws.send(JSON.stringify(connectMessage));
  Notification.setupSocket(ws);
  Link.setupSocket(ws);
  //pingSockets(ws); // for testing only
});

const pingSockets = (ws: WebSocket) => {
  setInterval(() => {
    const message: LpSocketMessage = {
      channel: 'generic',
      message: 'ping!',
      fromUserId: 0,
    };
    ws.send(JSON.stringify(message));
  }, 5000);
};
