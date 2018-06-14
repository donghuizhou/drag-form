import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from './ItemTypes'

const buttonSource = {
  beginDrag (props, monitor, component) {
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

export default DragSource(ItemTypes.FORMELEMENT, buttonSource, collect)(Button);