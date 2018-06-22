import { combineReducers } from 'redux';
import { updateItemReducer, canDropReducer } from './reducer'

const allReducers = {
  curItem: updateItemReducer,
  canDrop: canDropReducer
};

const rootReducer = combineReducers(allReducers);

export default rootReducer;
