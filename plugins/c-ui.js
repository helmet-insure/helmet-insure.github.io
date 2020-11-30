import Vue from 'vue';
import Notification from '~/components/common/Notification';
import Message from '~/components/common/Message';

Vue.use(Notification);
Vue.use(Message);
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
