// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import ElementUI from 'element-ui'
// import Resource from 'vue-resource'
import { Dialog, 
  Menu,
  Table,
  Form,
  TabPane,
  Upload,
  Container,
  Header,
  Aside,
  Loading,
  Message,
  FormItem,
  Select,
  Input,
  Button,
  Option,
  DatePicker,
  TimePicker,
  InputNumber,
  MessageBox,
  MenuItem,
  Submenu,
  MenuItemGroup,
  Main,
  TableColumn,
  Col,
  Row} from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/login.css'
import './assets/css/main.css'


import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Table)
Vue.use(Form)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(InputNumber)
Vue.use(TabPane)
Vue.use(Upload)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Main)
Vue.use(TableColumn)
Vue.use(Col)
Vue.use(Row)
// Vue.use(Loading.directive)
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$message = Message;
// Vue.use(ElementUI)
// Vue.use(Resource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
