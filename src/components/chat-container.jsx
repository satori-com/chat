import React, { Component } from 'react';
import Types from 'prop-types';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { getOnlineUsersButMe, isChannelExpired, throttle } from '../libs/utils';

const mapStateToProps = (state) => {
  const { channels, me } = state;
  return {
    channels,
    me,
    onlineUsers: getOnlineUsersButMe(me, state.presence),
  };
};

class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.expirationHandler = this.onExpiration.bind(this);
    this.throttledRedirect = throttle(this._redirectToChannelIfNeeded.bind(this), 1000);
  }

  _redirectToChannelIfNeeded(props) {
    const channelName = props.params.channelName;
    const currentChannel = props.channels.get(channelName);

    if (!channelName) {
      return this.props.push('/channel');
    }

    if (currentChannel && !isChannelExpired(currentChannel)) {
      return;
    }
  }

  componentWillMount() {
    this.throttledRedirect(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.throttledRedirect(nextProps);
  }

  onExpiration() {
    this.props.push('/channel');
  }

  render() {
    const { children } = this.props;

    return (
      <div className="chat-container">
        {children && React.cloneElement(children, { onExpiration: this.expirationHandler })}
      </div>
    );
  }
}

ChatContainer.propTypes = {
  channels: Types.object.isRequired,
  onlineUsers: Types.object.isRequired,
  me: Types.object.isRequired,
  params: Types.object.isRequired,
  push: Types.func.isRequired,
  children: Types.object,
};

export default connect(mapStateToProps, { ...routerActions })(ChatContainer);
