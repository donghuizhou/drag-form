import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../ItemTypes';
import store from '../../redux/store';
import { updateItem } from '../../redux/actions';

const tableSecSource = {
  beginDrag (props, monitor, component) {
    store.dispatch(updateItem('TableSec'));
    return {
      tagName: 'TableSec'
    };
  }
};

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource()
  };
}

class TableSec extends Component {
  render () {
    const  { connectDragSource } = this.props;
    return connectDragSource(
      <div className="list-item">表格区域</div>
    );
  }
}

export default DragSource(ItemTypes.DRAGFORM, tableSecSource, collect)(TableSec);