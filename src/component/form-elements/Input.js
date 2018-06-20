import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../ItemTypes'

const inputSource = {
  beginDrag (props, monitor, component) {
    return {
      tagName: 'Input'
    };
  }
};

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource()
  };
}

class Input extends Component {
  render () {
    const  { connectDragSource } = this.props;
    return connectDragSource(
      <div className="list-item">输入框</div>
    );
  }
}

export default DragSource(ItemTypes.DRAGFORM, inputSource, collect)(Input);