import React from "react";
import { connect } from "dva";
import { Link } from "dva/router"
import { ListView, Icon, NavBar, SearchBar, Toast, Tabs } from "antd-mobile";
import styles from "./index.less";
import Util from "../../utils/util";
import Storage from "../../utils/storage"
import List from '../../components/List'
import MyDreamList from './MyDreamList'
import UserList from "./UserList";
import NavBarPage from "../../components/NavBar"

class Index extends React.Component {
  constructor(props, context) {
    super(props, context);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });


    this.state = {
      dataSource,
      list: [],
      isLoading: false,
      height: document.documentElement.clientHeight - 100,
      currentPage: 1,
      keyword: '',
      currentTab: 0,

      isMe: this.props.location ? this.props.location.query.isMe : false,
    };
  }


  componentWillMount() {
    // 如果已有关键词，则按照关键词开始搜索
    const keyword = Storage.get('keyword');
    if (keyword) {
      this.onSearch(keyword);
    } else {
      if (this.state.isMe) {
        this.props.dispatch({ type: 'search/searchMy', payload: { 'keyword': '', 'is_me': true, 'page': 1 } });
      }
    }
  }

  componentDidMount(){
    this.autoFocusInst.focus();
  }

  componentUpdateMount() {
    this.setState({
      height: document.documentElement.clientHeight - 100
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchList == null) return;

    let hei = document.documentElement.clientHeight - 100;

    if (this.state.list !== nextProps.searchList) {
      if (this.state.currentPage == 1) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows([]),
          list: [...nextProps.searchList],
          height: hei,
        })
      } else {
        this.setState({
          list: [...this.state.list, ...nextProps.searchList],
          height: hei
        });
      }

      setTimeout(() => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.state.list),
          isLoading: false,
          height: hei
        });
      }, 500)
    }
  }

  // 拉到底部刷新
  onEndReached = (event) => {
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }

    const that = this;
    this.setState({
      isLoading: true,
      currentPage: that.state.currentPage + 1
    });

    this.props.dispatch({ type: 'search/search', payload: { 'keyword': that.state.keyword, 'is_me': false, page: that.state.currentPage } });
  }

  // 搜索
  onSearch = (value) => {
    this.setState({
      keyword: value,
      isLoading: true,
      currentPage: 1,
      //currentTab: 0,
    });

    // 只搜索我自己的梦境
    if (this.state.isMe) {
      this.props.dispatch({ type: 'search/searchMy', payload: { 'keyword': value, 'is_me': true, 'page': 1 } });
    }
    else {
      switch(this.state.currentTab){
        case 0:
          this.props.dispatch({ type: 'search/search', payload: { 'keyword': value, 'is_me': false, 'page': 1 } });
          break;
        case 1:
          this.props.dispatch({ type: 'search/searchMy', payload: { 'keyword': value, 'is_me': true, 'page': 1 } });
          break;
        case 2:
          this.props.dispatch({ type: 'search/searchUsers', payload: { 'uname': value, 'page': 1 } });
          break;
      }
    }
  }

  // 清除keyword记录
  onCancel = () => {
    this.setState({
      keyword: '',
    });

    Storage.remove('keyword');
  }

  render() {
    const tabs = [
      {
        title: <b className={styles.colorBlack}>梦境</b>
      },
      {
        title: <b className={styles.colorBlack}>我的</b>
      },
      {
        title: <b className={styles.colorBlack}>用户</b>
      }
    ];

    const tabsMe = [
      {
        title: <b className={styles.colorBlack}>我的梦境</b>
      }
    ];

    // 切换tab，搜索
    const handleChangeTab = (tab,index) => {
      this.setState({
        currentTab:index,
      });

      switch(index){
        case 0:
          this.props.dispatch({ type: 'search/search', payload: { 'keyword': this.state.keyword, 'is_me': false, 'page': 1 } });
          break;
        case 1:
          this.props.dispatch({ type: 'search/searchMy', payload: { 'keyword': this.state.keyword, 'is_me': true, 'page': 1 } });
          break;
        case 2:
          this.props.dispatch({ type: 'search/searchUsers', payload: { 'uname': this.state.keyword, 'page': 1 } });
          break;
      }
    }

    return (
      <div>
        {
          !this.state.isMe ?
            // all
            <div>
              <SearchBar
                className={styles.searchBar}
                style={{ padding: 0, margin: 0, textIndent: 1 }}
                placeholder="search"
                defaultValue={this.state.keyword}
                onClear={this.onCancel}
                ref={ref => this.autoFocusInst = ref}
                onSubmit={this.onSearch.bind(this)}
              />
              <div className={styles.chatWrap}>
                {
                  this.state.keyword !== ""?
                    <Tabs tabs={tabs} initalPage={this.state.currentTab} onChange={handleChangeTab} swipeable={false}>
                    <div>
                      <List
                        dataSource={this.state.dataSource}
                        isLoading={this.state.isLoading}
                        height={this.state.height}
                        onEndReached={this.onEndReached} />
                    </div>
                    <div>
                      <MyDreamList keyword={this.state.keyword} />
                    </div>
                    <div>
                      <UserList keyword={this.state.keyword} />
                    </div>
                  </Tabs>
                  :<p className={styles.txtCenter}>开始搜索吧~</p>
                }
              </div>
            </div>
            :
            // 我的
            <div>
              <NavBarPage iconType="back" title="搜索我的梦境" />
              <SearchBar
                style={{ padding: 0, margin: 0, textIndent: 0 }}
                placeholder="search"
                ref={ref => this.autoFocusInst = ref}
                defaultValue={this.state.keyword}
                onClear={this.onCancel}
                autoFocus={true}
                onSubmit={this.onSearch.bind(this)}
              />
              <div className={styles.chatWrap}>
                <MyDreamList keyword={this.state.keyword} />
              </div>
            </div>
        }
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    ...state.search
  };
}
export default connect(mapStateToProps)(Index);