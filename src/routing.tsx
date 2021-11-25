import { Route, Switch } from 'react-router-dom';

import Page1 from './page1';
import Page2 from './page2';

const Routing = () => {

  return (
    <Switch>
      <Route exact path="/" component={Page1} />
      <Route exact path="/page2" component={Page2} />
    </Switch>
  );
};

export default Routing;
