import React from 'react';
import Types from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Countdown from 'react-cntdwn';
import { updateUserActiveRoom } from '../redux/user';
import User from './user';
import { getChatUrl, getExpirationDate } from '../libs/utils';
import { CopyButton } from '@satori-sdk/component-library';
import iconTimer from '../images/icon-timer.svg';
import iconArrow from '../images/icon-arrow.svg';

class MembersList extends React.Component {
  componentWillMount() {
    this.props.updateUserActiveRoom(this.props.channel.get('name'));
  }

  renderUrl() {
    return document.location.href.replace('/members', '');
  }

  renderUsers(users) {
    return (
      <ul className="usersList">
        {users.valueSeq().map(
          user => (<User {...user} key={user.id} />)
        )}
      </ul>
    );
  }

  render() {
    const { channel, onExpiration, onlineUsers } = this.props;
    const channelName = this.props.channel.get('name');
    const expiration = channel.get('expiration');
    const url = this.renderUrl();
    const chatUrl = getChatUrl(channelName);

    return (
      <div className="roomPane membersList">
        <header className="roomPane-header">
          <Link to={`/channel/${channelName}`} key={channelName} className="close-link">
            <img src={iconArrow} className="icon-backArrow" alt="Back" />
          </Link>
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
        <p className="membersList-introText">
          Share this link to add people to the conversation <a href={url}>{url}</a>
        </p>
        <CopyButton copyContent={chatUrl} />
        {onlineUsers.isEmpty() ?
          <p className="membersList-empty">No other active users in your channel</p> :
          this.renderUsers(onlineUsers)}
      </div>
    );
  }
}

MembersList.propTypes = {
  channel: Types.object,
  user: Types.object.isRequired,
  updateUserActiveRoom: Types.func.isRequired,
  onExpiration: Types.func.isRequired,
  onlineUsers: Types.object.isRequired,
};

MembersList.displayName = 'MembersList';

export default connect(null, { updateUserActiveRoom })(MembersList);
