import { useEffect, useState } from "react";
import { Navigation as NNavigation } from "react-native-navigation";
import Navigation from "../Utils/Navigation";

export function useTabIndex(index) {
    const [currentTabIndex, setCurrentTabIndex] = useState(index);

    useEffect(() => {
        const registerCommandEventListener = NNavigation.events().registerCommandListener((name, params) => {
            if (params.options && params.options.bottomTabs) {
                console.log("REGISTERED TAB:::: ", params.options.bottomTabs.currentTabIndex)
                setCurrentTabIndex(params.options.bottomTabs.currentTabIndex);
                Navigation.changeStackArrToCurrentTab(params.options.bottomTabs.currentTabIndex);
            }
        });

        return () => {
            registerCommandEventListener.remove();
        }
    });

    return currentTabIndex;
}