import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { WalletConnectorContext } from './context';
import { toCamelCase, toKey } from './utilities';
import metaMaskIcon from '../static/metamask.png';
import walletConnectIcon from '../static/walletconnect.png';

const supportedWallets = ['MetaMask', 'WalletConnect'];

export function WalletConnectorDialog(props: { onClose: (_connectType: string) => void }) {
  const images = {
    metaMask: metaMaskIcon,
    walletConnect: walletConnectIcon,
  };

  return (
    <WalletConnectorContext.Consumer>
      {({ dialogOpen }) => (
        <Dialog onClose={props.onClose} open={dialogOpen}>
          <DialogTitle>Choose supported wallet</DialogTitle>
          <List sx={{ pt: 0 }}>
            {supportedWallets.map((item) => (
              <ListItem button onClick={() => props.onClose(toKey(item))} key={toKey(item)}>
                <ListItemAvatar>
                  <Avatar src={images[toCamelCase(item)]} />
                </ListItemAvatar>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Dialog>
      )}
    </WalletConnectorContext.Consumer>
  );
}

export default WalletConnectorDialog;
