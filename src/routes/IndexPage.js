import React from "react";
import { connect } from "dva";
import { NavBar, Icon, TabBar } from "antd-mobile";
import { browserHistory } from 'react-router';
import styles from "./IndexPage.less";
import ChartList from "./chat/chat-list";
import My from "./my/my";
import HomePage from "./home/index";
import IndexNotLogin from './home/index-not-login'
import Search from "./search/index";
import Fly from "./fly/index";
import Message from "./message/index";

import Storage from '../utils/storage';
const UID = Storage.get('uid');

class Home extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			selectedTab: sessionStorage.getItem("selectedTab") ? sessionStorage.getItem("selectedTab") : 'tab4',
			unread_count: Storage.get('unread_count')
		};
	}

	componentWillReceiveProps() {

		this.setState({
			unread_count: Storage.get('unread_count')
		})
	}


	onPress(val) {
		// 更新消息通知状态
		this.setState({
			unread_count: Storage.get('unread_count')
		});

		// 取消搜索框keyword
		Storage.set('keyword', null);

		// 切换页面
		sessionStorage.setItem("selectedTab", val);
		this.setState({ selectedTab: val });

		// 取消提醒状态
		if ( val == "tab3" ) {
			Storage.set('unread_count', 0);
		}

	}

	renderContent(pageText) {
		return (
			<div>{pageText}</div>
		)
	}


	render() {

		let { selectedTab, unread_count } = this.state;


		return (
			<div>
				{
					UID ?
						//已登录
						<div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
							<TabBar unselectedTintColor="#949494" tintColor="#33A3F4" barTintColor="white">
								<TabBar.Item
									icon={<i className='icon-user'></i>}
									selectedIcon={<i className='icon-user icon-idream-black'></i>}
									key="my"
									selected={ selectedTab === "tab4" }
									onPress={this.onPress.bind(this, 'tab4')} >
									{ selectedTab == "tab4" && <My /> }
								</TabBar.Item>

								<TabBar.Item
									key="Life"
									icon={<i className='icon-bell'></i>}
									selectedIcon={<i className='icon-bell icon-idream-black'></i>}
									selected={ selectedTab === "tab3" }
									dot={ unread_count > 0 }
									onPress={this.onPress.bind(this, 'tab3')}
									data-seed="logId">
									{ selectedTab == "tab3" && <Message /> }
								</TabBar.Item>

								<TabBar.Item
									icon={<i className='icon-search'></i>}
									selectedIcon={<i className='icon-search icon-idream-black'></i>}
									key="Koubei"
									selected={ selectedTab === "tab2" }
									onPress={this.onPress.bind(this, 'tab2')}
									data-seed="logId1">
									{ selectedTab == "tab2" && <Search /> }
								</TabBar.Item>

								<TabBar.Item
									icon={<i className='icon-globe'></i>}
									selectedIcon={<i className='icon-globe icon-idream-black'></i>}
									key="Friend1"
									selected={ selectedTab === "tab1" }
									onPress={this.onPress.bind(this, 'tab1')}>
									{ selectedTab == "tab1" && <HomePage /> }
								</TabBar.Item>
							</TabBar>
						</div>
						:
						//未登录
						// <IndexNotLogin />
						browserHistory.push('/login')
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
export default connect(mapStateToProps)(Home);
