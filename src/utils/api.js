// let devApi = 'api',
// 	buildApi = 'http://api.idream.name/index.php?r=',
// 	xiaoyiwo = 'http://m.idream.site/index.php?r=';




// if (document.domain === 'www.idream.name') {
// 	devApi = buildApi
// }

// if (document.domain === 'api.idream.name') {
// 	devApi = buildApi
// }

// if (document.domain === 'm.idream.site') {
// 	devApi = xiaoyiwo
// }


// if (document.domain === '118.31.61.9') {
// 	devApi = 'http://118.31.61.9:7171/index.php?r='
// }




let devApi = '';
if ( document.domain.includes('idream') ) {
	devApi = 'http://mapi.idream.kim/index.php?r=';
} else {
	devApi = 'http://118.31.61.9:7171/index.php?r='
}




module.exports = {
	dream: {
		list: `${devApi}/feed/view`,
		search: `${devApi}/feed/search`,
		detail: `${devApi}/feed/info`,
		digg: `${devApi}/feed/updatedigg`,

		review: `${devApi}/feed/review`,
		del: `${devApi}/feed/del`,                // 删除梦境
		delReview: `${devApi}/feed/del-review`,   // 删除梦境评论

		collect: `${devApi}/wish/handle`,         // 梦境收藏
		collectList: `${devApi}/wish/list`,       // 梦境收藏列表

		setSecret: `${devApi}/feed/set-secret`,    // 梦境设为私密

		publish: `${devApi}/feed/publish`,        // 发梦
		uploadImg: `${devApi}/feed/upload-img`,   // 上传图片
		getTags: `${devApi}/feed/get-tags`,      // 获取自定义标签
		getTagFeedList: `${devApi}/feed/get-tag-feed-list`, // 根据tag获取文章列表
		getTopicList: `${devApi}/feed/get-topic-list`, // 根据话题获取文章列表



	},
	user: {
		login: `${devApi}/login/validate`,
		register: `${devApi}/login/register`,
		resetPassword: `${devApi}/login/resetpassword`,

		usersSearch: `${devApi}/users/users-search`,
		setSecret: `${devApi}/users/set-secret`,

	},
	my: {
		getUserHome: `${devApi}/users/get-user-home`,
		editUser: `${devApi}/users/edit-user`,

		opinion: `${devApi}/opinion/add`,
		loginout: `${devApi}/login/loginout`,

		setBlack: `${devApi}/users-black/set-black`,            // 添加黑名单
		delBlack: `${devApi}/users-black/del-black`,            // 删除黑名单
		getBlackList: `${devApi}/users-black/get-blacklist`,    // 黑名单列表

		setPassword: `${devApi}/users/change-pwd`,              // 修改密码
		sendEmailCode: `${devApi}/users/send-email-code`,       // 发送邮箱验证码
		setEmail: `${devApi}/users/change-email`,               // 修改登录邮箱


	},
	message: {
		getMessageList: `${devApi}/message/get-user-msg`,
		getNotice: `${devApi}/message/get-user-notice`,
		setNotice: `${devApi}/message/set-user-notice`,
	}

}
