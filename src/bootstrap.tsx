import ReactDOM from 'react-dom';
import AppProvider from './AppProvider';
import Routing from 'routing';

const main = (
  <AppProvider>
    <Routing />
  </AppProvider>
);

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.hydrate(
    main,
    document.getElementById('main-container'),
    () => {
      const serverStyles = document.getElementById('server-styles');
      if (serverStyles != null) document.head.removeChild(serverStyles);
    }
  );
});
