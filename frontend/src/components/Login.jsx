import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
const Login = ({ socket }) => {
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();
    function handleLogin() {
        if (!userName) {
            alert("Vui lòng nhập tên của bạn!");
        } else {
            socket.emit("userLogin", userName);
            navigate("/chat");
        }
    }
    return (
        <div className="login">
            <h1>Who are you ?</h1>
            <input
                type="text"
                placeholder="Enter Your Name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default memo(Login);
