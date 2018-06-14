import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Button } from 'antd';
import './App.css';
import Section from './component/Section'
import List from './component/List';

class App extends Component {
  render() {
    return (
      <section className="layout">
        <section className="layout-top">
          <Section />
          <List />
        </section>
        <footer className="layout-bottom">
          <Button type="primary" className="bottom-btn">预览</Button>
          <Button type="primary" className="bottom-btn">编码</Button>
          <Button type="primary" className="bottom-btn">保存</Button>
        </footer>
      </section>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
