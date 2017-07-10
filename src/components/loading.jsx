import React, { Component } from 'react';
import Types from 'prop-types';
import { Circle } from 'better-react-spinkit';
import chatLogo from '../images/chat-logo-dark.svg';

class Loading extends Component {
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
          <Circle
            className="loadingSpinner"
            color="#00A2EB"
            size={100}
          />
          <p className="createdChat-startingText">
            Starting session&hellip;
          </p>
        </section>
      </article>
    );
  }
}

Loading.propTypes = {
  channelTopic: Types.string,
};

export default Loading
