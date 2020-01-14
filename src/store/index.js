import { createStore } from 'redux';
import cart from './reducers/cart';

const store = createStore(cart);

export default store;
