import { createBrowserHistory } from 'history';

const _history = isServerRendering ? undefined : createBrowserHistory();

export default _history;
