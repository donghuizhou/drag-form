import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { Input, Select, Button, Modal, Form } from 'antd';

const sectionTarget = {
  drop (props, monitor, component) {
    const { x, y } = monitor.getClientOffset();
    const { tagName } = monitor.getItem();
    component.renderElement(tagName, x, y);
  }
};

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

class Section extends Component {
  constructor (props) {
    super(props);
    this.state = {
      children: [],
      gridModalVisible: false
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  renderElement (ele, posX, posY) {
    let curChildren = this.state.children;
    switch (ele) {
      case 'Input':
        curChildren.push(<Input placeholder="请输入" style={{position: 'absolute', top: posY, left: posX, width: '100px'}} />)
        break;
      case 'Select':
        curChildren.push(<Select placeholder="请选择" style={{position: 'absolute', top: posY, left: posX, width: '100px'}}></Select>)
        break;
      case 'Button':
        curChildren.push(<Button type="primary" style={{position: 'absolute', top: posY, left: posX, width: '100px'}}>按钮</Button>)
        break;
      case 'SearchSec':
        this.setState({gridModalVisible: true})  
    }
    this.setState(prevState => ({
      children: curChildren
    }))
  }
  handleOk () {
    this.setState({gridModalVisible: false});
  }
  handleCancel () {
    this.setState({gridModalVisible: false});
  }
  render () {
    const { connectDropTarget } = this.props;
    // let doms = this.state.children.map((item) => item);
    return connectDropTarget(
      <div style={{ display: 'relative', flex: 1, margin: '0 15px 0 0', border: '1px dashed red' }}>
        <Modal title="提示" visible={this.state.gridModalVisible} onOk={this.handleOk} onCancel={this.handleCancel} cancelText={'取消'} okText={'确定'} >

        </Modal>
      </div>
    );
  }
}

export default DropTarget(ItemTypes.FORMELEMENT, sectionTarget, collect)(Section);