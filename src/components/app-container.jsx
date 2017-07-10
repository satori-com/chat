import React from 'react';
import Types from 'prop-types';
import satoriLogo from '../images/satori-logo.png';

class AppContainer extends React.Component {
  render() {
    return (
      <div className="appContainer">
        <div className="headerBar">
          <img src={satoriLogo} className="headerBar-logo" alt="Satori Logo" />
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
