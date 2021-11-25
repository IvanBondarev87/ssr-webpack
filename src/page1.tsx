import { Typography, Button } from '@material-ui/core';
import _history from '_history';

const goToPage2 = () => _history.push('/page2');

function Page1() {
  return (
    <>
      <Typography>Page 1</Typography>
      <Button variant="outlined" size="small" color="primary" onClick={goToPage2}>Got to page 2</Button>
      </>
  );
}

export default Page1;
