import React from 'react';
import Types from 'prop-types';
import { SatoriLogo, GitHubButton, SignUpButton } from '@satori-sdk/component-library';

class AppContainer extends React.Component {
  render() {
    return (
      <div className="appContainer">
        <div className="headerBar">
          <SatoriLogo />
          <div className="headerBar-nav ">
            <GitHubButton projectUrl="https://github.com/satori-com/chat"/>
            <SignUpButton />
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

AppContainer.propTypes = {
  children: Types.object,
};

export default AppContainer;
