/*
 * @Descripttion:
 * @Author: sunft
 * @Date: 2020-04-27 13:16:13
 * @LastEditTime: 2020-05-18 15:06:49
 */
import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Divider, Button, Row, notification,Descriptions  } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import request from '@/utils/request';
import { imgUrl } from '@/global';
import styles from './index.less';

class Detail extends PureComponent {
  constructor() {
    super();
    this.state = {
      current: {},
      loading: true,
    };
  }

  componentDidMount() {
    const {
      query: { id },
    } = this.props.location;
    if (id === undefined) return;
    request(`/empty-item/category/detail?id=${id}`).then(res => {
      if (res.code === 'SUCCESS') {
        this.setState({
          current: res.data,
        });
      } else {
        notification.error({
          message: res.code,
          description: res.msg,
        });
      }
      this.setState({
        loading: false,
      });
    });
  }

  render() {
    const { current, loading } = this.state;
    return (
      <PageHeaderWrapper title="详情">
        <Card loading={loading}>
          <Descriptions size="large" title="基本信息">
            <Descriptions.Item label="名称">{current.name} </Descriptions.Item> 
            <Descriptions.Item label="编号">{current.code} </Descriptions.Item> 
          </Descriptions>
          <Divider dashed />
          <Descriptions size="large" title="其他信息">
            <Descriptions.Item label="釉色">{current.glaze} </Descriptions.Item> 
            <Descriptions.Item label="品类">{current.type} </Descriptions.Item> 
            <Descriptions.Item label="系列">{current.series} </Descriptions.Item> 
            <Descriptions.Item label="尺寸">{current.size} </Descriptions.Item> 
            <Descriptions.Item label="创建时间">
              {moment(current.createdAt).format('YYYY-MM-DD HH:mm:ss')}{' '}
            </Descriptions.Item> 
            <Descriptions.Item label="上次修改时间">
              {moment(current.updatedAt).format('YYYY-MM-DD HH:mm:ss')}{' '}
            </Descriptions.Item> 
          </Descriptions>
          <Divider dashed />
          <Descriptions size="remark" title="备注">
            <Descriptions.Item> {current.remark}</Descriptions.Item> 
          </Descriptions>
          <Divider dashed />
          <img src={imgUrl + current.url} className={styles.detailImg} alt="img" />
          <Row className="marginTop textRight">
            <Button type="primary" onClick={() => router.go(-1)}>
              返回
            </Button>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Detail;
