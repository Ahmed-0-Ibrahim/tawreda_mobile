import io from 'socket.io-client';
import { API_ENDPOINT, API_SOCKET } from '../../configs';
import { logoutFn, setCompany, setNotifCount, setUser, updateUser } from '../../Redux/auth';
import { refresh } from '../../Redux/list';
import { store } from '../../Redux/store';

let utilsSocket = null;

export const initUtilsSokcet = () => {
    // console.log("IS INITIALIZING::::::: ", store.getState().auth.token);
    utilsSocket = io(`${API_SOCKET}/utils`, {
        query: store.getState().auth.token ? { id: store.getState().auth.user.id } : {},
        transports: ['websocket'],
        // allowEIO3: true
    });

    utilsSocket.on('connect', () => {
        console.log(" :::Utils socket is connected successfully::: ");
    });

    utilsSocket.on("connect_error", (error) => {
        // console.log("CONNECTION ERROR WITH SOCKET::::::: ", error)
    });

    utilsSocket.on('NewUser', data => {
        // console.log("NEW USER SOCKET::: ", data);
        store.dispatch(updateUser(data));
    });

    utilsSocket.on('Company', data => {
        console.log("COMPANY SOCKET:::: ", data.company);
        store.dispatch(setCompany(data.company));
    });

    utilsSocket.on('NotificationsCount', data => {
        // console.log("NTIF COUNT:::: ", data);
        store.dispatch(setNotifCount(data.count));
    });

    utilsSocket.on('ChangeOrderStatus', data => {
        store.dispatch(refresh('orderList'));
    });

    utilsSocket.on('LogOut', data => {
        logoutFn();
    });
}

export const closeUtilsSocket = () => {
    if (utilsSocket) {
        utilsSocket.disconnect();
    }
}