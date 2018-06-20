import React, { Component } from 'react';
import { Tabs } from 'antd';
import Input from './form-elements/Input';
import Select from './form-elements/Select';
import Button from './form-elements/Button';
import SearchSec from './form-elements/SearchSec';
import ButtonSec from './form-elements/ButtonSec';
import TableSec from './form-elements/TableSec';

const TabPane = Tabs.TabPane;

export default class List extends Component {
  render () {
    return (
      <div style={{
        width: '300px',
        border: '1px solid #eee',
        overflowY: 'auto'
      }}>
        <Tabs defaultActiveKey="component-list">
          <TabPane tab="组件列表" key="component-list">
            <section style={{
                border: '1px solid #eee',
                borderWidth: '1px 0 0 0'
            }}>
              <SearchSec />
              <ButtonSec />
              <TableSec />
            </section>
            <section style={{
              border: '1px solid #eee',
              borderWidth: '1px 0 0 0',
              margin: '18px 0 0 0'
            }}>
              <Input />
              <Select />
              <Button />
            </section>
          </TabPane>
          <TabPane tab="组件配置" key="component-config">组件配置</TabPane>
        </Tabs>
      </div>
    );
  }
}