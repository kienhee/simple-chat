import { useEffect, useState, memo } from "react";
import Message from "./Chat";
import Room from "./Room";
import User from "./User";
const Chat = ({ socket }) => {
    //////////////////////////////////////////////
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUSer] = useState("User");
    const [userId, setUserId] = useState("");
    const [roomName, setRoomName] = useState("");
    const [listRooms, setListRooms] = useState([]);
    /////////////////////////////////////////////
   
    function createRoom() {
        if (roomName) {
            socket.emit("create-room", roomName);
            setRoomName("");
        } else {
            alert("Vui lòng nhập tên phòng muốn tạo");
        }
    }
    ///////////////////////////////////
    useEffect(() => {
        socket.emit("fetch-users");
        socket.emit("fetch-all-rooms");
        socket.on("info-user", (infoUser) => {
            setCurrentUSer(infoUser.userName);
            setUserId(infoUser.userId);
        });
        socket.on("get-all-users", (data) => {
            setUsers(data);
        });
        socket.on("get-all-rooms", (data) => {
            setListRooms(data);
        });
        socket.on("error-create-room", () => {
            alert("Tên phòng đã tồn tại");
        });
        return () => {
            socket.off("get-all-users");
            socket.off("get-all-rooms");
            socket.off("info-user");
            socket.off("error-create-room");
        };
    }, [socket]);

    return (
        <div className="chat">
            <div className="users">
                <div className="users-bar">
                    <h1>Xin chào, {currentUser}</h1>
                    <button>
                        <a href="/">logout</a>
                    </button>
                </div>
                <div className="list-users-online">
                    <b className="chat-title">Danh sách người dùng online</b>
                    <ul>
                        {users?.map((user) => (
                            <User
                                key={user.id}
                                name={user.name}
                                id={user.id}
                                socket={socket}
                            />
                        ))}
                    </ul>
                </div>
                <div className="list-rooms">
                    <b className="chat-title">Danh sách các nhóm</b>
                    <input
                        type="text"
                        placeholder="Nhập tên phòng"
                        style={{ marginRight: "10px" }}
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                    <button onClick={createRoom}>Tạo phòng chat</button>
                    <br />
                    {listRooms.length > 0 ? (
                        <ul>
                            {listRooms?.map((room, index) => (
                                <Room
                                    key={index}
                                    name={room.name}
                                    socket={socket}
                                    id={room.author}
                                    userId={userId}
                                />
                            ))}
                        </ul>
                    ) : (
                        <strong>Không có nhóm nào</strong>
                    )}
                </div>
            </div>
            <Message socket={socket} userId={userId} />
        </div>
    );
};

export default memo(Chat);
