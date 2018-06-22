import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { Input, Select, Button, Modal, Form, Row, Col, Table, message } from 'antd';
import store from '../redux/store';
import { updateItem, canDrop } from '../redux/actions';

const FormItem = Form.Item;

const sectionTarget = {
  drop (props, monitor, component) {
    let canDrop = store.getState().canDrop;
    const { tagName } = monitor.getItem();
    component.renderElement(tagName, canDrop);
  },
  hover (props, monitor, component) {
  }
};

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

class Section extends Component {
  constructor (props) {
    super(props);
    this.state = {
      elements: { 
        existedContainer: [], 
        nodes: { tagName: 'div', attrs: {id: 'wrap'}, children: [] }
      },
      rows: '',
      columns: '',
      gridModalVisible: false,
      overSection: false
    };
  }
  renderElement = (ele, canDrop) => {
    switch (ele) {
      case 'SearchSec':
        if (this.state.elements.existedContainer.includes('searchContainer')) {
          message.error('已存在搜索区域'); return;
        }
        this.setState({rows: '', columns: '', gridModalVisible: true});
        break;
      case 'ButtonSec'  :
        if (this.state.elements.existedContainer.includes('ButtonContainer')) {
          message.error('已存在按钮区域'); return;
        }
        this.generateButtonSec();
        break;
      case 'TableSec'  :
        if (this.state.elements.existedContainer.includes('tableContainer')) {
          message.error('已存在表格区域'); return;
        }
        this.generateTableSec();
        break;
      case 'Button':
        if (canDrop) {
          this.generateButton();
        }  
        break;
    }
  }
  createNodes = ({tagName, attrs, children}) => {
    return React.createElement(
      tagName,
      attrs,
      children instanceof Array ? children.map(val => this.createNodes(val)) : children
    );
  }
  handleItemOver = (isOver) => {
    if (isOver) {
      let item = store.getState().curItem;
      switch (item) {
        case 'Button':
          if (this.state.elements.nodes.children.find(item => item.attrs.id == 'buttonWrap')) { 
            store.dispatch(canDrop(true)) 
          }
          else { store.dispatch(canDrop(false))  }
          break;
      }      
    }
  }
  generateButtonSec = () => {
    // 组装按钮区的数据结构
    let tmpNode = { tagName: 'div', attrs: { id: 'buttonWrap', key: 'buttonWrap', style: {background: '#FFE4C4', padding: '0 0 10px 0', minHeight: '50px', border: '1px dashed #BEBEBE', borderWidth: '1px 0 1px 0'} }, children: [] };
    let prevElements = Object.assign({}, this.state.elements);
    prevElements.nodes.children.push(tmpNode);
    prevElements.existedContainer.push('ButtonContainer')
    this.setState({elements: prevElements});
  }
  generateTableSec = () => {
    // 组装表格区的数据结构
    let columns = [
      { title: 'name', dataIndex: 'name', key: 'name' },
      { title: 'age', dataIndex: 'age', key: 'age' },
      { title: 'city', dataIndex: 'city', key: 'city' }
    ];
    let tmpNode = { tagName: 'div', attrs: { id: 'tableWrap', key: 'tableWrap' }, children: [
      { tagName: Table, attrs: { columns, key: 'table' }, children: null }
    ]}
    let prevElements = Object.assign({}, this.state.elements);
    prevElements.nodes.children.push(tmpNode);
    prevElements.existedContainer.push('tableContainer')
    this.setState({elements: prevElements});
  }
  generateButton = () => {
    let tmpNode = { tagName: Button, attrs: { type: 'primary', key: Date.parse(new Date()), style: { margin: '10px 0 0 10px' } }, children: 'button' }
    let prevElements = Object.assign({}, this.state.elements);
    prevElements.nodes.children.find(item => {
      if (item.attrs.id == 'buttonWrap') {
        item.children.push(tmpNode);
      }
    });
    this.setState({elements: prevElements});
  }
  rowsChange = (e) => {
    this.setState({rows: e.target.value});
  }
  columnsChange = (e) => {
    this.setState({columns: e.target.value});
  }
  handleOk = () => {
    if (24 % this.state.columns != 0) { message.error('列数必须能被24整除'); return; }
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
    let prevElements = Object.assign({}, this.state.elements);
    prevElements.nodes.children.push(tmpNode);
    prevElements.existedContainer.push('searchContainer')
    this.setState({elements: prevElements});
  }
  handleCancel = () => {
    this.setState({gridModalVisible: false});
  }
  render () {
    const { connectDropTarget, isOver, canDrop } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 }
    };
    this.handleItemOver(isOver);
    // console.log(this.state.elements);
    return connectDropTarget(
      <div style={{ display: 'relative', flex: 1, margin: '0 15px 0 0', border: '1px dashed red', overflowY: 'auto' }}>
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
        {this.createNodes(this.state.elements.nodes)}
      </div>

      // <Form></Form>
      // <ButtonArea></ButtonArea>
    );
  }
}

export default DropTarget(ItemTypes.DRAGFORM, sectionTarget, collect)(Section);