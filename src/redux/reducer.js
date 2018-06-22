import { UPDATE_ITEM, CAN_DROP } from './actions'

const initState = {
  curItem: 'init',
  canDrop: true
}

export function updateItemReducer (state = initState, action) {
  switch (action.type) {
    case UPDATE_ITEM:
      return action.payload;
    default:
      return '';
  }
}

export function canDropReducer (state = initState, action) {
  switch (action.type) {
    case CAN_DROP:
      return action.payload;
    default:
      return '';
  }
}