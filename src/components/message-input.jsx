import React from 'react';
import Types from 'prop-types';
import uuid from 'uuid';
import ContentEditable from 'react-contenteditable';
import { ShareContainer } from '@satori-sdk/component-library';
import shareIcon from '../images/icon-share.svg';
import { stripHtml, getTimestampNow } from '../libs/utils';

class MessageInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      messageText: '',
      messageId: uuid(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.botSelectorActive && !nextProps.botSelectorActive) {
      this.setState({ messageText: '' });
    }
  }

  _sendMessage(text) {
    const trimmedText = stripHtml(text).trim();
    if (trimmedText === '') {
      return this._startNewMessage();
    }

    const id = this.state.messageId;
    const createdAt = this.state.createdAt || getTimestampNow();
    this.props.onSendMessage({ id, createdAt, text: trimmedText });
    this._startNewMessage();

    if (!this.state.createdAt) {
      this.setState({ createdAt });
    }
  }

  _startNewMessage() {
    this.setState({
      messageId: uuid(),
      messageText: '',
      createdAt: undefined,
    });
  }

  _onKeyDown(event) {
    if (event.key === 'Enter') {
      this._onSubmit(event);
    }
  }

  _onChange(event) {
    const text = event.target.value;
    if (text === '/') {
      this.props.onBotSelectorActivate();
    }
    this.setState({ messageText: text.slice(0, 3000) });
    this.props.onTyping();
  }

  _onSubmit(event) {
    event.preventDefault();
    this._sendMessage(this.state.messageText);
    this._startNewMessage();
  }

  render() {
    const { botSelectorActive, shareText, shareUrl } = this.props;

    return (
      <div>
        <form onSubmit={e => this._onSubmit(e)}>
          <ContentEditable
            className="messageInput"
            placeholder="Message..."
            html={this.state.messageText}
            onChange={e => this._onChange(e)}
            onKeyDown={e => this._onKeyDown(e)}
            disabled={botSelectorActive}
            ref={el => el && el.htmlEl.focus()}
          />
          <ShareContainer
            className="icon-share"
            placement="top"
            shareText={shareText}
            shareUrl={shareUrl}
          >
            <img
              src={shareIcon}
              alt="Share"
            />
          </ShareContainer>
          <input type="submit" className="messageInput-submit" value="" />
        </form>
      </div>
    );
  }
}

MessageInput.propTypes = {
  onSendMessage: Types.func.isRequired,
  onTyping: Types.func.isRequired,
  onBotSelectorActivate: Types.func.isRequired,
  botSelectorActive: Types.bool.isRequired,
  shareText: Types.string.isRequired,
  shareUrl: Types.string.isRequired,
};

MessageInput.defaultProps = {
  botSelectorActive: false,
};

MessageInput.displayName = 'MessageInput';

export default MessageInput;
