/**
 * 搜索我的梦境
 * author: zch
 */
import React from "react";
import { connect } from "dva";
import { Link } from 'dva/router';
import { NavBar, Icon, ListView } from "antd-mobile";
import styles from "./MyDreamList.less";

import List from '../../components/List';

import ImageView from 'react-mobile-imgview';
import 'react-mobile-imgview/dist/react-mobile-imgview.css';


class MyDreamList extends React.Component {
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
			height: document.body.clientHeight - 89,
			currentPage: 1,

			// ImageView
			showViewer: false,
			imagelist: null,
			imagelistCurrent: 0,
		};
	}

	componentDidMount() {
		// 搜索自己的梦境
		// const keyword = this.props.keyword;
		// console.log(keyword);
		// if(keyword){
		//   this.props.dispatch({ type: 'search/searchMy', payload: { is_me: true,keyword:keyword,page:1 } });
		// }

	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.searchMyList == null) return;

		let hei = document.body.clientHeight - 95;

		if (this.state.list !== nextProps.searchMyList) {
			if (this.state.currentPage == 1) {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows([]),
					list: [...nextProps.searchMyList],
					height: hei,
				})
			} else {
				this.setState({
					list: [...this.state.list, ...nextProps.searchMyList],
					height: hei
				});
				//this.autoFocusInst.focus();
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



	// 拉倒底部，再次获取数据
	onEndReached = (event) => {
		if (this.state.isLoading && !this.state.hasMore) {
			return;
		}

		this.setState({ isLoading: true });
		this.state.currentPage = this.state.currentPage + 1;

		this.props.dispatch({ type: 'search/searchMy', payload: { is_me: true, keyword: this.props.keyword, page: this.state.currentPage } });
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

		let { list } = this.state;
		let { keyword } = this.props;

		if ( !keyword ) {
			return (
				<p className={styles.noContentTip}></p>
			)
		}

		if ( list.length <= 0 ) {
			return (
				<p className={styles.noContentTip}>没有此内容</p>
			)
		}

		return (
			<div>
				<List
					dataSource={this.state.dataSource}
					isLoading={false}
					height="calc(100vh - 89px)"
					onEndReached={this.onEndReached}
					imageView={this.imageViewClick}
				/>

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
		...state.search
	};
}
export default connect(mapStateToProps)(MyDreamList);
