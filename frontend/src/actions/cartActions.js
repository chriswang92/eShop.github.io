import axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constants/cartConstants';

/** getState() returns the entire state tree */
export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`);
    const { _id, name, image, price, countInStock } = data;
    dispatch({
        type: CART_ADD_ITEM,
        payload: { product: _id, name, image, price, countInStock, qty }
    });

    // save the cartItems in localStorage, so it persist between refreshs and close-reopen browser
    localStorage.setItem(
        'cartItems',
        // only save strings in localStorage
        JSON.stringify(getState().cart.cartItems)
    );
};

export const removeFromCart = id => (dispatch, getState) => {
    dispatch({ type: CART_REMOVE_ITEM, payload: id });
    localStorage.setItem(
        'cartItems',
        JSON.stringify(getState().cart.cartItems)
    );
};
