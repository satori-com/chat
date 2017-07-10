function Satori() {
  this.client = rtm;
  this.cache = [];
}
Satori.prototype.publish = function (channel, payload) {
  this.client.publish(channel, payload);
};
Satori.prototype.write = function (channel, payload) {
    this.cache = payload;
};
Satori.prototype.read = function () {
    return this.cache;
};
var sat = new Satori();
function generateMessageId() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
}
function toArray(obj) {
  return Array.prototype.slice.call(obj || []);
}
function constructNumResponse(items, name, county) {
  var messageText = 'Currently, there ';
  messageText += items.length === 1 ? 'is ' : 'are ';
  messageText += items.length + ' ' + name + ' ';
  messageText += items.length === 1 ? 'alert ' : 'alerts ';
  messageText += name === 'local' ? 'in ' + county + ' county.' : 'in the US.';
  return messageText;
}
function computeAnswer(options, fipsCode, county) {
  var messageText = 'Unfortunately, I\'m unable to answer your question.';
  var weatherMsgCache = sat.read();
  console.info('cache size: ' + weatherMsgCache.length);
  if (options.questionId === 'floodAlerts') {
    var floodAlerts = weatherMsgCache.filter(function (el) {
      var expiryDate = new Date(el.expires);
      return (el.event === 'Flood Warning' || el.event === 'Flood Advisory') &&
        Date.now() < expiryDate;
    });
    messageText = constructNumResponse(floodAlerts, 'flood');
  } else if (options.questionId === 'localAlerts') {
    var paddedFips = '0' + fipsCode;
    var localAlerts = weatherMsgCache.filter(function (el) {
      var fipsCodes = el.geocode.value[0].split(' ');
      var expiryDate = new Date(el.expires);
      return fipsCodes.indexOf(paddedFips) !== -1 && Date.now() < expiryDate;
    });
    console.info('localAlerts size: ' + localAlerts.length);
    if (localAlerts.length === 0) return messageText;
    messageText = constructNumResponse(localAlerts, 'local', county);
    for (var i = 0; i < localAlerts.length; i++) {
      messageText += '  ALERT: ' + localAlerts[i].summary;
    }
  } else if (options.questionId === 'majorAlerts') {
    var majorAlerts = weatherMsgCache.filter(function (el) {
      var expiryDate = new Date(el.expires);
      return (el.severity === 'Major' || el.severity === 'Severe') && Date.now() < expiryDate;
    });
    messageText = constructNumResponse(majorAlerts, 'major severity');
  }
  return messageText;
}
function handleChannelManagerMsg(message) {
  if (!message.metadata) {
    return;
  }
  switch (message.type) {
    case 'bot_message':
       var uname = message.payload.message.user.name;
      console.info(uname + ' asking');
      if (message.payload.options.botId !== 'weatherBot') {
        return;
      }
      var fipsCode = message.payload.message.user.FIPS;
      var county = message.payload.message.user.County;
      message.type = 'message';
      message.payload.message.createdAt = Date.now();
      message.payload.message.id = generateMessageId();
      message.payload.message.user = {
        name: 'Weather Bot',
        avatar: {
          avatar: 'avatar1',
          color: 'orange'
        }
      };
      message.payload.message.text = computeAnswer(message.payload.options, fipsCode, county);
      console.info(uname + ' got ' + message.payload.message.text);
      return sat.publish('channel-manager', message);
    default:
      return;
  }
}
function handleWeatherMsg(message) {
  console.info('preread: got weather update: ' + JSON.stringify(message));
  console.info('preread: got weather update');
  var obj = sat.read();
  console.info('postread: got weather update');
  var weatherMsgCache = toArray(obj);
  weatherMsgCache.push(message);
  if (weatherMsgCache.length > 1000) {
    weatherMsgCache.splice(0, 1);
  }
  console.info('prewrite: cache size: ' + weatherMsgCache.length);
  sat.write('chat.weather', weatherMsgCache);
  console.info('postwrite: cache updated')
}
function channelManager(subId, message) {
  if (subId === 'channel-manager') {
    handleChannelManagerMsg(message);
  } else if (subId === 'NWS-All-USA-Alerts') {
    handleWeatherMsg(message);
  } else {
    console.info('unknown sub id', subId);
  }
}
function onMessage(subId, message) {
  channelManager(subId, message);
}
