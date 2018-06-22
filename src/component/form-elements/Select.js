import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../ItemTypes';
import store from '../../redux/store';
import { updateItem } from '../../redux/actions';

const selectSource = {
  beginDrag (props, monitor, component) {
    store.dispatch(updateItem('Select'));
    return {
      tagName: 'Select'
    };
  }
}

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource()
  };
}

class Select extends Component {
  render () {
    const { connectDragSource } = this.props;
    return connectDragSource(
      <div className="list-item">选择框</div>
    );
  }
}

export default DragSource(ItemTypes.DRAGFORM, selectSource, collect)(Select);