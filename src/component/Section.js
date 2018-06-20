import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { Input, Select, Button, Modal, Form, Row, Col, Table } from 'antd';

const FormItem = Form.Item;

const sectionTarget = {
  drop (props, monitor, component) {
    // console.log(props)
    const { tagName } = monitor.getItem();
    component.renderElement(tagName);
  },
  hover (props, monitor, component) {
    console.log('props: ', props)
    console.log('monitor: ', monitor)
    console.log('components: ', component)
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
    this.generateButtonSec = this.generateButtonSec.bind(this);
    this.generateTableSec = this.generateTableSec.bind(this);
  }
  renderElement (ele, posX, posY) {
    switch (ele) {
      case 'SearchSec':
        this.setState({rows: '', columns: '', gridModalVisible: true});
        break;
      case 'ButtonSec'  :
        this.generateButtonSec();
        break;
      case 'TableSec'  :
        this.generateTableSec();
        break;
    }
  }
  createNodes ({tagName, attrs, children}) {
    return React.createElement(
      tagName,
      attrs,
      children instanceof Array ? children.map(val => this.createNodes(val)) : children
    );
  }
  generateButtonSec () {
    // 组装按钮区的数据结构
    let tmpNode = { tagName: 'div', attrs: { id: 'buttonWrap', key: 'buttonWrap', style: {background: '#FFE4C4', height: '50px', border: '1px dashed #BEBEBE', borderWidth: '1px 0 1px 0'} }, children: [] };
    let prevNodes = Object.assign({}, this.state.nodes);
    prevNodes.children.push(tmpNode);
    this.setState({nodes: prevNodes});
  }
  generateTableSec () {
    // 组装表格区的数据结构
    let columns = [
      { title: 'name', dataIndex: 'name', key: 'name' },
      { title: 'age', dataIndex: 'age', key: 'age' },
      { title: 'city', dataIndex: 'city', key: 'city' }
    ];
    var tmpNode = { tagName: 'div', attrs: { id: 'tableWrap', key: 'tableWrap' }, children: [
      { tagName: Table, attrs: { columns, key: 'table' }, children: null }
    ]}
    let prevNodes = Object.assign({}, this.state.nodes);
    prevNodes.children.push(tmpNode);
    this.setState({nodes: prevNodes});
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
    prevNodes.children.push(tmpNode);
    this.setState({nodes: prevNodes});
  }
  handleCancel () {
    this.setState({gridModalVisible: false});
  }
  render () {
    const { connectDropTarget, isOver, canDrop } = this.props;
    // console.log('isOver: ', isOver, 'canDrop: ', canDrop)
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 }
    };
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
        {this.createNodes(this.state.nodes)}
      </div>
    );
  }
}

// Section.propTypes = {
//   isOver: PropTypes.bool.isRequired
// };

export default DropTarget(ItemTypes.DRAGFORM, sectionTarget, collect)(Section);