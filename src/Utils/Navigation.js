import { Navigation as NNavigation } from "react-native-navigation";
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { SafeAreaView, StatusBar, View, BackHandler, Platform } from 'react-native';
import { store } from "../Redux/store";
import { clearStatusBarColorsFn, popStatusBarColorFn, pushStatusBarColorFn } from "../Redux/theme";

const {
    statusBarHeight,
    topBarHeight,
    bottomTabsHeight,
} = Platform.OS === 'ios' ? NNavigation.constantsSync() : {};

const client = new QueryClient();

class Navigation {
    static cuurentScreen = '';
    static stackArr = [];
    static bottomTabsID = '';
    static bottomTabsScreens = [];
    static currentTabIndex = 0;
    static screenCount = 0;

    static didAppearListener;
    static backHandler;
    static countBack = 0;

    static initialize() {
        clearStatusBarColorsFn();
        if (this.didAppearListener) {
            this.clearDidAppearListener();
        }
        if (this.backHandler) {
            this.clearBackHandler();
        }

        this.initBackHandler();
        this.initDidAppearListener();
    }

    static initDidAppearListener() {
        this.didAppearListener = NNavigation.events().registerComponentDidAppearListener(({ componentId, componentName }) => {
            console.log("COMP ID:::: ", componentId);
            if (componentId !== 'Toast') {
                this.cuurentScreen = componentId;
            }
        })
    }

    static initBackHandler() {
        this.backHandler = BackHandler;
        this.backHandler.addEventListener('hardwareBackPress', async () => {
            try {
                // await NNavigation.pop(this.stackArr[this.stackArr.length - 2]);
                console.log("STACK ARRAY:::: ", this.stackArr);
                if (this.stackArr.length - 1 <= 0) {
                    console.log("NAVIGATION: Can't pop to a non existing component index");
                    throw new Error("NAVIGATION: Can't pop to a non existing component index");
                }
                NNavigation.pop(this.stackArr[this.stackArr.length - 2]);
                this.cuurentScreen = this.stackArr[this.stackArr.length - 2];
                popStatusBarColorFn();
                this.stackArr.pop();
                console.log("STACK ARRAY AFTER POP:::: ", this.stackArr);
            }
            catch (error) {
                console.log("NAV POP ERROR:: ", error);
                if (this.countBack === 1) {
                    BackHandler.exitApp();
                }
                else if (this.countBack === 0) {
                    this.countBack += 1;
                    this.showOverlay(store.getState().lang.rtl ? 'انقر مرة أخرى للخروج من التطبيق' : 'Press back again to exit the app', 'info');
                }
                setTimeout(() => {
                    this.countBack = 0;
                }, 1500);
                return false;
            }
            return true;
        })
    }

    static clearBackHandler() {
        if (this.backHandler) {
            this.backHandler.removeEventListener();
        }
    }

    static clearDidAppearListener() {
        if (this.didAppearListener) {
            this.didAppearListener.remove();
        }
    }

    static setDefaultOptions(options) {
        NNavigation.setDefaultOptions(options);
    }

    static changeStackArrToCurrentTab(index) {
        this.stackArr[0] = this.bottomTabsScreens[index].stack.children[0].component.id;
        this.cuurentScreen = this.bottomTabsScreens[index].stack.children[0].component.id;
    }

    static setRoot(layout) {
        this.initialize();
        this.screenCount = 0;
        if (typeof layout === 'string') {
            NNavigation.setRoot({
                root: {
                    stack: {
                        children: [{
                            component: {
                                id: layout,
                                name: layout,
                            },
                        }]
                    }
                }
            });
            this.cuurentScreen = layout;
            this.stackArr = [layout];
            pushStatusBarColorFn("white");
        }
        else {
            NNavigation.setRoot({
                root: {
                    stack: {
                        children: [{
                            component: {
                                ...layout,
                                id: layout.name,
                            }
                        }]
                    }
                }
            });
            this.cuurentScreen = layout.name;
            this.stackArr = [layout.name];
            if (layout.options && layout.options.statusBar) {
                pushStatusBarColorFn(layout.options.statusBar.backgroundColor);
            }
            else {
                pushStatusBarColorFn("white");
            }
        }
    }

    static setRootWithBottomTabs(components, rtl, options) {
        /*
            components object should be like this:
            [{
                name: 'Home',
                nameAr: 'الرئيسية',
                nameEn: 'Home',
                icon: 'require(...)'
            }]
        */
        try {
            this.initialize();
            this.screenCount = 0;
            let children = [];
            (!rtl ? components : components.reverse()).map((item, index) => {
                children.push({
                    stack: {
                        children: [{
                            component: {
                                id: item.name,
                                name: item.name,
                            },
                        }],
                        options: {
                            bottomTab: {
                                text: rtl ? item.nameAr : item.nameEn,
                                icon: item.icon,
                            }
                        }
                    }
                })
            });
            NNavigation.setRoot({
                root: {
                    bottomTabs: {
                        id: 'BOTTOM_TABS',
                        children: [
                            ...children,
                        ],
                        options: {
                            ...options,
                        }
                    }
                }
            });
            NNavigation.mergeOptions('BOTTOM_TABS', {
                bottomTabs: {
                    currentTabIndex: rtl ? components.length - 1 : 0,
                }
            });
            this.bottomTabsScreens = children;
            this.currentTabIndex = rtl ? components.length - 1 : 0;
            this.cuurentScreen = rtl ? components[components.length - 1].name : components[0].name;
            this.stackArr = [rtl ? components[components.length - 1].name : components[0].name];
            this.bottomTabsID = 'BOTTOM_TABS';
            if (options && options.statusBar) {
                pushStatusBarColorFn(options.statusBar.backgroundColor);
            }
            else {
                pushStatusBarColorFn("white");
            }
        }
        catch (error) {
            console.log("Error creating bottom tabs :::: ", error);
        }
    }

    static push(layout) {
        try {
            NNavigation.dismissAllOverlays();
            if (typeof layout === 'string') {
                NNavigation.push(this.cuurentScreen, {
                    component: {
                        name: layout,
                        id: `${layout}_N${this.screenCount}`,
                    }
                });
                this.cuurentScreen = `${layout}_N${this.screenCount}`;
                this.stackArr.push(`${layout}_N${this.screenCount}`);
                pushStatusBarColorFn(store.getState().theme.statusBarColor[store.getState().theme.statusBarColor.length - 1]);
            }
            else {
                NNavigation.push(this.cuurentScreen, {
                    component: {
                        name: layout.name,
                        id: `${layout.name}_N${this.screenCount}`,
                        passProps: layout.passProps ? layout.passProps : {},
                        options: layout.options ? layout.options : {},
                    }
                });
                this.cuurentScreen = `${layout.name}_N${this.screenCount}`;
                this.stackArr.push(`${layout.name}_N${this.screenCount}`);
                if (layout.options && layout.options.statusBar) {
                    pushStatusBarColorFn(layout.options.statusBar.backgroundColor);
                }
                else {
                    pushStatusBarColorFn(store.getState().theme.statusBarColor[store.getState().theme.statusBarColor.length - 1]);
                }
            }
            this.screenCount += 1;
            console.log("STACK ARR:::: ", this.stackArr);
        }
        catch (error) {
            console.log("NAVIGATION ERROR:::: ", error);
        }
    }

    static pop() {
        try {
            console.log("STACK ARRAY:::: ", this.stackArr);
            if (this.stackArr.length - 1 <= 0) {
                console.log("NAVIGATION: Can't pop to a non existing component index");
                return;
            }
            NNavigation.dismissAllOverlays();
            NNavigation.pop(this.stackArr[this.stackArr.length - 2]);
            this.cuurentScreen = this.stackArr[this.stackArr.length - 2];
            popStatusBarColorFn();
            this.stackArr.pop();
            console.log("STACK ARRAY AFTER POP:::: ", this.stackArr);
        }
        catch (error) {
            console.log("NAVIGATION ERROR:::: ", error);
        }
    }

    static popTo(number) {
        try {
            console.log("STACK ARRAY:::: ", this.stackArr);
            let index = (this.stackArr.length - 1) - number;
            if (index < 0) {
                console.log("NAVIGATION: Can't pop to a non existing component index");
                return;
            }
            NNavigation.dismissAllOverlays();
            this.cuurentScreen = this.stackArr[index];
            NNavigation.popTo(this.stackArr[index]);
            popStatusBarColorFn(number - (this.stackArr.length - 1));
            this.stackArr.slice(0, number - (this.stackArr.length - 1));
            console.log("STACK ARRAY AFTER POP:::: ", this.stackArr);
        }
        catch (error) {
            console.log("NAVIGATION ERROR:::: ", error);
        }
    }

    static popToRoot(component) {
        try {
            NNavigation.dismissAllOverlays();
            NNavigation.popToRoot(component);
            this.cuurentScreen = component;
            console.log("STACK ARRAY POP TO ROOT:::: ", this.stackArr);
            popStatusBarColorFn(this.stackArr.length - 1);
            this.stackArr.splice(1, this.stackArr.length - 1);
            console.log("STACK ARRAY AFTER POP TO ROOT:::: ", this.stackArr);
        }
        catch (error) {
            console.log("ERROR:::: ", error);
        }
    }

    static mergeOptions(stack, options) {
        NNavigation.mergeOptions(stack, options);
    }

    static registerComponent(screenName, Screen) {
        NNavigation.registerComponent(`${screenName}`, () => props => {
            return (
                <Provider store={store}>
                    <QueryClientProvider client={client}>
                        {Platform.OS === 'ios' ? <View style={{
                            width: '100%', height: statusBarHeight,
                            backgroundColor: store.getState().theme.statusBarColor[store.getState().theme.statusBarColor.length - 1]
                        }} /> : null}
                        <SafeAreaView style={{ flex: 1 }}>
                            <Screen {...props} />
                        </SafeAreaView>
                    </QueryClientProvider>
                </Provider>
            );
        });
    }

    static showOverlay(message, type) {
        NNavigation.showOverlay({
            component: {
                name: 'Toast',
                id: 'Toast',
                passProps: {
                    message,
                    type
                },
                options: {
                    layout: {
                        componentBackgroundColor: 'transparent',
                    },
                    statusBar: {
                        backgroundColor: store.getState().theme.statusBarColor[store.getState().theme.statusBarColor.length - 1]
                    }
                }
            }
        })
    }

    static hideOverlay() {
        NNavigation.dismissAllOverlays();
    }
}

export default Navigation;