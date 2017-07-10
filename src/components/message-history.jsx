import React from 'react';
import Types from 'prop-types';
import debounce from 'lodash.debounce';
import Message from './message';
import { getTimestampNow } from '../libs/utils';

class MessageHistory extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isScrolledUp: false,
    };
  }

  componentDidMount() {
    this._scrollToBottom();
  }

  componentDidUpdate() {
    if (!this.state.isScrolledUp) {
      this._scrollToBottom();
    }
    this.scrollHandler = debounce(this.onScroll.bind(this), 100, { leading: true });
  }

  onScroll(e) {
    const { messages } = this.refs;
    const isScrolledUp = messages.scrollHeight - messages.scrollTop !== messages.offsetHeight;
    this.setState({ isScrolledUp });
  }

  calculateMinsRemaining(expiration) {
    const time = getTimestampNow();
    const remaining = Math.ceil((expiration - time) / (1000 * 60));

    return remaining;
  }

  formatTimeRemaining(expiration) {
    const remaining = Math.ceil(this.calculateMinsRemaining(expiration) / 60);
    const units = remaining === 0 || remaining > 1 ? 'hours' : 'hour';

    return remaining + ' ' + units;
  }

  renderWelcomeMessage(status, expiration) {
    if (status === 'created') {
      return (
        <div className="roomPane-introChat">
          <p>Welcome to Satori Chat!  The chat will begin when your moderator joins.</p>
          <p>You can use "/" to interact with Weather Streambot.</p>
          <div className="roomPane-introSeparator">Please Standby</div>
        </div>
      );
    } else if (status === 'started') {
      const minsRemaining = this.calculateMinsRemaining(expiration);
      const formattedTimeRemaining = this.formatTimeRemaining(expiration);

      if (minsRemaining <= 2) {
        return (
          <div className="roomPane-introChat">
            <p>Your session will expire in less than two minutes.</p>
            <div className="roomPane-introSeparator roomPane-introSeparator--long">Session expiring soon</div>
          </div>
        );
      } else {
        return (
          <div className="roomPane-introChat">
            <p>Welcome to Satori Chat!  This chat will expire in less than {formattedTimeRemaining}.  Your session is underway.</p>
            <p>You can use "/" to interact with Weather Streambot.</p>
            <div className="roomPane-introSeparator">Chat session start</div>
          </div>
        );
      }
    }
  }

  render() {
    const { status, expiration } = this.props;

    return (
      <div className="roomPane-messages" ref="messages" onScroll={this.scrollHandler}>
        {this.renderWelcomeMessage(status, expiration)}
        <ul className="roomPane-messages-list">
          {this.props.history.valueSeq().map(value => (<Message message={value} key={value.id} />))}
        </ul>
      </div>
    );
  }

  _scrollToBottom() {
    this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
  }
}

MessageHistory.propTypes = {
  history: Types.object.isRequired,
  status: Types.oneOf([
    'created',
    'started',
  ]),
};

export default MessageHistory
