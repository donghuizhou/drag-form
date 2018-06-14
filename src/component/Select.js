import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from './ItemTypes'

const selectSource = {
  beginDrag (props, monitor, component) {
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

export default DragSource(ItemTypes.FORMELEMENT, selectSource, collect)(Select);