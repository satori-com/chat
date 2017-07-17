import React, { Component } from 'react';
import Types from 'prop-types';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import ChatContainer from './chat-container';
import Room from './room';
import { getOnlineUsers } from '../libs/utils';

const mapStateToProps = (state) => {
  const { channels, me } = state;
  return {
    channels,
    me,
    onlineUsers: getOnlineUsers(me, state.presence),
  };
};

class Chat extends Component {
  render() {
    const { onlineUsers } = this.props;
    const { channelName } = this.props.params;

    const currentChannel = this.props.channels.get(channelName);

    return (
      <ChatContainer {...this.props}>
        { currentChannel &&
        <Room
          user={this.props.me}
          channel={currentChannel}
          key={channelName}
          onExpiration={this.expirationHandler}
          onlineUsers={onlineUsers}
        />
        }
      </ChatContainer>
    );
  }
}

Chat.propTypes = {
  channels: Types.object.isRequired,
  onlineUsers: Types.object.isRequired,
  me: Types.object.isRequired,
  params: Types.object.isRequired,
  push: Types.func.isRequired,
};

export default connect(mapStateToProps, { ...routerActions })(Chat);
