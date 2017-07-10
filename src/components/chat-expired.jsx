import React, { Component } from 'react';
import Types from 'prop-types';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import chatLogo from '../images/chat-logo-dark.svg';

class ChatExpired extends Component {
  render() {
    const { channelTopic } = this.props;

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
            Sorry this chat session has expired.
          </p>
        </section>
        <section className="createdChat-section createdChat-start">
          <p className="createdChat-expirationText">
            Create a new chat below
          </p>
          <button
            className="btn btn-primary createdChat-startButton"
            onClick={() => this.props.replace('/channel')}
          >
            New Chat
          </button>
        </section>
      </article>
    );
  }
}

ChatExpired.propTypes = {
  channelTopic: Types.string,
  channelName: Types.string,
  channelStatus: Types.oneOf([
    'created',
    'starting',
    'started',
    'expired',
    null,
  ]),
  params: Types.shape({
    channelName: Types.string.isRequired,
  }),
  replace: Types.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    replace: path => dispatch(routerActions.replace(path)),
  };
}

export default connect(null, mapDispatchToProps)(ChatExpired)
