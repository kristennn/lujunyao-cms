/*
 * @Descripttion:
 * @Author: sunft
 * @Date: 2020-04-29 15:58:56
 * @LastEditTime: 2020-05-18 10:58:24
 */
import React, { PureComponent, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Select,
  Form,
  Input,
  InputNumber,
  Modal,
  Button,
  Popconfirm,
  DatePicker,
  Tooltip,
  notification,
} from 'antd';
import { glazeOptions, typeOptions, seriesOptions, sizeOptions } from '@/utils/options';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import router from 'umi/router';
import request from '@/utils/request';
import { imgUrl } from '@/global';

const { RangePicker } = DatePicker;
/* eslint react/no-multi-comp:0 */
@Form.create()
class List extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      categoryList: []
    };
  }

  componentDidMount() {
    // 组件首次加载时请求列表
    this.handleSearch();
    this.getCategoryList();
  }

  loading = flag => {
    this.setState({
      loading: !!flag,
    });
  };

  // 搜索
  handleSearch = e => {
    const { form } = this.props;
    if (e) e.preventDefault();
    // 校验搜索表单
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        // 不要直接改变 fieldsValue
        const values = {
          ...fieldsValue,
        };
        request('/empty-item/product/list', {
          method: 'POST',
          data: values,
        }).then(res => {
          if (res && res.code === 'SUCCESS') {
            this.setState({
              list: res.data,
            });
          }
          this.loading();
        });
      }
    });
  };

  getCategoryList = e => {
    // 校验搜索表单
    this.setState({
        loading: true,
    });
    request('/empty-item/category/list', {
        method: 'POST',
        data: {},
    }).then(res => {
        if (res && res.code === 'SUCCESS') {
        this.setState({
            categoryList: res.data,
        });
        }
        this.loading();
    });
}

  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.handleSearch();
  };

  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item;
    return (
      <Form
        labelCol={{ span: 4, md: 4, lg: 8 }}
        wrapperCol={{ span: 19, md: 19, lg: 16 }}
        onSubmit={this.handleSearch}
      >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col span={24} md={24} lg={8}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          {/* <Col span={24} md={24} lg={8}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="品类名称">
              {getFieldDecorator('categoryId')(
                <Select>
                  {this.state.categoryList.map(category => {
                    return (<Select.Option value={category.value} key={category.id}>{category.label}</Select.Option>)
                  })}
                </Select>
              )}
            </FormItem>
          </Col> */}
          <Col span={24} md={24} lg={8}>
            <FormItem label="创建时间">{getFieldDecorator('createdAt')(<RangePicker />)}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} md={24} lg={24}>
            <FormItem style={{ float: 'right', whiteSpace: 'nowrap' }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  // 删除
  delete = record => {
    this.loading(true);
    request('/empty-item/product/delete', {
      method: 'POST',
      data: {
        id: record.id,
      },
    }).then(res => {
      if (res && res.code === 'SUCCESS') {
        notification.success({
          message: res.code,
          description: res.msg,
        });
        this.handleFormReset();
      } else {
        notification.error({
          message: res.code,
          description: res.msg,
        });
      }
      this.loading();
    });
  };

  gotoCategory = categoryId => {
    router.push(`/category/detail?id=${categoryId}`);
  };

  downloadImg = record => {
    this.loading(true);
    window.open('/empty-item/product/downloadImg' + `?id=${record.id}`, '_self')
    this.loading();
  };

  downloadBulkImg = () => {
    this.state.list.forEach(record => {
      this.downloadImg(record)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item;
    const { list, loading } = this.state;
    // 定义表格各列
    const columns = [
      {
        title: '图片',
        key: 'url',
        render(item, record) {
          return <img src={`/empty-item/product/qr?id=${record.id}`} style={{ width: 100 }} alt={'qrcode'} />;
        },
      },
      {
        title: '编号',
        dataIndex: 'code',
        key: 'code',
        render(item) {
          return <div className="code">{item}</div>
        },
      },
      {
        title: '品类',
        dataIndex: 'categoryId',
        key: 'categoryId',
        render(item) {
          return <a onClick={() => this.gotoCategory(item)}>{item}</a>
        },
      },
      {
        title: '创建日期',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render(item) {
          return moment(item).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.downloadImg(record)}>
              下载二维码
            </a>
            <Popconfirm
              title="确定删除？"
              onConfirm={() => this.delete(record)}
              okText="确定"
              cancelText="取消"
              className="marginLeft"
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="品类列表">
        <Card>
          <Row>
            {this.renderForm()}
            {/* <Button type="primary" onClick={() => this.downloadBulkImg()}>
              下载全部二维码
            </Button> */}
          </Row>
          <Row className="marginTop">
            <Table
              dataSource={list}
              rowKey="id"
              columns={columns}
              loading={loading}
              bordered={false}
              scroll={{ x: 'max-content' }}
              pagination={{
                pageSize: 10,
                showQuickJumper: true,
              }}
            />
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default List;
