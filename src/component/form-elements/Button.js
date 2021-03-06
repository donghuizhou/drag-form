import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../ItemTypes'
import store from '../../redux/store';
import { updateItem, canDrop } from '../../redux/actions';

const buttonSource = {
  beginDrag (props, monitor, component) {
    store.dispatch(updateItem('Button'));
    return {
      tagName: 'Button'
    };
  }
}

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource()
  };
}


class Button extends Component {
  render () {
    const { connectDragSource } = this.props;
    return connectDragSource(
      <div className="list-item">按钮</div>
    );
  }
}

export default DragSource(ItemTypes.DRAGFORM, buttonSource, collect)(Button);