import express from 'express'; // 'require' is common js which is traditionally what nodejs is use, on frontend we use 'import' which is es modules
import dotenv from 'dotenv';
import colors from 'colors';
import connectedDB from './config/db.js'; // on backend nodejs file, when import another js file, the '.js' needs to be added
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

connectedDB();

const app = express();

// express.json() is a middleware that parse json, this allows us accept json data in body
app.use(express.json());

app.get('/', (req, res) => {
    // send string response to client
    res.send('API is running23...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
});

// use custom middlewares https://expressjs.com/en/guide/using-middleware.html
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
            .bold
    )
);
