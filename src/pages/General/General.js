/*
 * @Descripttion:
 * @Author: sunft
 * @Date: 2020-04-29 13:56:15
 * @LastEditTime: 2020-06-17 11:37:44
 * 图表使用ant design pro封装的图表，也有使用bizcharts
 * ant design pro 图表预览地址：https://v2-pro.ant.design/components/charts-cn
 */
import React from 'react';
import { Row, Col, Avatar, Card, Button, Tree, Divider, Icon, Tooltip as Info } from 'antd';
import numeral from 'numeral';
import { connect } from 'dva';
import router from 'umi/router';
import { Chart, Geom, Axis, Tooltip, Coord, Legend } from 'bizcharts';
// ant design pro 的图表组件
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field, yuan } from '@/components/Charts';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import request from '@/utils/request';
import { Link } from 'umi';
import styles from './General.less';

const cols = {
  amount: {
    min: 0,
  },
  num: {
    min: 0,
  },
  time: {
    // 坐标轴两端空白
    range: [0.05, 0.95],
  },
};

const { Meta } = Card;
const { TreeNode } = Tree;
const tabList = [
  {
    key: 'tab1',
    tab: '交易额',
  },
  {
    key: 'tab2',
    tab: '交易笔数',
  },
];
// 区域图数据
const visitData = [];
const beginDay = new Date().getTime();
for (let i = 0; i < 20; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: Math.floor(Math.random() * 100) + 10,
  });
}

const pieData = [
  { item: '事例一', count: 40, percent: 0.4 },
  { item: '事例二', count: 21, percent: 0.21 },
  { item: '事例三', count: 17, percent: 0.17 },
  { item: '事例四', count: 13, percent: 0.13 },
  { item: '事例五', count: 9, percent: 0.09 },
];

const linkToSetting = () => {
  router.push('/EditPassword');
};

const Description = props => {
  return (
    <div>
      <p>上次登录时间：{props.time ? moment(props.time).format('YYYY-MM-DD HH:mm:ss') : '无'}</p>

      <Button type="primary" onClick={linkToSetting}>
        安全设置
      </Button>
      <Button
        type="primary"
        style={{
          marginLeft: '20px',
        }}
        onClick={props.onLogout}
      >
        退出
      </Button>
    </div>
  );
};

let salesData = [];

for (let i = 0; i < 30; i += 1) {
  salesData.push({
    day: moment()
      .subtract('days', i)
      .format('MM-DD'),
    value: Math.floor(Math.random() * 1000) + 200,
  });
}

salesData = salesData.reverse(); // 页面权限

@connect(({ login, menu, user }) => ({
  login,
  menu,
  user,
}))
class General extends React.PureComponent {
  state = {
    loading: false,
    currentTab: 'tab1',
    list: [],
  };

  static defaultProps = {
    user: {},
    merchant: {
      generalMerchInfo: {},
    },
  };

  componentDidMount() {
    this.getChartData();
  }

  // 请求曲线图数据
  getChartData = () => {
    // 如果你想模拟请求，url切换到/api/general/chartList
    request('/empty-item/general/chartList', {
      method: 'POST',
      data: JSON.stringify({}),
    }).then(res => {
      if (res && res.code === 'SUCCESS') {
        this.setState({
          list: res.data,
        });
      }
    });
  };

  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/logout',
    });
  };

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }

      return <TreeNode title={item.name} key={item.id} dataRef={item} />;
    });
  };

  onTabChange = key => {
    this.setState({ currentTab: key });
  };

  render() {
    const { loading, currentTab, list } = this.state;
    const { user } = this.props;
    const { currentUser } = user;

    return (
      <PageHeaderWrapper>
        <Row gutter={16}>
          <Col xl={8} lg={24} style={{ marginBottom: 20 }}>
            <Card
              style={{
                height: '210px',
              }}
              loading={loading}
            >
              <Row className={styles.myInfoHeader} />
              <Meta
                avatar={
                  <Avatar
                    size={64}
                    src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                  />
                }
                title={<span>你好！{currentUser.realName}</span>}
                description={
                  <Description onLogout={this.handleLogout} time={currentUser.loginDate} />
                }
              />
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default General;
