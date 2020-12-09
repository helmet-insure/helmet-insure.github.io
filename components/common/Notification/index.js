import Notification from './src/main.js';
// export default Notification;

Notification.install = Vue => {
  Vue.component(Notification.name, Notification);
};

export default Notification;
