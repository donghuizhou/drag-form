import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { Input, Select, Button, Modal, Form, Row, Col, Table } from 'antd';

const FormItem = Form.Item;

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
      gridModalVisible: false,
      rows: '',
      columns: '',
      isSearchFields: false,
      isButtonFields: false,
      isTableFields: false
    };
    this.rowsChange = this.rowsChange.bind(this);
    this.columnsChange = this.columnsChange.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderElement = this.renderElement.bind(this);
    this.generateButtonFields = this.generateButtonFields(this);
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
        this.setState({gridModalVisible: true, rows: '', columns: ''});
        break;
      case 'ButtonSec':
        this.setState({isButtonFields: true});
        break;
      case 'TableSec': 
        this.setState({isTableFields: true});
        break;
    }
    this.setState(prevState => ({
      children: curChildren
    }))
  }
  rowsChange (e) {
    this.setState({rows: e.target.value})
  }
  columnsChange (e) {
    this.setState({columns: e.target.value})
  }
  handleOk () {
    this.setState({gridModalVisible: false, isSearchFields: true});
  }
  handleCancel () {
    this.setState({gridModalVisible: false});
  }
  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('values: ', values)
      }
    })
  }
  generateSearchFields () {
    const count = this.state.rows * this.state.columns;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };
    const children = [];
    for (let i = 0; i< count; i++) {
      children.push(
        <Col span={8} key={i}>
          <FormItem label={`field-${i}`} {...formItemLayout}>
            <Input placeholder="input something" />
          </FormItem>
        </Col>
      )
    }
    let searchDoms= (
      <div style={{border: '1px solid #eee', padding: '10px 0 0 0'}}>
        <Form>
          <Row gutter={24}>{children}</Row>
        </Form>
      </div>
    )
    return searchDoms;
  }
  generateButtonFields () {
    let buttomDoms = (
      <div style={{border: '1px solid #eee', borderWidth: '0 0 1px 0', padding: '15px 10px'}}>
        <Button type="primary" style={{marginLeft: '10px'}}>Primary</Button>
        <Button style={{marginLeft: '10px'}}>Default</Button>
        <Button type="dashed" style={{marginLeft: '10px'}}>Dashed</Button>
        <Button type="danger" style={{marginLeft: '10px'}}>Danger</Button>
      </div>
    )
    return buttomDoms;
  }
  generateTableFields () {
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    }]

    let tableDoms = (
      <Table columns={columns} />
    )
    return tableDoms;
  }
  render () {
    const { connectDropTarget } = this.props;
    const formItemLayout = {
      labelCol: { xs: { span: 4 }, sm: { span: 8 } },
      wrapperCol: { xs: { span: 5 }, sm: { span: 8 }, }
    };
    return connectDropTarget(
      <div style={{ display: 'relative', flex: 1, margin: '0 15px 0 0', border: '1px dashed red' }}>
        <Modal title="设置栅格布局" visible={this.state.gridModalVisible} onOk={this.handleOk} onCancel={this.handleCancel} cancelText={'取消'} okText={'确定'} >
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="行">
                <Input value={this.state.rows} onChange={this.rowsChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="列">
              <Input value={this.state.columns} onChange={this.columnsChange} />
            </FormItem>
          </Form>
        </Modal>
        {this.state.isSearchFields ? this.generateSearchFields() : null}
        {this.state.isButtonFields ? this.generateButtonFields : null}
        {this.state.isTableFields ? this.generateTableFields() : null}
      </div>
    );
  }
}

// Section = Form.create()(Section)

export default DropTarget(ItemTypes.FORMELEMENT, sectionTarget, collect)(Section);