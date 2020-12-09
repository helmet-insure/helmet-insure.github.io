// import Message from './src/main.js';
// export default Message;
import Message from './src/main.js';
// export default Notification;

Message.install = Vue => {
  Vue.component(Message.name, Message);
};

export default Message;
