import { memo } from "react";

const Room = ({ name, socket, id, userId }) => {
    function handleJoinRoom(id) {
        socket.emit("request-join-room", id);
        socket.emit("fetch-all-msg", name);
    }
    function handleRemoveRoom(name) {
        if (window.confirm("Bạn có chắc xóa phòng này !") === true) {
            socket.emit("handle-remove-room", name);
        } else {
            return;
        }
    }
    return (
        <li className="room" onClick={() => handleJoinRoom(name)}>
            {name}{" "}
            {id === userId ? (
                <button onClick={() => handleRemoveRoom(name)}>remove</button>
            ) : (
                ""
            )}
        </li>
    );
};

export default memo(Room);
