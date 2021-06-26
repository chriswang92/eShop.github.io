import path from 'path';
import express from 'express'; // 'require' is common js which is traditionally what nodejs is use, on frontend we use 'import' which is es modules
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import connectedDB from './config/db.js'; // on backend nodejs file, when import another js file, the '.js' needs to be added
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

connectedDB();

const app = express();

// morgan: a logging middleware used in dev mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// express.json() is a middleware that parse json, this allows us accept json data in body
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
});

/*__dirname is not available if we use es modules, it's only availble in common js(required syntax)
So we mimic it here
*/
const __dirname = path.resolve();
// taking the uploads folder and make it static
const staticUploadFolder = express.static(path.join(__dirname, '/uploads'));
app.use('/uploads', staticUploadFolder);

// Setup for production
if (process.env.NODE_ENV === 'production') {
    // set frontend build to a static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    // any route that's not in the above routes, is going to be pointed to build/index.html
    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(__dirname, 'frontend', 'build', 'index.html')
        );
    });
} else {
    app.get('/', (req, res) => {
        // send string response to client
        res.send('API is running...');
    });
}

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
