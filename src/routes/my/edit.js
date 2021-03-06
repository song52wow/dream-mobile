import React from "react";
import { connect } from "dva";
import {
	ImagePicker,
	List,
	Picker,
	DatePicker,
	InputItem,
	NavBar,
	Icon,
	Button,
	Radio,
	TextareaItem,
	Toast
} from "antd-mobile";

import { createForm } from 'rc-form';
import Storage from '../../utils/storage';
import styles from "./edit.less";
import Util from "../../utils/util";
import Cropper from 'react-cropper';
import NavBarPage from "../../components/NavBar"

import 'cropperjs/dist/cropper.css';

import defaultAvatar from '../../assets/images/avatar.png';

const Item = List.Item;
const Brief = Item.Brief;
const RadioItem = Radio.RadioItem;



const UID = Storage.get('uid');


// 性别列表
const sexs = [
	{
		value: 0,
		label: '男',
		icon: 'icon-mars',
	}, {
		value: 1,
		label: '女',
		icon: 'icon-venus',
	}, {
		value: 2,
		label: '男男',
		icon: 'icon-mars-double',
	}, {
		value: 3,
		label: '女女',
		icon: 'icon-venus-double',
	}, {
		value: 4,
		label: '异性',
		icon: 'icon-venus-mars',
	}, {
		value: 5,
		label: '双性',
		icon: 'icon-transgender'
	}, {
		value: 6,
		label: '无性',
		icon: 'icon-neuter'
	}
];


class Edit extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {

			// 用户信息
			user: {},

			sex: null,
			img_url: null,
			cropper_img: null,
			files: [],
			multiple: false,
			cropperVisible: false,
		}
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'my/getUserHome',
			payload: {
				uid: UID,
				page: 1
			},
			callback: (data) => {

				let { user } = data.data;

				this.setState({
					user: user,
					sex: user.sex
				})
			}
		});
	}

	// 裁剪函数
	_crop() {
		this.setState({
			cropper_img: this.refs.cropper.getCroppedCanvas().toDataURL()
		})
	}

	// 提交
	submit = () => {

		const name = document.getElementById('inputUsername').value;
		const profession = document.getElementById('inputProfession').value;
		const address = document.getElementById('inputAddress').value;
		const age = document.getElementById('inputAge').value;
		const intro = document.getElementById('inputIntroId').value;
		const sex = this.state.sex;

		Toast.loading('保存中', 5);

		this.props.dispatch({
			type: 'my/editUser', payload: {
				avatar: this.state.img_url,
				uname: name,
				sex: sex,
				location: address,
				job: profession,
				age: age,
				intro: intro,
			}
		})
	}

	// 选择图片
	onUpdateImg = () => {
		document.getElementById('fileId').click();
	}

	// 上传图片
	fileChange = (v) => {

		const that = this;
		let file = document.getElementById('fileId').files[0];

		//用size属性判断文件大小不能超过5M ，前端直接判断的好处，免去服务器的压力。
		if (file.size > 5 * 1024 * 1024) {
			Toast.info('图片过大');
			return;
		}

		var reader = new FileReader();
		reader.onload = function () {
			// 通过 reader.result 来访问生成的 base64 DataURL
			var base64 = reader.result;
			that.setState({
				img_url: base64,
				cropperVisible: true
			})

			//上传图片
			//base64_uploading(base64);
		}

		reader.readAsDataURL(file);
	}

	// 裁剪图片
	handleCropperImg = () => {
		this.setState({
			cropperVisible: false,
			img_url: this.state.cropper_img
		});

	}

	// 选择性别
	onSelectSex = (val) => {
		this.setState({ sex: val });
	}


	render() {

		const { files, user } = this.state;


		let _user = {
			...user,
		}

		if ( !_user.uid ) {
			return <div></div>;
		}

		return (
			<div className={styles.editWrap}>
				<NavBarPage iconType="back" isFly='false' title="编辑个人信息" isFixed="true" />
				<div className={styles.head}>
					<div className={styles.img}>
						<img src={this.state.img_url == null ? (_user.avatar || defaultAvatar) : this.state.img_url} onClick={this.onUpdateImg} />
					</div>
					<InputItem type="file" id="fileId" onChange={this.fileChange.bind(this)} />
				</div>


				<List>
					<InputItem
						id="inputUsername"
						clear
						defaultValue={_user.uname}
						placeholder="名称">
						<i className='icon-user'></i>
					</InputItem>
					<InputItem
						id="inputAddress"
						clear
						defaultValue={_user.location}
						placeholder="地域">
						<i className={styles.iconfont + ' icon-location'}></i>
					</InputItem>
					<InputItem
						id="inputProfession"
						clear
						defaultValue={_user.job}
						placeholder="职业习惯影响梦境">
						<i className={styles.iconfont + ' icon-briefcase'}></i>
					</InputItem>
					<InputItem
						type="number"
						maxLength={2}
						id="inputAge"
						clear
						defaultValue={parseInt(_user.age || 0)}
						placeholder="剩下多少生命">
						<i className={styles.iconfont + ' icon-clock'}></i>
					</InputItem>
				</List>

				<List renderHeader={() => '状态'} className={styles.iconWrap}>
					{sexs.map(i => (
						<RadioItem
							key={i.value}
							checked={this.state.sex === i.value}
							onChange={() => this.onSelectSex(i.value)}>
							<i className={styles.iconfont + ' icon-idream-blue ' + i.icon}></i>
							{i.label}
						</RadioItem>
					))}
				</List>

				<List renderHeader={() => ''}>
					<TextareaItem
						defaultValue={_user.intro}
						id="inputIntroId"
						rows={4}
						placeholder="你怎么看待梦境?"
						style={{ fontSize: 16, }}
					/>
				</List>

				{
					this.state.cropperVisible ?
						<div className={styles.cropperImg}>
							<div>
								<Cropper
									ref='cropper'
									src={this.state.img_url}
									className={styles.cropper}
									aspectRatio={10 / 10}
									guides={false}
									crop={this._crop.bind(this)}
								/>
								<Button type="primary" onClick={this.handleCropperImg} style={{ margin: '20px', backgroundColor: '#1F4BA5' }}>裁剪</Button>
							</div>

						</div> : null
				}


				<Button
					onClick={this.submit.bind(this)}
					type="primary"
					style={{
						margin: 20,
						backgroundColor: '#1F4BA5',
					}}>保存</Button>
			</div>
		)
	}

}

function mapStateToProps(state) {
	return {
		...state.my
	};
}

const form = createForm()(Edit)
export default connect(mapStateToProps)(form);
