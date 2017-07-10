import React, { Component } from 'react';
import Types from 'prop-types';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { OrderedMap } from 'immutable';
import { subscribeChatChannel } from '../redux/channels';
import ChatExpired from './chat-expired';
import Loading from './loading';

class ChatConnector extends Component {
  componentDidMount() {
    const { channelName, channelStatus, subscribeChatChannel } = this.props;

    if (!channelStatus) {
      subscribeChatChannel(channelName);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { channelStatus, replace } = nextProps;

    if (channelStatus === 'nonexistent') {
      replace('/channel');
    }
  }

  render() {
    const { currentChannel, channelStatus, children, subscriptionStatus, replace } = this.props;
    const channelTopic = currentChannel.get('topic');

    if (channelStatus === 'expired') {
      return (
        <ChatExpired
          channelName={currentChannel.get('name')}
          channelTopic={channelTopic}
          channelStatus={currentChannel.get('status')}
          replace={replace}
        />
      );
    }

    return (
      <div>
        {subscriptionStatus === 'subscribed' ? children : <Loading channelTopic={channelTopic} />}
      </div>
    );
  }
}

ChatConnector.propTypes = {
  params: Types.shape({
    channelName: Types.string.isRequired,
  }),
  replace: Types.func.isRequired,
  children: Types.element.isRequired,
};

function mapStateToProps(state, ownProps) {
  const channel = state.channels.get(ownProps.params.channelName) || new OrderedMap();

  return {
    currentChannel: channel,
    channelName: ownProps.params.channelName,
    subscriptionStatus: channel.get('subscriptionStatus'),
    channelStatus: channel.get('status'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    subscribeChatChannel: channelName => dispatch(subscribeChatChannel(channelName)),
    replace: path => dispatch(routerActions.replace(path)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatConnector)
