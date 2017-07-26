import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import configureStore from './redux/configureStore';
import { createRouter } from './routes';
import './styles/main.css';
import rtm from './libs/rtm';

const history = browserHistory;

const store = configureStore({
  history,
});

// initialize all RTM Service subscriptions
rtm.initSubscriptions(store);

// bind the root react component to the DOM element
ReactDOM.render(
    createRouter(store, history),
    document.getElementById('app-root'),
);
