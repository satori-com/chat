import React from 'react';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import Types from 'prop-types';

const mapStateToProps = state => ({
  me: state.me,
});

// layout is used for pages which require authentication
class AuthorizedLayout extends React.Component {
  _shouldRedirectToLogin(props) {
    const { me, location } = props;

    return location.pathname.includes('channel/') &&
      (me.isEmpty() || !me.get('name') || !me.get('id') || !me.get('avatar'));
  }

  _redirectToLoginPageIfNeeded(props) {
    if (this._shouldRedirectToLogin(props)) {
      const paths = props.location.pathname
        .replace(/\/$/, '') // removing trailing slash
        .split('/');
      const channelName = this._getChannelName(paths);
      this.props.replace({
        pathname: `/join-channel/${channelName}`,
      });
    }
  }

  _getChannelName(paths) {
    const lastPath = paths[paths.length - 1];
    return lastPath === 'members' ? paths[paths.length - 2] : lastPath;
  }

  componentWillReceiveProps(nextProps) {
    this._redirectToLoginPageIfNeeded(nextProps);
  }

  componentDidMount() {
    this._redirectToLoginPageIfNeeded(this.props);
  }

  render() {
    return !this._shouldRedirectToLogin(this.props) && this.props.children;
  }
}

AuthorizedLayout.propTypes = {
  replace: Types.func.isRequired,
  children: Types.object,
  me: Types.object.isRequired,
};

export default connect(mapStateToProps, { ...routerActions })(AuthorizedLayout);
