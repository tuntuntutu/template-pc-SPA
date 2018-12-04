import React, { Component } from 'react';
import {
  Button, Form, Modal, Input,
} from 'antd';
import { request } from 'tuntuntutu-react-components';
import { Link, browserHistory } from 'react-router';
import { urls, pages } from '../config';
import './index.less';


const FormItem = Form.Item;

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

    const { id } = props.location.query;

    this.state = {
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
      this.props.form.setFieldsValue({
        ...res,
      });
    });
  }


  submit = () => {
    const { form } = this.props;
    const { currentId } = this.state;

    form.validateFields((errors, values) => {
      if (errors) return;

      request({
        ...(currentId ? urls.update : urls.add),
        data: currentId ? { id: currentId, ...values } : values,
      }).then(() => {
        showSuccess();
      });
    });
  }


  render() {
    const { form, disabledAll } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className="homepage-create">
        <Form style={{ marginTop: 40 }}>
          <FormItem {...formItemLayout} label="创意名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入创意名称' }],
            })(<Input disabled={disabledAll} />)}
          </FormItem>


          <FormItem {...formItemLayout} label=" " colon={false}>
            [
            <Button onClick={this.submit} type="primary">保存</Button>,
            <Link to={{ pathname: pages.list }}><Button>取消</Button></Link>,
              ]
          </FormItem>
        </Form>
      </div>
    );
  }
}
