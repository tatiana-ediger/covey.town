import { Express } from 'express';
import BodyParser from 'body-parser';
import io from 'socket.io';
import { Server } from 'http';
import { StatusCodes } from 'http-status-codes';
import {
    saveUserHandler,
    getUserHandler,
    deleteUserHandler
} from '../requestHandlers/AccountRequestHandlers';
import { logError } from '../../../roomService/Utils';

export default function addAccountRoutes(http: Server, app: Express): io.Server {
    /*
     * Create or update a user for Covey.Town
     */
    app.post('/user', BodyParser.json(), async (req, res) => {
      try {
        const result = await saveUserHandler({
          userEmail: req.body.userEmail,
          userName: req.body.userName,
          useAudio: req.body.useAudio,
          useVideo: req.body.useVideo
        });
        res.status(StatusCodes.OK)
          .json(result);
      } catch (err) {
        logError(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({
            message: 'Internal server error, please see account server for more details',
          });
      }
    });

    /**
     * Get a user's setting preferences from Covey.Town
     */
    app.get('/user', BodyParser.json(), async (req, res) => {
        try {
          const result = await getUserHandler({
            userEmail: req.body.userName,
          });
          res.status(StatusCodes.OK)
            .json(result);
        } catch (err) {
          logError(err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
              message: 'Internal server error, please see account server for more details',
            });
        }
      });

    /*
     * Delete a user from Covey.Town
     */
    app.delete('/user', BodyParser.json(), async (req, res) => {
        try {
          const result = await deleteUserHandler({
            userEmail: req.body.userName,
          });
          res.status(StatusCodes.OK)
            .json(result);
        } catch (err) {
          logError(err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
              message: 'Internal server error, please see account server for more details',
            });
        }
      });

    const socketServer = new io.Server(http, { cors: { origin: '*' } });
    return socketServer;
}