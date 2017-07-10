import React, { Component } from 'react';
import Types from 'prop-types';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { OrderedMap } from 'immutable';
import { CopyButton } from '@satori-sdk/component-library';
import { startChat } from '../redux/channels';
import { getChatUrl } from '../libs/utils';
import chatLogo from '../images/chat-logo-dark.svg';

class CreatedChat extends Component {
  constructor(props) {
    super(props);

    this.startChat = this._startChat.bind(this);
  }

  componentDidMount() {
    const { channelName, replace } = this.props;
    if (!channelName) {
      replace('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { channelName, channelStatus, replace } = nextProps;

    if (channelStatus === 'started') {
      replace(`/channel/${channelName}`);
    }
  }

  _startChat() {
    const { channelName, channelDuration, startChat } = this.props;

    return startChat(channelName, channelDuration);
  }

  render() {
    const { channelName, channelDuration, channelTopic } = this.props;
    const chatUrl = getChatUrl(channelName);

    return (
      <article className="createdChat">
        <header className="createdChat-section createdChat-header">
          <img
            className="createdChat-icon"
            src={chatLogo}
            alt="chat icon"
          />
          <h2 className="createdChat-title">{channelTopic}</h2>
        </header>
        <section className="createdChat-section createdChat-share">
          <p className="createdChat-shareText">
            Share this URL with anyone that you want to join your chat
          </p>
          <p className="createdChat-shareLink">
            {chatUrl}
          </p>
          <CopyButton copyContent={chatUrl} />
        </section>
        <section className="createdChat-section createdChat-start">
          <p className="createdChat-expirationText">
            Your chat will expire in {channelDuration} hour{channelDuration === 1 ? '' : 's'} starting when you click this button
          </p>
          <button
            className="btn btn-primary createdChat-startButton"
            onClick={this.startChat}
          >
            Start Chat
          </button>
        </section>
      </article>
    );
  }
}

CreatedChat.propTypes = {
  channelTopic: Types.string,
  channelName: Types.string,
  channelDuration: Types.number,
  channelStatus: Types.oneOf([
    'created',
    'starting',
    'started',
    null,
  ]),
  params: Types.shape({
    channelName: Types.string.isRequired,
  }),
  replace: Types.func.isRequired,
  startChat: Types.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const channel = state.channels.get(ownProps.params.channelName) || new OrderedMap();

  return {
    channelTopic: channel.get('topic'),
    channelName: channel.get('name'),
    channelDuration: channel.get('duration'),
    channelStatus: channel.get('status'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    startChat: (name, duration) => dispatch(startChat(name, duration)),
    replace: path => dispatch(routerActions.replace(path)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatedChat)
