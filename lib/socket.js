import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
            auth: {
                token,
            },
            transports: ["websocket"], // recommended
        });
    }

    return socket;
};

export const getSocket = () => socket;
