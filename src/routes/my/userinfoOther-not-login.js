import React from "react";
import { connect } from "dva";
import { Link } from 'dva/router';
import { browserHistory } from 'react-router';
import { List, NavBar, Tabs, Icon, ListView, ActionSheet } from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import Storage from '../../utils/storage';
import styles from "./userinfo.less";
import Util from "../../utils/util";
import NavBarPage from "../../components/NavBar"

import defaultAvatar from '../../assets/images/avatar.png'

// 登录id
const UID = Storage.get('uid');

function renderTabBar(props) {
	return (
		<Sticky>
			{({ style }) => <div
				style={{
					...style,
					zIndex: 1
				}}><Tabs.DefaultTabBar {...props} /></div>}
		</Sticky>
	);
}

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
	wrapProps = {
		onTouchStart: e => e.preventDefault(),
	};
}


class Userinfo extends React.Component {
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
			height: document.body.clientHeight * 3 / 4,
			currentPage: 1,
			hasMore: true,

		};

	}

	componentDidMount() {
		const uid = this.props.uid;
		if (uid) {
			// 如果是自己
			if (uid == UID) {
				//browserHistory.push('my/userinfo');
			} else {
				this.props.dispatch({
					type: 'my/getOtherInfo',
					payload: {
						uid: uid,
						page: 1
					},
					callback: (d) => {
						this.setData(d);
					}
				});
			}

		}
	}

	// 处理搜索数据
	setData = (data) => {

		const hei = document.body.clientHeight;

		// 不足10条，最后一页
		if (data.data.feed.length < 15) {
			this.setState({
				hasMore: false
			})
		}


		let { list } = this.state;

		let _list = list.concat(data.data.feed);

		this.setState({
			list: _list,
			dataSource: this.state.dataSource.cloneWithRows(_list),
			isLoading: false,
			height: hei,
			userinfo: data.data.user,
		});

	}


	// 行
	row = (rowData, sectionID, rowID) => {
		const obj = rowData;
		return (
			<div className={styles.item}>
				<div className={styles.head}>
					<div className={styles.img}>
						<img src={obj.avatar ? obj.avatar : defaultAvatar} alt={obj.uname} />
					</div>
					<span className={styles.name}>{obj.uname}</span>
					<span className={styles.time}>{obj.publish_time}</span>
				</div>
				<div className={styles.itemContent}>
					<Link to={{ pathname: "/home/detail", 'state': + obj.feed_id }}>
						<div className={styles.title}>
							{obj.title}
						</div>
						<div className={styles.des} dangerouslySetInnerHTML={{
							__html: obj.content
						}}></div>
					</Link>
				</div>
				<div className={styles.icons}>
					<span className={styles.praise}>
						{
							obj.hasDigg == 1 ? <i className='icon-heart icon-idream-small icon-idream-blue'></i> : <i className='icon-heart icon-idream-small'></i>
						}
						<label>{obj.digg_count > 0 ? obj.digg_count : null}</label>
					</span>
					<span className={styles.review}>
						<Link to={"/home/detail?id=" + obj.feed_id}>
							<i className='icon-comment icon-idream-small'></i>
							<label>{obj.comment_all_count > 0 ? obj.comment_all_count : null}</label>
						</Link>
					</span>
					<span>
						<i className='icon-forward icon-idream-small'></i>
					</span>

				</div>
			</div>

		);
	};

	// 拉到底部刷新
	onEndReached = (event) => {

		if (this.state.isLoading && !this.state.hasMore) {
			return;
		}

		let { currentPage } = this.state;

		this.setState({
			isLoading: true,
			currentPage: currentPage + 1,
		});

		this.props.dispatch({
			type: 'my/getOtherInfo',
			payload: {
				uid: this.props.uid,
				page: currentPage + 1,
			},
			callback: (d) => {
				this.setData(d);
			}
		});
	}

	// 拉黑
	addBlackList = () => {
		const BUTTONS = ['拉黑', '取消'];
		ActionSheet.showActionSheetWithOptions({
			options: BUTTONS,
			cancelButtonIndex: BUTTONS.length - 1,
			destructiveButtonIndex: BUTTONS.length - 2,
			message: null,
			maskClosable: true,
			wrapProps,
		},
			(buttonIndex) => {
				if (buttonIndex === 0) {
					this.props.dispatch({
						type: 'my/setBlack', payload: { 'black_uid': this.props.location.state }
					});
				}
				else if (buttonIndex === 1) {
				}
			});
	}

	render() {


		const separator = (sectionID, rowID) => (
			<div
				key={`${sectionID}-${rowID}`}
				style={{
					backgroundColor: '#eee',
					height: 1,
					borderTop: '0px solid #ECECED',
					borderBottom: '0px solid #ECECED',
				}}
			/>
		);
		const uname = this.props.otherInfo ? this.props.otherInfo.uname : null;
		const tabs = [
			{
				title: <b className={styles.colorBlack}> {uname}的梦</b>
			}
		];

		return (
			<div className={styles.userinfoWrap}>
				<NavBarPage iconType="back" isLogin='true' isFixed="true" title={uname} />
				{
					this.props.otherInfo ?
						<div className={styles.userinfo}>
							<div className={styles.title}>
								<div className={styles.img}>
									<img src={this.props.otherInfo.avatar ? this.props.otherInfo.avatar : defaultAvatar} alt={this.props.otherInfo.uname} />
								</div>
								<div>
									<b>{this.props.otherInfo.uname}</b>
								</div>
							</div>
							<div className={styles.opinion}>{this.props.otherInfo.intro}</div>
							<ul>
								<li><i className={styles.iconfont + ' icon-venus-mars'}></i><span>{this.props.otherInfo.sex}</span></li>
								<li><i className={styles.iconfont + ' icon-location'}></i><span>{this.props.otherInfo.location}</span></li>
								<li><i className={styles.iconfont + ' icon-briefcase'}></i><span>{this.props.otherInfo.job}</span></li>
								<li><i className={styles.iconfont + ' icon-clock'}></i><span>{this.props.otherInfo.age}</span></li>
							</ul>

						</div>
						: null
				}

				{/* 梦境列表 */}
				<div className={styles.dreamWrap}>
					<StickyContainer>
						{/* Tabs tabs={tabs} initalPage={'t2'} renderTabBar={renderTabBar} swipeable={false}*/}
							<div>
								<ListView
									ref={el => this.lv = el}
									dataSource={this.state.dataSource}
									renderFooter={() => (<div style={{ padding: 5, textAlign: 'center' }}>
										{this.state.isLoading ? "读取中" : null}
									</div>)}
									renderRow={this.row}
									renderSeparator={separator}
									className="am-list"
									pageSize={4}
									useBodyScroll
									onScroll={() => { }}
									scrollRenderAheadDistance={500}
									onEndReached={this.onEndReached}
									onEndReachedThreshold={10}
								/>
							</div>
						{/* Tabs */}
					</StickyContainer>
				</div>
			</div>
		)
	}

}

function mapStateToProps(state) {
	return {
		...state.my
	};
}

export default connect(mapStateToProps)(Userinfo);
