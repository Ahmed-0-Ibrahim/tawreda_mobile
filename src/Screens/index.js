import Navigation from "../Utils/Navigation";

import Home from "./Tabs/Home/Home";
import Cart from "./Cart/Cart";
import Orders from './Tabs/Orders/Orders';
import Profile from "./Tabs/Profile/Profile";
import { Intro } from "./Intro/Intro";
import { Login } from "./Login/Login";
import { ForgetPassword } from "./ForgetPassword/ForgetPassword";
import { Toast } from "../Components/Toast";
import ProductDetails from "./Rating/ProductDetails";
import OrderDetails from "./OrderDetails/OrderDetails";
import { Wallet } from "./Wallet/Wallet";
import Pay from "./Payment/Pay";
import { ConfirmOrder } from "./ConfirmOrder/ConfirmOrder";
import CommonQuestion from "./CommonQuestion/CommonQuestion";
import CommonAnswers from "./CommonQuestion/CommonAnswers";
import Rating from "./Rating/Rating";
import Terms from "./Terms/Terms";
import Notifications from "./Notification/Notification"
import Support from "./Support/Support";
import { ChangePassword } from "./ChangePassword/ChangePassword";
import { ContactUs } from "./ContactUs/ContactUs";
import { AboutUs } from "./AboutUs/AboutUs";
import { Search } from "./Search/Search";
import Chat from "./Chat/Chat";
import { SignUp } from "./SignUp/SignUp";
import { ActivePhone } from "./ActivePhone/ActivePhone";
import Categories from "./Categories/Categories";
import Favourit from "./Tabs/Favourit/Favourit";
import { Section } from "./Section/Section";
import MyShop from "./MyShop/MyShop";
import Brands from "./Brands/Brands";
import { NewProducts } from "./NewProducts/NewProducts";
import { MostWanted } from "./MostOrder/MostOrder";
import { BrandSection } from "./BrandSection/BrandSection";
import StoreOrder from "./StoreOrder/StoreOrder";
import {EditeProfile} from './EditProfile/EditProfile';
import { AddAdress } from "./AddAdress/AddAdress";
import {PaymentVisa} from "./PaymentVisa/PaymentVisa"
import { CharageWallet } from "./CharageWallet/CharageWallet";
export const registerScreens = () => {
    Navigation.registerComponent('Home', Home);
    Navigation.registerComponent('Cart', Cart);
    Navigation.registerComponent('Orders', Orders);
    Navigation.registerComponent('Profile', Profile);
    Navigation.registerComponent('Intro', Intro);
    Navigation.registerComponent('Login', Login);
    Navigation.registerComponent('SignUp', SignUp);
    Navigation.registerComponent('ForgetPassword', ForgetPassword);
    Navigation.registerComponent('ActivePhone', ActivePhone);
    Navigation.registerComponent('Categories',Categories);
    Navigation.registerComponent('Favourit',Favourit);
    Navigation.registerComponent('Section',Section);
    Navigation.registerComponent('MyShop',MyShop);
    Navigation.registerComponent('Brands',Brands);
    Navigation.registerComponent('NewProducts',NewProducts);
    Navigation.registerComponent('MostWanted',MostWanted);
    Navigation.registerComponent('BrandSection',BrandSection);
    Navigation.registerComponent('StoreOrder',StoreOrder);
    Navigation.registerComponent('AddAdress',AddAdress);
    
    //Order Details
    Navigation.registerComponent('OrderDetails', OrderDetails);
    //ProductDetails
    Navigation.registerComponent('ProductDetails', ProductDetails);
    Navigation.registerComponent('ConfirmOrder',ConfirmOrder);

    Navigation.registerComponent('Wallet', Wallet);
    // register Toast screen
    Navigation.registerComponent('Toast', Toast);
    Navigation.registerComponent('Pay', Pay);
    Navigation.registerComponent('CommonQuestion', CommonQuestion);

    Navigation.registerComponent('CommonAnswers', CommonAnswers);

    Navigation.registerComponent('Rating', Rating);

    Navigation.registerComponent('Terms', Terms)
    Navigation.registerComponent('Notifications',Notifications)
    Navigation.registerComponent('Support',Support)
    Navigation.registerComponent('ChangePassword', ChangePassword);
    Navigation.registerComponent('ContactUs', ContactUs);
    Navigation.registerComponent('AboutUs', AboutUs);
    Navigation.registerComponent('Search', Search);
    Navigation.registerComponent('Chat', Chat);

    Navigation.registerComponent('EditeProfile',EditeProfile);
    Navigation.registerComponent('PaymentVisa',PaymentVisa);
    Navigation.registerComponent('CharageWallet',CharageWallet);
    
}