import { getRandomAvatar, getRandomColor } from '@satori-sdk/component-library';

export function getTimestampNow() {
  return new Date().getTime();
}

export function getExpirationDate(expiration) {
  return new Date(expiration);
}

export function getOnlineUsersButMe(me, state) {
  const onlineUsers = state.get('users');
  let onlineUsersButMe = onlineUsers.filter(u => u.get('id') !== me.get('id'));
  const myActiveRoom = me.get('activeRoom');
  onlineUsersButMe = onlineUsersButMe.filter(u => myActiveRoom && (u.get('activeRoom') === myActiveRoom));
  return onlineUsersButMe.map((u) => {
    const { id, avatar, name, isTyping } = u.toJS();
    return { id, avatar, name, isTyping };
  });
}

export function isChannelExpired(channel) {
  if (!channel.get('expiration')) {
    return false;
  }
  return getTimestampNow() >= channel.get('expiration');
}

export function throttle(callback, limit) {
  let wait = false;
  return (...args) => {
    if (!wait) {
      callback.apply(this, args);
      wait = true;
      setTimeout(() => {
        wait = false;
      }, limit);
    }
  }
}

export function stripHtml(htmlString) {
  const tmp = document.createElement('div');
  tmp.innerHTML = htmlString;
  return tmp.textContent;
}

export function lowercaseFirst(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export function getChatUrl(channelName) {
  return `${document.location.origin}/channel/${channelName}`;
}

export function getAvatar() {
  return {
    avatar: getRandomAvatar(),
    color: getRandomColor(),
  };
}
