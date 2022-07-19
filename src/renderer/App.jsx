import * as React from 'react';
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/system';

import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyIcon from '@mui/icons-material/Key';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FormatColorResetIcon from '@mui/icons-material/FormatColorReset';
import { Button, Grid, IconButton, TextField } from '@mui/material';

import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import ReactJkMusicPlayer from 'react-jinke-music-player';
import { PlexOauth, IPlexClientDetails } from 'plex-oauth';
import { shell } from 'electron';

const drawerWidth = 240;

const iconindex = {
  Home: <HomeIcon />,
  Library: <LibraryMusicIcon />,
  Playlists: <FeaturedPlayListIcon />,
  Settings: <SettingsIcon />,
};

function App() {
  const [activePage, setActivePage] = useState(0);

  if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
    console.log('🎉 Dark mode is supported');
  }

  const MediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  let activeTheme;

  if (MediaQuery.matches) {
    console.log('🎉 Dark mode is preferred');
    activeTheme = createTheme({
      palette: {
        mode: 'dark',
      },
    });
  } else {
    console.log('🎉 Light mode is preferred');
    activeTheme = createTheme({
      palette: {
        mode: 'light',
      },
    });
  }

  console.log('Theme');
  console.log(activeTheme);

  let clientId = localStorage.getItem('plex-client-id');
  if (!clientId) {
    const uuid = uuidv4();
    localStorage.setItem('plex-client-id', uuid);
    clientId = uuid;
  }

  const redirectURL = 'warden-ap://';

  let clientInformation = {
    clientIdentifier: clientId, // This is a unique identifier used to identify your app with Plex.
    product: 'Warden', // Name of your application
    device: 'darwin', // The type of device your application is running on
    version: '1', // Version of your application
    forwardUrl: 'http://127.0.0.1:1212', // Url to forward back to after signing in.
    platform: 'Web', // Optional - Platform your application runs on - Defaults to 'Web'
  };

  let plexOauth = new PlexOauth(clientInformation);

  // Get hosted UI URL and Pin Id
  plexOauth
    .requestHostedLoginURL()
    .then((data) => {
      let [hostedUILink, pinId] = data;

      console.log(hostedUILink); // UI URL used to log into Plex

      shell.openExternal(hostedUILink);
      /*
       * You can now navigate the user's browser to the 'hostedUILink'. This will include the forward URL
       * for your application, so when they have finished signing into Plex, they will be redirected back
       * to the specified URL. From there, you just need to perform a query to check for the auth token.
       * (See Below)
       */

      // Check for the auth token, once returning to the application
      plexOauth
        .checkForAuthToken(pinId)
        .then((authToken) => {
          console.log(authToken); // Returns the auth token if set, otherwise returns null

          // An auth token will only be null if the user never signs into the hosted UI, or you stop checking for a new one before they can log in
        })
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => {
      throw err;
    });

  function isHidden(id) {
    if (activePage === id) {
      return false;
    }
    return true;
  }

  function loginHidden() {
    return false;
  }
  return (
    <ThemeProvider theme={activeTheme}>
      <Box sx={{ display: 'flex', bgcolor: 'primary.main' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
          }}
        >
          <Toolbar>
            <Box></Box>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar>
            <Typography variant="h4" sx={{ flexGrow: 1 }} component="div">
              Warden
            </Typography>
          </Toolbar>
          <Divider />
          <List>
            {['Home', 'Library', 'Playlists', 'Settings'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => setActivePage(index)}>
                  <ListItemIcon>{iconindex[text]}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box
          hidden={isHidden(0)}
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
          label="Home"
        >
          <Toolbar />
          <Typography paragraph>
            This will be the Home page of my App
          </Typography>
        </Box>
        <Box
          hidden={isHidden(1)}
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
          label="Library"
        >
          <Toolbar />
          <Typography paragraph>
            This will be the Library page of my App
          </Typography>
        </Box>
        <Box
          hidden={isHidden(2)}
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
          label="Playlists"
        >
          <Toolbar />
          <Typography paragraph>
            This will be the Playlists page of my App
          </Typography>
        </Box>
        <Box
          hidden={isHidden(3)}
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
          label="Settings"
        >
          <Toolbar />
          <Typography sx={{ flexGrow: 1 }} component="div">
            Warden Unique Client ID:{clientId}
          </Typography>
          <Divider />
          <Box hidden={loginHidden()}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="plexUsername"
                  label="Plex Username"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="plexPassword"
                  variant="outlined"
                  label="Plex Password"
                  type="password"
                ></TextField>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={() => window.plex.login()} variant="outlined">
                  Login to Plex
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
