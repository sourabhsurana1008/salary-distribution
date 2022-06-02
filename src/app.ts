import express from 'express';
import { AppRoutes } from './routes/app.routes';

const app = express();
var appRoues = new AppRoutes();
appRoues.route(app);

app.listen( 3000, () => {
    console.log( `server started at http://localhost:3000` );
} );

