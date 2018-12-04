import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { Link } from 'react-router';
import { PageTemplate, SelectMax, Log } from 'tuntuntutu-react-components';
import { urls, pages, applyStatusList } from '../config';
import './index.less';

const normalCol = [
  {
    title: '创意id',
    dataIndex: 'id',
  }, {
    title: '创意名称',
    dataIndex: 'name',
  }, {
    title: '终端',
    dataIndex: 'terminalName',
  }, {
    title: '业务线',
    dataIndex: 'bizLineName',
  }, {
    title: '广告位',
    dataIndex: 'positionName',
  }, {
    title: '关联计划id',
    dataIndex: 'campaignsId',
    render: val => (val && val.length ? val.join(',') : ''),
  }, {
    title: '审核状态',
    dataIndex: 'status',
    render: val => (applyStatusList.find(item => item.key === val) || {}).value,
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
    title: '操作创意ID',
    dataIndex: 'objId',
    width: 80,
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

  showRejectReason = record => () => {
    Modal.info({
      iconType: ' ',
      title: '查看驳回理由',
      content: record.reason,
    });
  }

  renderOperate = (val, record) => [
    record.status === 0
      ? (
        <div><Link to={{ pathname: pages.create, query: { type: 'apply', id: record.id } }}>审核</Link>
        </div>
      ) : null,
    <div><Link to={{ pathname: pages.create, query: { type: 'preview', id: record.id } }}>创意预览</Link></div>,
    <div><Link to={{ pathname: pages.create, query: { type: 'edit', id: record.id } }}>编辑创意</Link></div>,
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
          <Button>新建创意</Button></Link>
      </div>
    );
    const filter = [
      {
        component: 'Input', key: 'id', label: '创意id',
      },
      {
        component: 'Input', key: 'name', label: '创意名称',
      },
      {
        component: <SelectMax options={applyStatusList} />, key: 'status', label: '审核状态',
      },
    ];

    return (
      <div className="originality-manager">
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
