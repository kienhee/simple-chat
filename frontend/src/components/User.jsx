import { memo, useState } from "react";

const User = ({ name, id, socket }) => {
    function openChat(id) {
        socket.emit("chat-single", id);
    }
    return <li onClick={() => openChat(id)}>{name}</li>;
};

export default memo(User);
