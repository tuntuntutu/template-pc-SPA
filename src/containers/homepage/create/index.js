import React, { Component } from 'react';
import { Button, Form, Modal, Input, message, Radio, Tooltip, Icon } from 'antd';
import { SelectMax, request } from '@cfe/caopc-center-common';
import { Link, browserHistory } from 'react-router';
import { urls, pages } from '../config';
import Material from './components/material';
import './index.less';

const pageTypeList = [{ label: 'URL地址', value: 1 }, { label: '原生应用页面', value: 0 }];

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 8 },
};

const showSuccess = () => {
  Modal.success({
    keyboard: false,
    maskClosable: false,
    closable: false,
    title: '提示',
    content: '操作成功',
    onOk: () => {
      browserHistory.push(pages.list);
    },
  });
};

@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    const { type, id } = props.location.query;

    this.state = {
      pageType: type,
      currentId: id,
    };
  }
  componentWillMount() {
    const { currentId } = this.state;

    if (currentId) {
      this.fetchDetail(currentId);
    }
  }

  fetchDetail(id) {
    request({
      ...urls.fetchDetail,
      data: { id },
    }).then((res) => {
      const {
        terminal, bizLine, linkWord, resourceFiles = [], linkType, ...others
      } = res;

      this.setState({
        detail: res,
        adsType: linkWord ? 1 : 0,
        linkType,
      });

      this.props.form.setFieldsValue({
        terminal,
        bizLine,
        linkWord,
        linkType,
        resourceFiles: resourceFiles.map(item => (
          {
            ...item,
            disabled: !!item.disabled,
            fileList: [{ uid: item.id, url: item.fileUrl, response: { data: item.fileUrl } }],
          }
        )),
        ...others,
      });

      this.doSearchPosition(terminal, bizLine);
    });
  }

  inject = () => {
    const { currentId } = this.state;
    const changeReason = (e) => {
      this.setState({
        rejectedReason: e.target.value,
      });
    };

    Modal.confirm({
      title: '填写驳回理由',
      content: <TextArea autosize={{ minRows: 1, maxRows: 4 }} onChange={changeReason} maxLength={50} />,
      onOk: () => new Promise((resolve, reject) => {
        const { rejectedReason } = this.state;

        if (!rejectedReason) {
          message.error('请输入驳回理由');
          reject();
        } else {
          resolve(rejectedReason);
        }
      }).then((rejectReason) => {
        request({
          ...urls.audit,
          data: {
            approve: 0, // 公用接口, 1：通过 0：不通过
            auditType: 1, // 公用接口, 1：广告物料审核 2：广告投放计划审核 ,
            referId: currentId,
            rejectReason,
          },
        }).then(() => {
          showSuccess();
        });
      }),
    });
  }

  submit = () => {
    const { form } = this.props;
    const { currentId } = this.state;

    form.validateFields((errors, values) => {
      if (errors) return;
      const { resourceFiles = [] } = values;
      delete values.bizLine;
      delete values.terminal;

      values.resourceFiles = resourceFiles.filter(item => !item.disabled)
        .map((item) => {
          const { fileList, disabled, ...others } = item;
          return { ...others, fileUrl: fileList[0].response.data };
        });

      request({
        ...(currentId ? urls.update : urls.add),
        data: currentId ? { id: currentId, ...values } : values,
      }).then(() => {
        showSuccess();
      });
    });
  }

  pass = () => {
    const { currentId } = this.state;

    request({
      ...urls.audit,
      data: {
        approve: 1, // 公用接口, 1：通过 0：不通过
        auditType: 1, // 公用接口, 1：广告物料审核 2：广告投放计划审核 ,
        referId: currentId,
      },
    }).then(() => {
      showSuccess();
    });
  }

  // 搜索广告位
  searchPosition = () => {
    const { terminal, bizLine } = this.props.form.getFieldsValue();

    if (!terminal || !bizLine) {
      message.error('请选择终端和业务线');
      return;
    }
    this.doSearchPosition(terminal, bizLine);
  }
  doSearchPosition = (terminal, bizLine) => {
    request({
      ...urls.fetchAds,
      data: {
        terminal, bizLine, status: 1, // 已启用
      },
    }).then((res) => {
      this.setState({
        adLocationList: res,
      });
    });
  }

  // 选择广告位
  changePosition = (val) => {
    if (!val) {
      this.setState({
        adsType: null,
      });
      return;
    }
    const { adLocationList = [] } = this.state;
    const currentPosition = adLocationList.find(item => item.id === val) || {};


    this.setState({
      adsType: currentPosition.type,
    }, () => {
      this.props.form.setFieldsValue({
        resourceFiles: currentPosition.sizeSetting || [],
      });
    });
  }
  checkMaterialPics = (rule, value, callback) => {
    if (!value || !value.length) {
      callback('请上传图片');
      return;
    }
    let hasNull = false;
    value.forEach((item) => {
      if (!item.fileList.length) {
        hasNull = true;
      }
    });
    if (hasNull) {
      callback('请上传所有图片');
      return;
    }

    callback();
  }

  changeLinkType = (e) => {
    const { form } = this.props;
    const linkType = form.getFieldValue('linkType');

    if (linkType || linkType === 0) {
      form.setFieldsValue({ linkUrl: '' });
    }
    this.setState({
      linkType: e.target.value,
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const {
      pageType, adLocationList, adsType, detail = {}, linkType,
    } = this.state;
    const { status } = detail;
    const disabledAll = pageType !== 'add';
    const disabledOfEditing = pageType !== 'edit' && pageType !== 'add';
    const linkUrl = getFieldValue('linkUrl');

    return (<div className="originality-manager-create">
      <Form layout="inline">
        <FormItem label="终端">
          {getFieldDecorator('terminal')(<SelectMax
            disabled={disabledAll}
            url={urls.fetchTerminals}
          />)}
        </FormItem>
        <FormItem label="业务线">
          {getFieldDecorator('bizLine')(<SelectMax
            disabled={disabledAll}
            url={urls.fetchBizlLines}
          />)}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.searchPosition}>查询广告位</Button>
        </FormItem>
      </Form>
      <Form style={{ marginTop: 40 }}>
        <FormItem {...formItemLayout} label="创意名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入创意名称' }],
          })(<Input disabled={disabledAll} />)}
        </FormItem>
        <FormItem {...formItemLayout}
          label={<span>广告位
            <Tooltip title="选择终端、业务线查询广告位"><Icon type="question-circle" /></Tooltip>
          </span>}
        >
          {getFieldDecorator('positionId', {
            onChange: this.changePosition,
            rules: [{ required: true, message: '请选择广告位' }],
          })(<SelectMax
            optionMap={{ key: 'id', value: 'positionName' }}
            options={adLocationList}
            disabled={disabledAll}
          />)}
        </FormItem>
        {
          adsType === 0 ? <FormItem {...formItemLayout} label="投放物料">
            {getFieldDecorator('resourceFiles', {
              rules: [{ validator: this.checkMaterialPics }],
            })(<Material
              disabled={disabledOfEditing}
            />)}
          </FormItem> : null
        }
        {
          adsType === 1 ? <FormItem {...formItemLayout} label="顶部通知栏">
            {getFieldDecorator('linkWord')(<Input
              disabled={disabledOfEditing}
              maxLength={15}
              placeholder="请输入文案（限15字）"
            />)}
          </FormItem> : null
        }
        <FormItem {...formItemLayout} label="投放落地页">
          {getFieldDecorator('linkType', {
            onChange: this.changeLinkType,
            rules: [{ required: true, message: '请选择投放落地页类型' }],
          })(<RadioGroup options={pageTypeList} disabled={disabledOfEditing} />)}
        </FormItem>
        {
          linkType === 0 ?
            <FormItem {...formItemLayout} label=" " colon={false}>
              {getFieldDecorator('linkUrl', {
                rules: [{ required: true, message: '请选择原生应用页面' }],
              })(<SelectMax
                disabled={disabledOfEditing}
                url={urls.fetchLandingPageTypeList}
                placeholder="请选择原生应用页面"
              />)} { linkUrl ? <a href={linkUrl} target="_blank" rel="noreferrer noopener">点击查看应用页面</a> : null}
            </FormItem> : null
          }
        {
          linkType === 1 ?
            <FormItem {...formItemLayout} label=" " colon={false}>
              {getFieldDecorator('linkUrl', {
                rules: [
                  { required: true, message: '请输入URL地址' },
                  { pattern: /^((https|http)?:\/\/)[^\s]+/, message: '请输入标准的http或者https链接' }],
              })(<Input
                style={{ width: 400 }}
                disabled={disabledOfEditing}
                placeholder="请输入URL地址"
              />)}
            </FormItem>
                : null
          }
        <FormItem {...formItemLayout} label=" " colon={false}>
          {pageType === 'apply' && status === 0 ?
            [
              <Button onClick={this.pass} type="primary">通过</Button>,
              <Button onClick={this.inject}>驳回</Button>,
              <Link to={{ pathname: pages.list }}><Button>取消</Button></Link>,
            ] : null
          }
          {['edit', 'add'].includes(pageType) ?
            [
              <Button onClick={this.submit} type="primary">保存</Button>,
              <Link to={{ pathname: pages.list }}><Button>取消</Button></Link>,
            ] : null
          }
        </FormItem>
      </Form>
    </div>);
  }
}
