import { useContext } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { blue, green, orange, red } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Info from '@mui/icons-material/Info';
import Error from '@mui/icons-material/Error';
import Warning from '@mui/icons-material/Warning';
import { WalletConnectorContext } from './context';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 300,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function ModalMessage(props: { title: string; type?: string; children: any }) {
  const context = useContext(WalletConnectorContext);

  const handleClose = () => {
    context.dispatch('close-modal', { modalOpen: false });
  };

  return (
    <>
      <Modal
        open={context.modalOpen}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <Typography variant="h6" sx={{ verticalAlign: 'center' }}>
            {' '}
            {((t) => {
              switch (t) {
                case 'error':
                  return <Error fontSize="large" sx={{ color: red[500] }}></Error>;
                case 'success':
                  return <CheckCircle fontSize="large" sx={{ color: green[500] }}></CheckCircle>;
                case 'warning':
                  return <Warning fontSize="large" sx={{ color: orange[500] }}></Warning>;
                default:
                  return <Info fontSize="large" sx={{ color: blue[500] }}></Info>;
              }
            })(props.type)}
            {` ${props.title}`}
          </Typography>
          <Typography textAlign="right"></Typography>
          {props.type === 'error' ? (
            <pre style={{ textAlign: 'left', overflowY: 'scroll', maxHeight: '200px', maxWidth: '300px' }}>
              {props.children}
            </pre>
          ) : (
            props.children
          )}
          <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
            <Grid item xs={3}>
              <Button fullWidth={true} variant="contained" onClick={handleClose}>
                Close
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
}
