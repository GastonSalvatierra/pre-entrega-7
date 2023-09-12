import express from 'express';
import handlebars from 'express-handlebars';
import MongoStore from 'connect-mongo'
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import MessageModel from './services/db/models/message.js';
import session from 'express-session';
import sessionRouter from './routes/session.router.js'
import githubLoginViewRouter from './routes/github-login.views.router.js'
import initializePassport from './config/passport.config.js';
import passport from 'passport';


//import cartsModel from './services/db/models/carts.js';



const app = express();
const PORT = 8080;


//Armado para Postman
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

// Confi de handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


const MONGO_URL = "mongodb+srv://gastonsalvatierra:admin@cluster0.w1qjysl.mongodb.net/ecommerce?retryWrites=true&w=majority";
app.use(session({
    //ttl: Time to live in seconds,
    //retries: Reintentos para que el servidor lea el archivo del storage.
    //path: Ruta a donde se buscará el archivo del session store.

    // Usando --> session-file-store
    // store: new fileStorage({ path: "./sessions", ttl: 15, retries: 0 }),


    // Usando --> connect-mongo
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        // mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 10
    }),


    secret: "coderS3cr3t",
    resave: false, //guarda en memoria
    saveUninitialized: true, //lo guarda a penas se crea
}));

//Middlewares Passport
initializePassport();
app.use(passport.initialize());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/session", sessionRouter);
app.use("/github", githubLoginViewRouter);
app.use("/", viewsRouter);



const httpServer = app.listen(PORT, () => {
    console.log("Server run on port: " + PORT);
})


const DB = async () => {
    try {

        
        await mongoose.connect('mongodb+srv://gastonsalvatierra:admin@cluster0.w1qjysl.mongodb.net/ecommerce?retryWrites=true&w=majority');
        console.log("Conectado con exito a MongoDB usando Moongose.");
        
        //const cartId = "64e9420cc6e20cfbfe0fb8e9"; 
        //const productIdToAdd = "64e7a3ad8e78e05a9b1263a0";


        //AGREGO ID AL CARRITO
        /* const cart = await cartsModel.findById(cartId);

        if (!cart) {
            console.log("El carrito no se encontró.");
            return;
        }

        const targetIndex = cart.products.findIndex(product => product._id.toString() === "64e9420cc6e20cfbfe0fb8ea");

        if (targetIndex === -1) {
            console.log("Índice de objetivo no válido.");
            return;
        }

        cart.products[targetIndex].product = [{ productId: productIdToAdd }]; */



        //ACTUALIZO LA DB
        /* let result = await cartsModel.updateOne(cart);
        console.log(result); */


        } catch (error) {
            console.error("No se pudo conectar a la BD usando Moongose: " + error);
            process.exit();
        }

};
DB();

// Instanciamos socket.io
const socketServer = new Server(httpServer);

let messages = []
// Abrimos el canal de comunicacion
socketServer.on('connection', socket => {

    socket.on('message', data => {
        messages.push(data);

        const newMessage = new MessageModel({
            user: data.user,
            message: data.message
        });
        newMessage.save();

        // enviamos un array de objetos ---> [{ user: "Juan", message: "Hola" }, { user: "Elias", message: "Como estas?" }]
        // socket.emit('messageLogs', messages) // esto no es funcional para este ejercicio

        // socket.broadcast.emit('messageLogs', messages);

        socketServer.emit('messageLogs', messages);
    })

    socket.on('userConnected', data => {
        socket.broadcast.emit('userConnected', data.user);
    })

    // socket.disconnect()
    socket.on('closeChat', data => {
        if (data.close === 'close')
            socket.disconnect();
    })

})



