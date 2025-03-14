import { closeChatSocket, initChatSokcet } from "./chatSocket";
import { closeUtilsSocket, initUtilsSokcet } from "./utilsSocket"

export const startSocket = () => {
    initUtilsSokcet();
    initChatSokcet();
}

export const closeSocket = () => {
    closeUtilsSocket();
    closeChatSocket();
}