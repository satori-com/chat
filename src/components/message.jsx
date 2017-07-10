import React from 'react';
import moment from 'moment';
import Types from 'prop-types';
import { SVGAvatar } from '@satori-sdk/component-library';

// eslint-disable-next-line
const linkPattern = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g;
const emojiPattern = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;

class Message extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { isTyping: false };
  }

  static isLink(text) {
    return !!text.match(linkPattern);
  }

  _clearTypingTimer() {
    if (this.typingTimer != null) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
  }

  _setTypingTimerIfNeeded() {
    this._clearTypingTimer();
    this.typingTimer = setTimeout(
      () => this.setState({ isTyping: false }),
      this.props.typingInterval
    );
  }

  componentWillReceiveProps(nextProps) {
    this._clearTypingTimer();
    this.setState({ isTyping: false });
  }

  componentWillUnmount() {
    this._clearTypingTimer();
  }

  _renderTypingIndicator() {
    if (!this.state.isTyping) {
      return null;
    }
    return (<span className="typing-indicator">typing...</span>);
  }

  _format(date) {
    const today = moment();
    if ((today.dayOfYear() === date.dayOfYear()) && (today.year() === date.year())) {
      return date.format('LT');
    }
    if (today.year() === date.year()) {
      return date.format('MMM D');
    }
    return date.format('ll');
  }

  renderFormattedText() {
    let newText = this.props.message.text;

    if (newText.match(emojiPattern)) {
      newText = newText.replace(emojiPattern, (r) => " " + r + " ");
    }

    if (Message.isLink(newText)) {
      newText = newText.replace(linkPattern, (r) => {
        if (!/^(?:f|ht)tps?:\/\//.test(r)) {
          r = "http://" + r;
        }
        return `<a href="${r}" target="_blank">${r}</a>`;
      });

      return (
        <div dangerouslySetInnerHTML={{ __html: newText }} />
      )
    }

    return newText;
  }

  render() {
    const message = this.props.message;
    return (
      <li className="roomPane-message-li">
        <div className="roomPane-message-avatar">
          <SVGAvatar
            avatar={message.user.avatar.avatar}
            color={message.user.avatar.color}
            width={60}
          />
        </div>
        <div className="message">
          <div className="message-user">
            {message.user.name}
          </div>
          <span
            className="message-time">{this._format(moment(message.createdAt))}</span> {this._renderTypingIndicator()}
          <div className="message-text">
            {
              this.renderFormattedText(message.text)
            }
          </div>
        </div>
      </li>
    );
  }
}

Message.propTypes = {
  message: Types.object.isRequired,
  typingInterval: Types.number.isRequired,
};

Message.defaultProps = {
  typingInterval: 1000,
};

Message.displayName = 'Message';

export default Message;
