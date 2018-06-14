import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from './ItemTypes'

const searchSecSource = {
  beginDrag (props, monitor, component) {
    return {
      tagName: 'SearchSec'
    };
  }
};

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource()
  };
}

class SearchSec extends Component {
  render () {
    const  { connectDragSource } = this.props;
    return connectDragSource(
      <div className="list-item">搜索区域</div>
    );
  }
}

export default DragSource(ItemTypes.FORMELEMENT, searchSecSource, collect)(SearchSec);