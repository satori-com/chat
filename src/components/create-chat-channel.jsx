import React, { Component } from 'react';
import Types from 'prop-types';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import shortid from 'shortid';
import CreateChatChannelForm from './create-chat-channel-form';
import { createChatChannel } from '../redux/channels';
import { createUser } from '../redux/user';
import rtm from '../libs/rtm';
import { getAvatar } from '../libs/utils';
import chatLogo from '../images/chat-logo.svg';

class CreateChatChannel extends Component {
  constructor(props) {
    super(props);

    this.onSubmitHandler = this._onSubmit.bind(this);
  }

  _onSubmit(values) {
    const topic = values.topic.trim();
    const creatorName = values.creatorName.trim();
    const channelName = shortid.generate();
    const duration = Number(values.duration.value);

    rtm.publish('channel-manager', {
      type: 'create_channel',
      metadata: {
        channelName,
        topic,
        duration
      },
    });

    this.props.createChatChannel({ topic, channelName, duration });
    if (this.props.me.get('name') !== creatorName) {
      this.props.createUser({ avatar: getAvatar(), name: creatorName });
    }

    this.props.replace(`/created-channel/${channelName}`);
  }

  render() {
    return (
      <div className="createChatChannel">
        <img src={chatLogo} alt="Satori Chat Logo" />
        <h1 className="createChatChannel-welcome">
          Welcome
        </h1>
        <CreateChatChannelForm
          onSubmit={this.onSubmitHandler}
        />
      </div>
    );
  }
}

CreateChatChannel.propTypes = {
  createChatChannel: Types.func.isRequired,
  replace: Types.func.isRequired,
};

function mapStateToProps(state) {
  return {
    me: state.me
  }
}

export default connect(mapStateToProps, {
  ...routerActions,
  createUser,
  createChatChannel,
})(CreateChatChannel)
