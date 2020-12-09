import { getProtocol, getMainHost } from "../assets/js/util";
let domain, protocol;

try {
  domain = getMainHost();
  protocol = getProtocol();
} catch(err) {}

export default {
  domain: domain,
  protocol: protocol,
  baseUrl: '/baseapi',
  // baseUrl: 'https://tronsage.trxage.io'
};
