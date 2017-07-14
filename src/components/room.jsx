import React from 'react';
import Types from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Countdown from 'react-cntdwn';
import classNames from 'classnames';
import uuid from 'uuid';
import { Console } from '@satori-sdk/component-library';
import MessageInput from './message-input';
import MessageHistory from './message-history';
import TypingIndicator from './typing-indicator';
import BotSelector from './bot-selector';
import rtm from '../libs/rtm';
import { updateMessage } from '../redux/channels';
import { updateUserActiveRoom, updateUserActivity } from '../redux/user';
import { getChatUrl, throttle, getTimestampNow, getExpirationDate } from '../libs/utils';
import iconHamburgerMenu from '../images/icon-hamburgerMenu.svg';
import iconTimer from '../images/icon-timer.svg';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.typingTimeout = null;
    this.sendMessageHandler = this._onSendMessage.bind(this);
    this.typingHandler = throttle(this._onTyping.bind(this), 300);
    this.botSelectorActivateHandler = this._onBotSelectorActivate.bind(this);
    this.botSelectorDeactivateHandler = this._onBotSelectorDeactivate.bind(this);
    this.botSelectorCompleteHandler = this._onBotSelectorComplete.bind(this);
    this.toggleConsoleHandler = this._onToggleConsole.bind(this);

    this.state = {
      hamburgerActive: false,
      botSelectorVisible: false,
      consoleActive: false,
    };
  }

  _onToggleConsole(e) {
    e.preventDefault();
    e.stopPropagation();

    const { consoleActive } = this.state;
    this.setState({ consoleActive: !consoleActive, hamburgerActive: false });
  }

  _onTyping() {
    this.props.updateUserActivity(true);
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(this.props.updateUserActivity.bind(null, false), 500);
  }

  _onSendMessage(message) {
    const user = this.props.user.toJS();
    this._send((channelName) => updateMessage(channelName, message, user));
  }

  _onBotSelectorActivate() {
    this.setState({ botSelectorVisible: true });
  }

  _onBotSelectorDeactivate() {
    this.setState({ botSelectorVisible: false });
  }

  _onBotSelectorComplete(data) {
    const user = this.props.user.toJS();
    const id = uuid();
    const createdAt = getTimestampNow();
    const message = { id, createdAt, text: data.questionText };
    this._send((channelName) => updateMessage(channelName, message, user, data), 'bot_message');
  }

  _send(messageFn, type='message') {
    const { channel } = this.props;
    const channelName = channel.get('name');

    rtm.publish('channel-manager', {
      type,
      metadata: {
        channelName,
      },
      payload: messageFn(channelName),
    });
  }

  componentWillMount() {
    this.props.updateUserActiveRoom(this.props.channel.get('name'));
  }

  render() {
    const { channel, onExpiration, onlineUsers, user } = this.props;
    const { botSelectorVisible } = this.state;
    const channelName = this.props.channel.get('name');
    const history = channel.get('history');
    const expiration = channel.get('expiration');
    const status = channel.get('status');
    const chatUrl = getChatUrl(channelName);

    return (
      <div className="roomPane-container">
        <div className="roomPane">
          <header className="roomPane-header">
            <div
              className={classNames('hamburgerMenu', { active: this.state.hamburgerActive })}
              onClick={() => this.setState({ hamburgerActive: !this.state.hamburgerActive })}
            >
              <img
                src={iconHamburgerMenu}
                className="icon-hamburgerMenu"
                alt="Chat Menu" />
            </div>
            <h2 className="roomPane-name">
              {channel.get('topic')} ({onlineUsers.size + 1})
            </h2>
            {expiration &&
              <div className="roomPane-countdown">
                <Countdown
                  targetDate={getExpirationDate(expiration)}
                  format={{hour: 'hh', minute: 'mm', second: 'ss'}}
                  timeSeparator={':'}
                  leadingZero={true}
                  onFinished={onExpiration} />
                <img src={iconTimer} className="iconTimer" alt="" />
              </div>}
          </header>
          <div className="hamburgerMenu-container">
            <Link
              to={`/channel/${channelName}/members`}
              key={channelName}
              className={classNames('hamburgerMenu-item', { active: this.state.hamburgerActive })}>
              Participants
            </Link>
            <a
              href="https://www.satori.com/apps/chat"
              className={classNames('hamburgerMenu-item', { active: this.state.hamburgerActive })}
              target="_blank"
              rel="noopener noreferrer">
              Learn More
            </a>
            <a
              href="#console"
              className={classNames('hamburgerMenu-item', { active: this.state.hamburgerActive })}
              onClick={this.toggleConsoleHandler}>
              Toggle message console
            </a>
          </div>
          <MessageHistory
            history={history}
            status={status}
            user={user}
            expiration={expiration}
          />
          <TypingIndicator
            onlineUsers={onlineUsers}
          />
          <footer className="roomPane-footer">
            <BotSelector
              isVisible={botSelectorVisible}
              onComplete={this.botSelectorCompleteHandler}
              onDeactivate={this.botSelectorDeactivateHandler}
            />
            <MessageInput
              shareText={chatUrl}
              shareUrl={chatUrl}
              onSendMessage={this.sendMessageHandler}
              onTyping={this.typingHandler}
              onBotSelectorActivate={this.botSelectorActivateHandler}
              botSelectorActive={botSelectorVisible}
            />
          </footer>
        </div>
        {
          this.state.consoleActive &&
          <Console
            className="console"
            message={history.last()}
          />
        }
      </div>
    );
  }
}

Room.propTypes = {
  channel: Types.object,
  user: Types.object.isRequired,
  onExpiration: Types.func.isRequired,
  updateUserActiveRoom: Types.func.isRequired,
  updateUserActivity: Types.func.isRequired,
  onlineUsers: Types.object.isRequired,
};

Room.displayName = 'Room';

export default connect(null, { updateUserActiveRoom, updateUserActivity })(Room);
