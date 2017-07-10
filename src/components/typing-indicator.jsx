import React from 'react';
import Types from 'prop-types';
import classNames from 'classnames';

class TypingIndicator extends React.Component {
  getTypingUsers() {
    const { onlineUsers } = this.props;
    return onlineUsers.filter(u => !!u.isTyping);
  }

  getFormattedNames(users) {
    const typingUsers = users.toIndexedSeq().toArray().map(u => u.name);
    const lastUser = typingUsers.pop();
    if (typingUsers.length === 0) {
      return lastUser;
    } else if (typingUsers.length > 2) {
      return 'Several people';
    } else {
      return `${typingUsers.join(', ')} and ${lastUser}`;
    }
  }

  render() {
    const typingUsers = this.getTypingUsers();
    return (
      <div className={classNames('typing-indicator', {'typing-indicator--hidden': typingUsers.size <= 0})}>
        {this.getFormattedNames(typingUsers)} {typingUsers.size === 1 ? 'is' : 'are' } typing...
      </div>
    );
  }
}

TypingIndicator.propTypes = {
  onlineUsers: Types.object.isRequired,
};

TypingIndicator.displayName = 'TypingIndicator';

export default TypingIndicator;
