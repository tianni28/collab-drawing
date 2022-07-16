const express = require("express");
const WebSocket = require("ws");
const SocketServer = require("ws").Server;

const app = express();
const path = require('path');
const req = require("express/lib/request");
const server = app.listen(3000, () => {
    console.log("listening on port 3000")
})

const wss = new SocketServer({ server });
wss.on('connection', (ws) => {
    console.log('[Server] A client was connected');

    ws.on('close', () => console.log('[Server] Client disconnected'));

    ws.on('message', (message) => {

        console.log('[Server] Received message: %s', message);

        try {
            data = JSON.parse(message);
        }
        catch (e) {
            data = message
        }


        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState == WebSocket.OPEN) {

                client.send(JSON.stringify(data));
            }
        })
    })




})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, 'static')));



/*
app.listen(3000, () => {
    console.log("listening on port 3000")
})



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    console.log("asafas")
    res.render('home.ejs');
})

*/