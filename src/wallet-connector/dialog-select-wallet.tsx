import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { WalletConnectorContext } from './context';
import { toKey } from './utilities';

const supportedWallets = ['MetaMask', 'WalletConnect'];

export function WalletConnectorDialog(props: { onClose: (_connectType: string) => void }) {
  return (
    <WalletConnectorContext.Consumer>
      {({ dialogOpen }) => (
        <Dialog onClose={props.onClose} open={dialogOpen}>
          <DialogTitle>Choose supported wallet</DialogTitle>
          <List sx={{ pt: 0 }}>
            {supportedWallets.map((item) => (
              <ListItem button onClick={() => props.onClose(toKey(item))} key={toKey(item)}>
                <ListItemAvatar>
                  <Avatar src={`/static/${toKey(item)}.png`}></Avatar>
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
