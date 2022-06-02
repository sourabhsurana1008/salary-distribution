import express from 'express';
import { AppRoutes } from './routes/app.routes';
import { config } from './config/config';

const app = express();
var appRoues = new AppRoutes();
appRoues.route(app);

const port  = config.port || 3000;
app.listen( port, () => {
    console.log( `server started at http://localhost:${port}` );
} );

