import modelExtend from 'dva-model-extend';
import { model } from './common.js';
import { hashHistory } from 'react-router';
import { getMessageList,setNotice,getNotice } from '../services/message';
import {setSecret } from '../services/user';
import Storage from '../utils/storage';
import { Toast } from 'antd-mobile';


export default modelExtend(model, {

	namespace: 'message',

	state: {

	},

	subscriptions: {
		setup({ dispatch, history }) {
			//dispatch({ type: 'message/getMessageList', payload: { page: 1 } });
		},
	},

	effects: {
		// 获取通知列表
		*getMessageList({ payload }, { call, put }) {
			const { data, code, msg } = yield call(getMessageList,payload);
			if (code == 200) {
				yield put({ type: 'updateState', payload: { msgList:data.msg } });
				if(data.count==0){
					Toast.info("目前您木有评论喔~",1);
				}
			}
		},

		// 获取设置信息
		*getNotice({ payload }, { call, put }) {
			yield put({ type: 'updateState', payload: { notice: null } });

			const { data, code, msg } = yield call(getNotice, payload);
			if (code == 200) {
				yield put({ type: 'updateState', payload: { notice:data} });
			}
		},

		// 设置通知信息
		*setNotice({ payload }, { call, put }) {
			const { data, code, msg } = yield call(setNotice, payload);
			if (code == 200) {
				Toast.info("已设置",1);
			}
    },

    // 设置隐私
		*setSecrets({ payload }, { call, put }) {
      const { data, code, msg } = yield call(setSecret, payload);
			if (code == 200) {
				Toast.info("设置成功",1);
			}
		},
	},
});