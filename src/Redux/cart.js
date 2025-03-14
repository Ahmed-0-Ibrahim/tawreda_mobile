import AsyncStorage from "@react-native-community/async-storage";
import { createAction, createSlice } from "@reduxjs/toolkit";
import { store } from "./store";

const cartReducer = createSlice({
    name: 'cart',
    initialState: {
        products: [],
    },
    reducers: {
        modifyCart: (state, action) => {
            state.products = [...action.payload];
        },
        clearCart: state => {
            state.products = [];
        }
    }
});

export const getCartFromStorage = async () => {
    try {
        let cartItems = await AsyncStorage.getItem('cart');
        if (cartItems) {
            store.dispatch(modifyCart(JSON.parse(cartItems)));
        }
    }
    catch(error) {
        console.log("ERROR SET GET CART ..............")

        // nothing
    }
}

export const setCartToStorage = async (cartItems) => {
    try {
        await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    }
    catch(error) {
        // nothing
    }
}

export const removeCartFromStorage = async () => {
    try {
        await AsyncStorage.removeItem('cart');
    }
    catch (error) {
        // nothing
    }
}

export const addToCartFn = (id, product, addIfNotFound = false, quantity = null) => {
    let itemFound = store.getState().cart.products.find(x => x.id === id);
    if (!itemFound) {
        let newProducts = [{ id, product, quantity: quantity || 1 }, ...store.getState().cart.products];
        store.dispatch(modifyCart(newProducts));
        setCartToStorage(newProducts);
    }
    else if (addIfNotFound) {
        let index = store.getState().cart.products.findIndex(x => x.id === id);
        let newProducts = [...store.getState().cart.products];
        newProducts[index] = { id: id, product, quantity: quantity ? quantity : newProducts[index].quantity };
        store.dispatch(modifyCart(newProducts));
        setCartToStorage(newProducts);
    }
    return itemFound;
}

export const removeFromCartFn = (id) => {
    let newProducts = [...store.getState().cart.products];
    let index = newProducts.findIndex(x => x.id === id);
    if (index !== -1) {
        newProducts.splice(index, 1);
        store.dispatch(modifyCart(newProducts));
        setCartToStorage(newProducts);
    }
}

export const { modifyCart, clearCart } = cartReducer.actions;
export default cartReducer.reducer;