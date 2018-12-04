import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router';
import { PageTemplate, SelectMax, Log } from 'tuntuntutu-react-components';
import { urls, pages } from '../config';
import './index.less';

const normalCol = [
  {
    title: '创意id',
    dataIndex: 'id',
  }, {
    title: '创意名称',
    dataIndex: 'name',
  },
];
const logCol = [
  {
    title: '操作类型',
    dataIndex: 'name',
    width: 80,
  }, {
    title: '操作备注',
    dataIndex: 'content',
  }, {
    title: '操作人',
    dataIndex: 'username',
    width: 80,
  }, {
    title: '操作时间',
    dataIndex: 'updateTime',
    width: 120,
  },
];

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }


  renderOperate = (val, record) => [
    <div><Link to={{ pathname: pages.create, query: { type: 'edit', id: record.id } }}>编辑</Link></div>,
    <Log columns={logCol} url={urls.logs.url} query={{ model: 'ADVERT_RESOURCE_INSERT', objId: record.id }}>操作日志</Log>,
  ]

  render() {
    const connect = ({ onSearch, form }) => { this.onSearch = onSearch; this.form = form; };
    const config = {
      ...urls.fetchList,
      beforeRequest: val => val,
      afterRequest: val => val,
    };
    const columns = normalCol.concat({
      title: '操作',
      dataIndex: 'operate',
      render: this.renderOperate,
    });
    const toolbar = (
      <div>
        <Link to={{ pathname: pages.create, query: { type: 'add' } }}>
          <Button>新建</Button></Link>
      </div>
    );
    const filter = [
      {
        component: 'Input', key: 'id', label: '创意id',
      },
      {
        component: <SelectMax />, key: 'status', label: '审核状态',
      },
    ];

    return (
      <div className="homepage-list">
        <PageTemplate
          rowKey="id"
          connect={connect}
          columns={columns}
          toolbar={toolbar}
          config={config}
          filter={filter}
        />
      </div>
    );
  }
}
