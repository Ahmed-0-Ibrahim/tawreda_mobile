import io from 'socket.io-client';
import { API_ENDPOINT, API_SOCKET } from '../../configs';
import { logoutFn, setCompany, setNotifCount, setUser, updateUser } from '../../Redux/auth';
import { refresh } from '../../Redux/list';
import { store } from '../../Redux/store';

let chatSocket = null;

export const initChatSokcet = () => {
    // console.log("IS INITIALIZING::::::: ", store.getState().auth.token);
    chatSocket = io(`${API_SOCKET}/chat`, {
        query: store.getState().auth.token ? { id: store.getState().auth.user.id } : {},
        transports: ['websocket'],
        // allowEIO3: true
    });

    chatSocket.on('connect', () => {
        console.log(" :::Utils socket is connected successfully::: ");
    });

    chatSocket.on("connect_error", (error) => {
        // console.log("CONNECTION ERROR WITH SOCKET::::::: ", error)
    });

    chatSocket.on('NewMessage', data => {
        store.dispatch(refresh('chatList'));
        store.dispatch(refresh('chatItem'));
    })
}

export const closeChatSocket = () => {
    if (chatSocket) {
        chatSocket.disconnect();
    }
}