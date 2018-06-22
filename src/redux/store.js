import { createStore } from 'redux';
import rootReducer from './index';

let store = createStore(rootReducer);

export default store;