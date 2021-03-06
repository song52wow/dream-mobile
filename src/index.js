import dva from 'dva';
import createLoading from 'dva-loading';  //加载

import {browserHistory} from 'dva/router';

// 1. Initialize
// const app = dva()
const app = dva({
    history: browserHistory
});

// 2. Plugins
app.use(createLoading({
	effects: true,
}));

// 3. Model
app.model(require('./models/login'));
app.model(require('./models/home'));
app.model(require('./models/my'));
app.model(require('./models/message'));
app.model(require('./models/fly'));
app.model(require('./models/search'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
