import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { Input, Select, Button, Modal, Form, Row, Col, Table } from 'antd';

const FormItem = Form.Item;

const sectionTarget = {
  drop (props, monitor, component) {
    const { tagName } = monitor.getItem();
    component.renderElement(tagName);
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
      nodes: { tagName: 'div', attrs: {id: 'wrap'}, children: [] },
      rows: '',
      columns: '',
      gridModalVisible: false
    };
    this.renderElement = this.renderElement.bind(this);
    this.rowsChange = this.rowsChange.bind(this);
    this.columnsChange = this.columnsChange.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  renderElement (ele, posX, posY) {
    switch (ele) {
      case 'SearchSec':
        this.setState({rows: '', columns: '', gridModalVisible: true})
    }
  }
  createNodes ({tagName, attrs, children}) {
    return React.createElement(
      tagName,
      attrs,
      children instanceof Array ? children.map(val => this.createNodes(val)) : children
    );
  }
  rowsChange (e) {
    this.setState({rows: e.target.value});
  }
  columnsChange (e) {
    this.setState({columns: e.target.value});
  }
  handleOk () {
    this.setState({gridModalVisible: false});
    // 组装栅格的数据结构
    let tmpNode = { tagName: 'div', attrs: { id: 'searchWrap', key: 'searchWrap' }, children: [] }
    for (let i = 1; i <= this.state.rows; i++) {
      let rowNode = { tagName: Row, attrs: { key: i }, children: [] }
      for (let j = 1; j <= this.state.columns; j++) {
        let columnNode = {
          tagName: Col,
          attrs: { span: 24 / this.state.columns, key: j, style: { background: (i + j) % 2 === 0 ? '#f0f0f0' : '#E6E6FA', height: '40px' } },
          children: ''
        };
        rowNode['children'].push(columnNode);
      }
      tmpNode['children'].push(rowNode);
    }
    let prevNodes = Object.assign({}, this.state.nodes);
    prevNodes.children.push(tmpNode)
    this.setState({nodes: prevNodes})
  }
  handleCancel () {
    this.setState({gridModalVisible: false});
  }
  render () {
    const { connectDropTarget } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 }
    };
    return connectDropTarget(
      <div style={{ display: 'relative', flex: 1, margin: '0 15px 0 0', border: '1px dashed red' }}>
        <Modal title="设置栅格布局" visible={this.state.gridModalVisible} onOk={this.handleOk} onCancel={this.handleCancel} cancelText={'取消'} okText={'确定'} >
          <Form layout="inline">
            <FormItem {...formItemLayout} label="行">
                <Input value={this.state.rows} onChange={this.rowsChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="列">
              <Input value={this.state.columns} onChange={this.columnsChange} />
            </FormItem>
          </Form>
        </Modal>
        {this.createNodes(this.state.nodes)}
      </div>
    );
  }
}

export default DropTarget(ItemTypes.FORMELEMENT, sectionTarget, collect)(Section);