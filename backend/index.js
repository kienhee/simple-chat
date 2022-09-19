const express = require("express");
const http = require("http");
const app = express();
const PORT = 8080;
const server = http.createServer(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});
let users = [];
let rooms = [
    {
        author: "Kênh thế giới ",
        name: "Kênh thế giới 🌎",
        message: [],
    },
];

app.get("/", (req, res) => {
    res.send("Hello World");
});

io.on("connection", (socket) => {
    console.log("New client connected" + socket.id);

    socket.on("userLogin", (userName) => {
        let user = {
            id: socket.id,
            name: userName,
        };
        users.push(user);
        socket.userName = userName;
    });
    socket.on("fetch-users", () => {
        let infoUser = {
            userId: socket.id,
            userName: socket.userName,
        };
        socket.emit("info-user", infoUser);
        io.sockets.emit("get-all-users", users);
    });

    socket.on("create-room", (room) => {
        if (rooms.includes(room)) {
            socket.emit("error-create-room");
        } else {
            let objRoom = {
                author: socket.id,
                name: room,
                message: [],
            };
            rooms.push(objRoom);

            socket.join(room);
            io.sockets.emit("get-all-rooms", rooms);
        }
    });
    socket.on("chat-global", (data) => {
        let msg = {
            id: uuidv4(),
            userId: socket.id,
            name: socket.userName,
            txt: data,
        };

        io.sockets.emit("fetch-txt-mess-global", msg);
    });
    socket.on("request-join-room", (idRoom) => {
        socket.join(idRoom);
        socket.emit("join-room-success", idRoom);
    });

    socket.on("fetch-all-rooms", () => {
        io.sockets.emit("get-all-rooms", rooms);
    });

    socket.on("handle-remove-room", (roomName) => {
        let indexRoom = rooms.findIndex((r) => r.name === roomName);
        rooms.splice(indexRoom, 1);
        io.sockets.emit("get-all-rooms", rooms);
    });
    socket.on("chat-room", (data) => {
        let indexRoom = rooms.findIndex((i) => i.name === data.room);
        let msg = {
            id: uuidv4(),
            userId: socket.id,
            name: socket.userName,
            txt: data.message,
        };
        rooms[indexRoom]?.message.push(msg);

        io.sockets
            .in(data.room)
            .emit("fetch-txt-mess-room", rooms[indexRoom]?.message);
    });
    socket.on("fetch-all-msg", (roomName) => {
        let indexRoom = rooms.findIndex((i) => i.name === roomName);
        io.sockets
            .in(roomName)
            .emit("fetch-txt-mess-room", rooms[indexRoom]?.message);
    });
    ////////////////////////
    socket.on("user-change-input", (data) => {
        const dataNew = {
            userName: socket.userName,
            status: data,
        };
        if (data) {
            socket.broadcast.emit("hanlder-change", dataNew);
        } else {
            socket.broadcast.emit("hanlder-change", dataNew);
        }
    });
    /////////////////////////
    socket.on("disconnect", () => {
        console.log(socket.id, "disconnect");
        let i = users.findIndex((i) => i.id === socket.id);
        users.splice(i, 1);
        socket.broadcast.emit("get-all-users", users);

        let newRooms = rooms.filter((r) => r.author !== socket.id);
        rooms = newRooms;
        io.sockets.emit("get-all-rooms", rooms);
    });
});

server.listen(PORT, () => {
    console.log("Server đang chay tren cong 8080");
});
