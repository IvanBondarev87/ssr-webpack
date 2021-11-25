import { StylesProvider } from '@material-ui/core/styles';
import { Router, StaticRouter } from 'react-router';

import _history from './_history';

interface AppProviderProps {
  children?: ReactNode;
  location?: string;
}

function AppProvider({ children, location }: AppProviderProps) {

  if (isServerRendering) return (
    <StaticRouter location={location}>
      <StylesProvider injectFirst>
        {children}
      </StylesProvider>
    </StaticRouter>
  );

  return (
    <Router history={_history}>
      <StylesProvider injectFirst>
        {children}
      </StylesProvider>
    </Router>
  );
}

export default AppProvider;
