/*
 * @Descripttion:
 * @Author: sunft
 * @Date: 2020-04-30 10:24:10
 * @LastEditTime: 2020-04-30 15:07:48
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Upload,
  Modal,
  message,
  Select,
  Radio,
  Icon,
  Form,
  Input,
  notification,
  Button,
} from 'antd';
import { glazeOptions, typeOptions, seriesOptions, sizeOptions } from '@/utils/options';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { imgUrl } from '@/global';
import router from 'umi/router';
import request from '@/utils/request';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(({ article, loading }) => ({
  article,
  loading: loading.models.rule,
}))
@Form.create()
class Add extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      uploadLoading: false,
      imageUrl: null,
    };
  }

  loading = flag => {
    this.setState({
      loading: !!flag,
    });
  };

  handleSubmit = e => {
    const { form } = this.props;
    const { imageUrl } = this.state;
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        // if (!imageUrl) {
        //   message.error('图片不能为空');
        //   return;
        // }
        const value = {
          ...fieldsValue,
          url: imageUrl,
        };
        this.loading(true);
        Modal.confirm({
          title: '确定新增？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            request('/empty-item/category/saveOrUpdate', {
              method: 'POST',
              data: value,
            }).then(res => {
              if (res.code === 'SUCCESS') {
                notification.success({
                  message: res.code,
                  description: res.msg,
                });
                router.go(-1);
              } else {
                notification.error({
                  message: res.code,
                  description: res.msg,
                });
              }
              this.loading();
            });
          },
        });
      }
    });
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({
        uploadLoading: true,
      });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({
        imageUrl: info.file.response.code === 'SUCCESS' ? info.file.response.data.url : null,
        uploadLoading: false,
      });
    }
  };

  handleFormItemChange = (label, info) => {
    const form = this.props.form
    const formData = form.getFieldsValue()
    formData[label] = info.target.value
    form.setFieldsValue({
      code: (formData.glaze || '') + (formData.type || '') + (formData.series || '')
    })
  }

  cancel = () => {
    router.go(-1);
  };

  render() {
    const { form } = this.props;
    const { imageUrl, loading } = this.state;
    return (
      <PageHeaderWrapper title="新增">
        <Card>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 10 }} label="品类名称">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 10 }} label="品类编号">
              {form.getFieldDecorator('code', {
                rules: [],
              })(<Input disabled />)}
            </FormItem>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 10 }} label="釉色">
              {form.getFieldDecorator('glaze', {
                rules: [{ required: true, message: '请选择！' }],
              })(
                <Radio.Group
                  options={glazeOptions}
                  onChange={(e) => this.handleFormItemChange('glaze', e)}
                  optionType="button"
                  buttonStyle="solid"
                />
              )}
            </FormItem>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 10 }} label="品类">
              {form.getFieldDecorator('type', {
                rules: [{ required: true, message: '请选择！' }],
              })(
                <Radio.Group
                  options={typeOptions}
                  onChange={(e) => this.handleFormItemChange('type', e)}
                  optionType="button"
                  buttonStyle="solid"
                />
              )}
            </FormItem>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 10 }} label="系列">
              {form.getFieldDecorator('series', {
                rules: [{ required: true, message: '请选择！' }],
              })(
                <Radio.Group
                  options={seriesOptions}
                  onChange={(e) => this.handleFormItemChange('series', e)}
                  optionType="button"
                  buttonStyle="solid"
                />
              )}
            </FormItem>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 10 }} label="尺寸">
              {form.getFieldDecorator('size', {
                rules: [{ required: true, message: '请选择！' }],
              })(
                <Radio.Group
                  options={sizeOptions}
                  optionType="button"
                  buttonStyle="solid"
                />
              )}
            </FormItem>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 10 }} label="备注">
              {form.getFieldDecorator('remark', {
                rules: [],
              })(<TextArea placeholder="请输入" />)}
            </FormItem>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 10 }} label="图片">
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="/empty-item/api/uploadImg"
                onChange={this.handleChange}
              >
                {imageUrl ? (
                  <img src={imgUrl + imageUrl} alt="image" style={{ width: '100%' }} />
                ) : (
                  <div>
                    <Icon type={this.state.uploadLoading ? 'loading' : 'plus'} />
                    <div className="ant-upload-text">Upload</div>
                  </div>
                )}
              </Upload>
            </FormItem>
            <div className="flexCenter">
              <Button onClick={() => this.cancel()}>取消</Button>
              <Button type="primary" className="marginLeft" htmlType="submit" loading={loading}>
                提交
              </Button>
            </div>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Add;
