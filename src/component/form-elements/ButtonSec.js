import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../ItemTypes'

const buttonSecSource = {
  beginDrag (props, monitor, component) {
    return {
      tagName: 'ButtonSec'
    };
  }
};

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource()
  };
}

class ButtonSec extends Component {
  render () {
    const  { connectDragSource } = this.props;
    return connectDragSource(
      <div className="list-item">按钮区域</div>
    );
  }
}

export default DragSource(ItemTypes.DRAGFORM, buttonSecSource, collect)(ButtonSec);