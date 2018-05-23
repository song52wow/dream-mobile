import React from "react";
import { connect } from "dva";
import {
	Modal,
	Tag,
	TextareaItem,
	Toast
} from "antd-mobile";

import styles from "./index.less";



function closest(el, selector) {
	const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
	while (el) {
		if (matchesSelector.call(el, selector)) {
			return el;
		}
		el = el.parentElement;
	}
	return null;
}




class TagModel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal1: false,
		};
	}


	onWrapTouchStart = (e) => {
		// fix touch to scroll background page on iOS
		if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
			return;
		}
		const pNode = closest(e.target, '.am-modal-content');
		if (!pNode) {
			e.preventDefault();
		}
	}


	showModal = key => (e) => {
		// 修复 Android 上点击穿透
		e.preventDefault();


		const { tags } = this.props;

		if ( tags.length >= 7 ) {
			Toast.info('最多只能添加7个标签', 1);
			return false;
		}

		this.setState({
			[key]: true,
		});

	}

	onClose = key => () => {
		this.setState({
			[key]: false,
		});
	}

	// 添加标签
	onAddTags = (event) => {

		const { tags } = this.props;
		const val = this.refs.inputTag.value;

		if (!tags.includes(val) && val) {
			this.props.onAddTag(val);
		}

		this.setState({
			modal1: false,
		});

	}

	// 选择标签
	onSelectTag = (t, val) => {
		this.props.onSelectTag(t, val);
	}


	render() {

		const { tags, selectTags } = this.props;

		return (
			<div>
				<p
					className={styles.tagWrap}
					onClick={this.showModal('modal1')}
				>
					<span className={styles.tagBtn}><i className={styles.iconfont}>&#xe804;</i> </span>
					<span className={styles.tagTip}>自定义标签(最多填写7个标签，每个标签最多7个中文字)</span>
				</p>


				<div style={{ margin: '10px 0 0 10px' }}>
					{
						tags.map((item, index) => (
							<Tag key={index} style={{ marginRight: 5, marginBottom: 5 }} selected={selectTags.contains(item)} onChange={this.onSelectTag.bind(this, item)}>{item}</Tag>
						))
					}
				</div>

				<Modal
					visible={this.state.modal1}
					transparent
					maskClosable={false}
					onClose={this.onClose('modal1')}
					footer={[{ text: '取消', onPress: () => { this.onClose('modal1')(); } }, { text: '确定', onPress: this.onAddTags }]}
					wrapProps={{ onTouchStart: this.onWrapTouchStart }}
				>
					<div style={{ minHeight: 50, textAlign: 'left' }}>
						<input type="text" placeholder="输入标签" ref="inputTag" className={styles.tagInput} />
					</div>
				</Modal>
			</div>
		)
	}
}


/**
 * 数组操作：判断元素是否在素组里面
 * @param  {[type]} val [元素1]
 * @return {[type]}     [description]
 */
Array.prototype.contains = function (val) {
	var len = this.length;
	while (len--) {
		if (this[len] === val) {
			return true;
		}
	}
	return false;
}


/**
 * 数组操作：获取元素下标
 * @param  {[type]} val [元素]
 * @return {[type]}     [description]
 */
Array.prototype.indexOf = function (val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
	}
	return -1;
};


/**
 * 数组操作：删除元素
 * @param  {[type]} val [元素]
 * @return {[type]}     [description]
 */
Array.prototype.remove = function (val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

export default TagModel;