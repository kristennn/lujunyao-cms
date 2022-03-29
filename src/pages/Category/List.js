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
      isModalVisible: false
    };
  }

  componentDidMount() {
    // 组件首次加载时请求列表
    this.handleSearch();
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
        request('/empty-item/category/list', {
          method: 'POST',
          data: values,
        }).then(res => {
          if (res.code === 'SUCCESS') {
            this.setState({
              list: res.data,
            });
          }
          this.loading();
        });
      }
    });
  };

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
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col span={24} md={24} lg={8}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          {/* <Col span={24} md={24} lg={8}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="釉色">
              {getFieldDecorator('glaze')(
                <Select options={glazeOptions} />
              )}
            </FormItem>
          </Col>
          <Col span={24} md={24} lg={8}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="品类">
              {getFieldDecorator('type')(
                <Select options={typeOptions} />
              )}
            </FormItem>
          </Col>
          <Col span={24} md={24} lg={8}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="系列">
              {getFieldDecorator('series')(
                <Select options={seriesOptions} />
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

  // 跳转到编辑页面
  update = (flag, record) => {
    router.push(`/category/update?id=${record.id}`);
  };

  // 跳转到添加页面
  add = () => {
    router.push('/category/add');
  };

  detail = record => {
    router.push(`/category/detail?id=${record.id}`);
  };

  // 删除
  delete = record => {
    this.loading(true);
    request('/empty-item/category/delete', {
      method: 'POST',
      data: {
        id: record.id,
      },
    }).then(res => {
      if (res.code === 'SUCCESS') {
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
  
  // 生成产品
  generate = (id, amount) => {
    this.loading(true);
    request('/empty-item/category/generate', {
      method: 'POST',
      data: {
        id,
        amount 
      },
    }).then(res => {
      if (res.code === 'SUCCESS') {
        notification.success({
          message: res.code,
          description: res.msg,
        });
      } else {
        notification.error({
          message: res.code,
          description: res.msg,
        });
      }
      this.loading();
    });
  };

  showModal = record => {
    this.setState({
      currId: record.id
    })
    this.setIsModalVisible(true);
  };

  handleOk = async () => {
    const form = this.props.form
    const formData = form.getFieldsValue()
    await this.generate(this.state.currId, formData.amount)
    form.resetFields()
    this.setIsModalVisible(false)
  };

  handleCancel = () => {
    const form = this.props.form
    form.resetFields()
    this.setIsModalVisible(false);
  };

  setIsModalVisible = (state) => {
    this.setState({
      isModalVisible: state
    });
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
          return <img src={imgUrl + record.url} style={{ width: 100 }} />;
        },
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render(item) {
          return <div className="name">{item}</div>
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
        title: '釉色',
        dataIndex: 'glaze',
        key: 'glaze',
        render(item) {
          switch (item) {
            case 'TQ':
              return '天青';
            case 'MS':
              return '秘色';
            case 'LJ':
                return '窑变';
            case 'YB':
                return '月白';
            default:
          }
          return '';
        },
      },
      {
        title: '品类',
        dataIndex: 'type',
        key: 'type',
        render(item) {
          switch (item) {
            case 'CQ':
              return '茶器';
            case 'CJ':
              return '餐器';
            case 'XQ':
                return '香器';
            case 'BJ':
                return '工艺品';
            default:
          }
          return '';
        },
      },
      {
        title: '系列',
        dataIndex: 'series',
        key: 'series',
        render(item) {
          switch (item) {
            case '001':
              return '系列1';
            case '002':
              return '系列2';
            case '003':
                return '系列3';
            case '004':
                return '系列4';
            default:
          }
          return '';
        },
      },
      {
        title: '尺寸',
        dataIndex: 'size',
        key: 'size',
        render(item) {
          switch (item) {
            case '5.5':
              return '5.5寸';
            case '7':
              return '7寸';
            case '8':
                return '8寸';
            case '10':
                return '10寸';
            default:
          }
          return '';
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render(item) {
          return <div className="remark">{item}</div>
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
            <a onClick={() => this.detail(record)}>查看</a>
            <a onClick={() => this.update(true, record)} className="marginLeft">
              编辑
            </a>
            <a onClick={() => this.showModal(record)} className="marginLeft">
              生成产品
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
            <Button icon="plus" type="primary" onClick={() => this.add()}>
              新建
            </Button>
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
          <Modal title="Basic Modal" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
            <Form>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="生成数量">
                {getFieldDecorator('amount')(<InputNumber min={1} max={10}/>)}
              </FormItem>
            </Form>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default List;
