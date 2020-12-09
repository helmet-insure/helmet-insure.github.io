// 创建  获取  删除cookie
// 创建cookie
export const setCookie = (name, value) => {
  const { location } = window;
  const exp = new Date();
  exp.setTime(exp.getTime() + 36500 * 24 * 60 * 60 * 1000);
  let domain = `.${location.host.split('.')[1]}.${location.host.split('.')[2]}`;
  domain = domain.split(':')[0];
  if (location.host.split('.')[3]) {
    document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()};path=${escape('/')}`;
  } else if (location.host.split('.')[2]) {
    document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()};domain=${domain};path=${escape('/')}`;
  } else if (!location.host.split('.')[2] && !location.host.split('.')[1]) {
    // 本地环境存储
    // document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()};path=${escape('/')}`;
    const localdomain = location.host.split(':')[0];
    if (localdomain) {
      document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()};domain=${localdomain};path=${escape('/')}`;
    } else {
      document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()};path=${escape('/')}`;
    }
  } else {
    // 当线上读取不到www时
    document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()};domain=.${location.host};path=${escape('/')}`;
  }
};
// 获取cookie
export const getCookie = (name) => {
  let arrd = null;
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  if (document.cookie.match(reg)) {
    arrd = document.cookie.match(reg);
    return unescape(arrd[2]);
  }
  return null;
};
// 删除cookie
export const removeCookie = (name) => {
  const { location } = window;
  const domain = `.${location.host.split('.')[1]}.${location.host.split('.')[2]}`;
  if (location.host.split('.')[3]) {
    document.cookie = `${name}="";expires=Thu, 01 Jan 1970 00:00:01 GMT;path=${escape('/')}`;
  } else if (location.host.split('.')[2]) {
    document.cookie = `${name}="";expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=${domain};path=${escape('/')}`;
  } else if (!location.host.split('.')[2] && !location.host.split('.')[1]) {
    // 本地环境删除
    document.cookie = `${name}="";expires=Thu, 01 Jan 1970 00:00:01 GMT;path=${escape('/')}`;
  } else {
    // 当线上读取不到www时
    document.cookie = `${name}="";expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.${location.host};path=${escape('/')}`;
    // document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/'
  }
};
