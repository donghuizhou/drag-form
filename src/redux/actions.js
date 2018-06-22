export const UPDATE_ITEM = 'UPDATE_ITEM';
export const CAN_DROP = 'CAN_DROP';

export function updateItem (item) {
  return {
    type: UPDATE_ITEM,
    payload: item
  }
}

export function canDrop (canDrop) {
  return {
    type: CAN_DROP,
    payload: canDrop
  }
}