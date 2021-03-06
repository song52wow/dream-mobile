/**
 * 收藏梦境表
 * author: zch
 */
import React from "react";
import { connect } from "dva";
import { Link } from 'dva/router';
import { browserHistory } from 'react-router';
import { List, NavBar, Tabs, Icon, ListView } from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import styles from "./collectList.less";
import Util from "../../../utils/util";
import NavBarPage from "../../../components/NavBar"
import ListPage from '../../../components/List'

import ImageView from 'react-mobile-imgview';
import 'react-mobile-imgview/dist/react-mobile-imgview.css';


class collectList extends React.Component {
  constructor(props, context) {
    super(props, context);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource,
      list: [],
      isLoading: true,
      height: document.body.clientHeight - 95,
	  currentPage: 1,

	  // ImageView
	  showViewer: false,
	  imagelist: null,
	  imagelistCurrent: 0,
    };
  }

  componentDidMount() {
    // 获取梦境
    this.props.dispatch({ type: 'home/colletDreamList', payload: {page: 1 } });
  }

  componentWillReceiveProps(nextProps) {

    if (this.state.list !== nextProps.collectDreamList) {

      this.setState({
        list: [...this.state.list, ...nextProps.collectDreamList],
      })

      setTimeout(() => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.state.list),
          isLoading: false,
        });
      }, 500)
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  // 拉倒底部，再次获取数据
  onEndReached = (event) => {
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }

    this.setState({ isLoading: true });
    this.state.currentPage = this.state.currentPage + 1;

    this.props.dispatch({ type: 'home/colletDreamList', payload: { page: this.state.currentPage } });
  }

  // imageView
	imageViewClick = (data) => {
		this.setState({
			showViewer: data.showViewer,
			imagelist: data.imagelist,
			imagelistCurrent: data.imagelistCurrent,
		})
	}
	closeImageView = () => {
		this.setState({
			showViewer: false,
		})
	}


  render() {

    return (
      <div className={styles.dreamWrap}>
        {
          this.state.list && this.state.list.length > 0 ?
              /* <ListView
              ref={el => this.lv = el}
              dataSource={this.state.dataSource}
              renderFooter={() => (<div style={{ padding: 5, textAlign: 'center' }}>
                {this.state.isLoading ? "加载中..." : <span className={styles.f12}>我是有底线的</span>}
              </div>)}
              renderRow={this.row}
              renderSeparator={separator}
              className="am-list"
              pageSize={4}
              useBodyScroll
              onScroll={() => { console.log('scroll'); }}
              scrollRenderAheadDistance={500}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={10}
            /> */
             <ListPage
                dataSource={this.state.dataSource}
                isLoading={this.state.isLoading}
                onEndReached={this.onEndReached}
                isUseBodyScroll={true}
				isShare={false}
				imageView={this.imageViewClick}
              />
            : <div style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: 30 }}>您还没有收藏梦境喔</div>
		}
			{
				this.state.showViewer &&
				<ImageView
					imagelist={this.state.imagelist}
					current={this.state.imagelistCurrent}
					close={this.closeImageView}
				/>
			}
      </div>

    )
  }

}

function mapStateToProps(state) {
  return {
    ...state.home
  };
}
export default connect(mapStateToProps)(collectList);
