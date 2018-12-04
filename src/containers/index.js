import React, { Component } from 'react';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

export default class Index extends Component {
  render() {
    return (
      <LocaleProvider locale={zhCN}>
        <div className="">
          {this.props.children}
        </div>
      </LocaleProvider>
    );
  }
}
