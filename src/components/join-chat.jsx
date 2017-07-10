import React, { Component } from 'react';
import Types from 'prop-types';
import { connect } from 'react-redux';
import { OrderedMap } from 'immutable';
import { routerActions } from 'react-router-redux';
import { createUser } from '../redux/user';
import JoinChatForm from './join-chat-form';
import chatLogo from '../images/chat-logo.svg';
import { getAvatar } from '../libs/utils';

class JoinChat extends Component {
  constructor(props) {
    super(props);

    this.onSubmitHandler = this._onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { channelName, replace, userName } = nextProps;
    if (userName) {
      replace(`/channel/${channelName}`);
    }
  }

  _onSubmit(values) {
    const { createUser } = this.props;
    const name = values.userName;

    createUser({ avatar: getAvatar(), name });
  }

  render() {
    const { channelExpiration, channelStatus } = this.props;
    return (
      <article className="joinChatChannel">
        <header>
          <img src={chatLogo} alt="Satori Chat Logo" />
          <h1 className="joinChatChannel-welcome">Welcome</h1>
        </header>
        <JoinChatForm
          expiration={channelExpiration}
          status={channelStatus}
          onSubmit={this.onSubmitHandler}
        />
      </article>
    );
  }
}

JoinChat.propTypes = {
  channelExpiration: Types.number,
  channelStatus: Types.string.isRequired,
  channelTopic: Types.string.isRequired,
  replace: Types.func.isRequired,
  userName: Types.string,
};

function mapStateToProps(state, ownProps) {
  const channel = state.channels.get(ownProps.params.channelName) || new OrderedMap();

  return {
    channelExpiration: channel.get('expiration'),
    channelName: ownProps.params.channelName,
    channelStatus: channel.get('status'),
    channelTopic: channel.get('topic'),
    userName: state.me.get('name'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createUser: userName => dispatch(createUser(userName)),
    replace: path => dispatch(routerActions.replace(path)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinChat)
