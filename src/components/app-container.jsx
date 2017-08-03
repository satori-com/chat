import React from 'react';
import Types from 'prop-types';
import { AppShell, AppHeader } from '@satori-sdk/component-library';

class AppContainer extends React.Component {
  render() {
    return (
      <AppShell>
        <AppHeader
          hostUrl="https://www.satori.com"
          projectUrl="https://github.com/satori-com/chat"
        />
        <main>
          {this.props.children}
        </main>
      </AppShell>
    );
  }
}

AppContainer.propTypes = {
  children: Types.object,
};

export default AppContainer;
