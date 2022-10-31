import { useRef } from "react";
import { useEffect } from "react";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
const Message = ({ socket, userId }) => {
    ////////////////////////////
    const navigate = useNavigate();
    const [heading, setHeading] = useState("");
    const [txtMessage, setTxtMessage] = useState("");
    const [messageRoom, setMessageRoom] = useState([]);
    const txtRef = useRef();
    const [userEnter, setUserEnter] = useState(false);
    const [userName, setUserName] = useState("");
    // const [roomMember, setRoomMember] = useState([]);
    ////////////////////////////////////

    function sendMessageRoom() {
        const data = {
            room: heading,
            message: txtMessage,
        };
        socket.emit("chat-room", data);
        setTxtMessage("");
        txtRef.current.focus();
    }

    function changeHandler(e) {
        setTxtMessage(e.target.value);
        socket.emit("user-change-input", true);
    }
    const blurHandler = () => {
        socket.emit("user-change-input", false);
    };

    ///////////////////////////////////
    useEffect(() => {
        ///
        socket.on("fetch-txt-mess-room", (data) => {
            setMessageRoom(data);
        });
        //////
        socket.on("join-room-success", (data) => {
            setHeading(data);
            setMessageRoom([]);
        });
        socket.on("hanlder-change", (data) => {
            setUserEnter(data.status);
            setUserName(data.userName);
        });
        return () => {
            socket.off("fetch-txt-mess-global");
            socket.off("fetch-txt-mess-room");
            socket.off("join-room-success");
            socket.off("hanlder-change");
        };
    }, [socket]);
    useEffect(() => {
        window.addEventListener("load", () => {
            navigate("/");
        });
    }, [navigate]);
    //////////////////////////////
    return (
        <div className="message">
            <div>
                <h1 className="message-bar">{heading}</h1>
                <div className="message-box">
                    {messageRoom?.map((mess) => (
                        <div
                            className={`mess ${
                                mess.userId === userId ? "you" : "other"
                            }`}
                            key={mess.id}
                        >
                            {mess.name} : {mess.txt}
                        </div>
                    ))}
                </div>
            </div>
            <div className="message-chat">
                {" "}
                <p className={`${userEnter ? "u-block" : "u-none"}`}>
                    {userName} đang chat...
                </p>
                <input
                    ref={txtRef}
                    type="text"
                    placeholder="Chat..."
                    value={txtMessage}
                    onChange={(e) => changeHandler(e)}
                    onBlur={blurHandler}
                />{" "}
                <button onClick={sendMessageRoom}>Gửi</button>
            </div>
        </div>
    );
};

export default memo(Message);
