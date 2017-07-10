import React, { Component } from 'react';
import Types from 'prop-types';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import ChatContainer from './chat-container';
import MembersList from './members-list';
import { getOnlineUsersButMe } from '../libs/utils';

const mapStateToProps = (state) => {
  const { channels, me } = state;
  return {
    channels,
    me,
    onlineUsers: getOnlineUsersButMe(me, state.presence),
  };
};

class Members extends Component {
  render() {
    const { channelName } = this.props.params;
    const { onlineUsers } = this.props;

    const currentChannel = this.props.channels.get(channelName);

    return (
      <ChatContainer {...this.props}>
        { currentChannel &&
        <MembersList
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

Members.propTypes = {
  channels: Types.object.isRequired,
  onlineUsers: Types.object.isRequired,
  me: Types.object.isRequired,
  params: Types.object.isRequired,
  push: Types.func.isRequired,
};

export default connect(mapStateToProps, { ...routerActions })(Members);
