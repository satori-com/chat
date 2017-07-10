import React from 'react';
import Types from 'prop-types';
import { SVGAvatar } from '@satori-sdk/component-library';

class User extends React.Component {
  render() {
    const { avatar, name, onUserClick } = this.props;
    return (
      <li className="usersList-user" onClick={e => onUserClick && onUserClick(e)}>
        <div className="usersList-avatar">
          <SVGAvatar
            avatar={avatar.avatar}
            color={avatar.color}
            width={60}
          />
        </div>
        <span className="usersList-name">
          {name}
        </span>
      </li>
    );
  }
}

User.propTypes = {
  avatar: Types.object.isRequired,
  name: Types.string.isRequired,
  id: Types.string.isRequired,
  onUserClick: Types.func,
};

export default User;

