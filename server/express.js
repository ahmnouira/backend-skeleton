/*** configure express midlewares  ***/
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import Template from '../template';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.use('/', (req, res) => {
    res.status(200).send(Template());
});

export default app; 