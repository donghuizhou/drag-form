import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../ItemTypes';
import store from '../../redux/store';
import { updateItem } from '../../redux/actions';

const searchSecSource = {
  beginDrag (props, monitor, component) {
    store.dispatch(updateItem('SearchSec'));
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

export default DragSource(ItemTypes.DRAGFORM, searchSecSource, collect)(SearchSec);