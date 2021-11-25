import { Typography, Button } from '@material-ui/core';
import _history from '_history';

const goToPage1 = () => _history.push('/');

function Page2() {
  return (
    <>
      <Typography>Page 2</Typography>
      <Button variant="outlined" size="small" color="primary" onClick={goToPage1}>Got to page 1</Button>
    </>
  );
}

export default Page2;
