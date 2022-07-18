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
import { IconButton } from '@mui/material';

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

  function isHidden(id) {
    if (activePage === id) {
      return false;
    }
    return true;
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
          <Typography paragraph>
            This will be the Settings page of my App
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
