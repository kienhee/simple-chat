import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import io from "socket.io-client";
import Login from "./components/Login";
import Chat from "./components/DashBoard";
function App() {
    const socket = io.connect("http://localhost:8080", {
        transports: ["websocket", "polling", "flashsocket"],
    });
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login socket={socket} />} />
                    <Route path="/chat" element={<Chat socket={socket} />} />
                </Routes>
            </BrowserRouter>
            <Outlet />
        </div>
    );
}

export default App;
