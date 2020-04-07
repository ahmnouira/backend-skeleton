import app from './express';
import config from '../config/config';
import mongoose from 'mongoose';

// configure it to use native ES6 promises 
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', () => {
      throw new Error(`unable to connect to database:${config.mongoUri}`);
});



app.listen(config.port, () => {
      console.log(`\n *** Server running at http://localhost:${config.port} *** \n`);
});

