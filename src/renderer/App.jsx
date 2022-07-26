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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Icon,
  IconButton,
  TextField,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import axios from 'axios';
import ReactJkMusicPlayer from 'react-jinke-music-player';
import XMLParser from 'react-xml-parser';
import ipaddr from 'ipaddr.js';
import { PlexAPIOAuth, PlexLogin, ValidatePlexAuthToken } from 'plex-api-oauth';

const drawerWidth = 240;

const iconindex = {
  Home: <HomeIcon />,
  Library: <LibraryMusicIcon />,
  Playlists: <FeaturedPlayListIcon />,
  Settings: <SettingsIcon />,
};

function App() {
  const [activePage, setActivePage] = useState(0);
  const [plexStateTracker, setPlexStateTracker] = useState(0);

  if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
    // console.log('🎉 Dark mode is supported');
  }

  const MediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  let activeTheme;

  if (MediaQuery.matches) {
    // console.log('🎉 Dark mode is preferred');
    activeTheme = createTheme({
      palette: {
        mode: 'dark',
      },
    });
  } else {
    // console.log('🎉 Light mode is preferred');
    activeTheme = createTheme({
      palette: {
        mode: 'light',
      },
    });
  }

  console.log('Theme');
  console.log(activeTheme);

  const PlexSession = new PlexAPIOAuth();
  PlexSession.LoadPlexSession();

  if (PlexSession.clientId === '' || PlexSession.clientId == null) {
    PlexSession.GenerateClientId();
  }
  console.log(PlexSession);

  PlexSession.SavePlexSession();

  // function plexLogin() {
  //   let plexOauth = new PlexOauth(clientInformation);
  //   // Get hosted UI URL and Pin Id

  //   plexOauth
  //     .requestHostedLoginURL()
  //     .then((data) => {
  //       let [hostedUILink, pinId] = data;

  //       openInNewTab(hostedUILink);

  //       console.log('Plex Auth URL:');
  //       console.log(hostedUILink); // UI URL used to log into Plex
  //       console.log('Plex Pin ID:');
  //       console.log(pinId);
  //       /*
  //        * You can now navigate the user's browser to the 'hostedUILink'. This will include the forward URL
  //        * for your application, so when they have finished signing into Plex, they will be redirected back
  //        * to the specified URL. From there, you just need to perform a query to check for the auth token.
  //        * (See Below)
  //        */

  //       // Check for the auth token, once returning to the application

  //       plexOauth
  //         .checkForAuthToken(pinId, 1000, 10)
  //         .then((authToken) => {
  //           console.log('Plex Auth Token:');
  //           console.log(authToken); // Returns the auth token if set, otherwise returns null
  //           if (authToken !== null) {
  //             validatePlexAuthToken(authToken);
  //           }

  //           // An auth token will only be null if the user never signs into the hosted UI, or you stop checking for a new one before they can log in
  //         })

  //         .catch((err) => {
  //           throw err;
  //         });
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // }

  // function validatePlexAuthToken(authToken) {
  //   axios({
  //     method: 'GET',
  //     url:
  //       'https://plex.tv/api/v2/user?' +
  //       require('qs').stringify({
  //         'X-Plex-Product': clientInformation.product,
  //         'X-Plex-Client-Identifier': clientId,
  //         'X-Plex-Token': authToken,
  //       }),
  //     headers: { accept: 'application/json' },
  //   })
  //     .then((response) => {
  //       console.log(response);
  //       console.log(response.status);
  //       if (response.status === 200) {
  //         let tempData = plexData;
  //         tempData.plexUserData = response.data;
  //         tempData.plexAuthToken = authToken;
  //         setPlexData(tempData);
  //         getPlexServers();
  //         getPlexLibraries();
  //         getPlexMusicLibraries();
  //         savePlexState();
  //       }
  //       if (response.status === 401) {
  //       }
  //     })
  //     .catch(function (error) {
  //       if (error.response) {
  //         // The request was made and the server responded with a status code
  //         // that falls out of the range of 2xx
  //         console.log(error.response.data);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //       } else if (error.request) {
  //         // The request was made but no response was received
  //         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //         // http.ClientRequest in node.js
  //         console.log(error.request);
  //       } else {
  //         // Something happened in setting up the request that triggered an Error
  //         console.log('Error', error.message);
  //       }
  //       console.log(error.config);
  //     });
  // }

  // function plexLogout() {
  //   localStorage.setItem('plex-database', null);
  //   setPlexData({
  //     plexAuthToken: null,
  //     plexUserData: null,
  //     plexServers: null,
  //     plexLibraries: null,
  //     plexMusicLibraries: null,
  //   });
  // }

  // function testPlexServer(ipAddress, accessToken) {
  //   obj?.connections
  //     ?.filter((ipEntry) => ipEntry?.local === true)
  //     ?.map((localIP) => {
  //       console.log(localIP);
  //       axios({
  //         method: 'GET',
  //         timeout: 100,
  //         url:
  //           'http://' +
  //           localIP.address +
  //           ':32400?' +
  //           require('qs').stringify({
  //             'X-Plex-Token': obj?.accessToken,
  //           }),
  //       })
  //         .catch(function (error) {
  //           if (error.response) {
  //             // The request was made and the server responded with a status code
  //             // that falls out of the range of 2xx
  //             console.log(error.response.data);
  //             console.log(error.response.status);
  //             console.log(error.response.headers);
  //           } else if (error.request) {
  //             // The request was made but no response was received
  //             // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //             // http.ClientRequest in node.js
  //             console.log(error.request);
  //           } else {
  //             // Something happened in setting up the request that triggered an Error
  //             console.log('Error', error.message);
  //           }
  //           console.log(error.config);
  //         })
  //         .then((response) => {
  //           console.log();
  //           if (response?.status === 200) {
  //             localArray = [...localArray, localIP];
  //           } else {
  //             return null;
  //           }
  //         });
  //     });
  // }

  // function savePlexState() {
  //   if (plexData === null) {
  //     plexLogin();
  //   } else {
  //     localStorage.setItem('plex-database', plexData);
  //     console.log('Plex Database:');
  //     console.log(localStorage.getItem('plex-database'));
  //   }
  // }

  // function getPlexMusicLibraries() {
  //   setPlexMusicLibraries(
  //     plexLibraries?.filter((obj) => obj?.type === 'artist')
  //   );
  // }

  // if (plexData.authToken !== null) {
  //   console.log(plexData.authToken);
  //   validatePlexAuthToken(plexData.authToken);
  // } else {
  //   plexLogout();
  // }

  // if (!authToken) {
  //   plexLogin();
  // }
  // if (!plexUserData) {
  //   validatePlexAuthToken();
  // }
  // if (!plexServers) {
  //   getPlexServers();
  // }

  // console.log('Main Body');

  // console.log('clientId:');
  // console.log(clientId);

  // console.log('Plex Auth Token:');
  // console.log(plexAuthToken);

  // console.log('Plex User Data:');
  // console.log(plexUserData);

  // console.log('Plex Servers:');
  // console.log(plexServers);

  // console.log('Plex Libraries:');
  // console.log(plexLibraries);

  // console.log('Plex Music Libraries:');
  // console.log(plexMusicLibraries);

  // console.log('Plex DataBase');
  // console.log(plexData);

  // console.log(PlexSession);

  // useEffect(() => PlexSession.PlexLogin(), []);

  // // PlexSession.GetPlexUserData();

  async function PlexLoginButton() {
    await PlexSession.PlexLogin();
    await PlexSession.GetPlexUserData();
    await PlexSession.GetPlexServers();
    await PlexSession.GetPlexLibraries();
    await PlexSession.GetPlexLibraryContent();

    await PlexSession.SavePlexSession();

    setPlexStateTracker(plexStateTracker + 1);
  }

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
            <Box />
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
            <ListItem key="Home" disablePadding>
              <ListItemButton onClick={() => setActivePage(0)}>
                <ListItemIcon>{iconindex.Home}</ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem key="Libraries" disablePadding>
              <ListItemButton onClick={() => setActivePage(1)}>
                <ListItemIcon>{iconindex.Library}</ListItemIcon>
                <ListItemText primary="Libraries" />
              </ListItemButton>
            </ListItem>
            {PlexSession?.plexMusic?.map((obj) => (
              <ListItem key={obj.uuid} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{iconindex.Library}</ListItemIcon>
                  <ListItemText primary={obj.title} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider />
            <ListItem key="Playlists" disablePadding>
              <ListItemButton onClick={() => setActivePage(2)}>
                <ListItemIcon>{iconindex.Playlists}</ListItemIcon>
                <ListItemText primary="Playlists" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem key="Settings" disablePadding>
              <ListItemButton onClick={() => setActivePage(3)}>
                <ListItemIcon>{iconindex.Settings}</ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
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

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography sx={{ flexGrow: 1 }} component="div">
                Warden
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ flexGrow: 1 }} component="div">
                Local App Data:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ flexGrow: 1 }} component="div">
                UUID:{PlexSession?.clientId}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ flexGrow: 1 }} component="div">
                Accounts:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardHeader
                        avatar={
                          <Avatar
                            alt={PlexSession?.plexTVUserData?.friendlyName}
                            src={PlexSession?.plexTVUserData?.thumb}
                            sx={{ width: 56, height: 56 }}
                          />
                        }
                        action={
                          <Grid container spacing={2}>
                            <Grid item xs={5}>
                              <Button
                                onClick={() => PlexLoginButton()}
                                variant="outlined"
                              >
                                Login
                              </Button>
                            </Grid>
                            <Grid item xs={5}>
                              <Button variant="outlined">Logout</Button>
                            </Grid>
                          </Grid>
                        }
                        title="Plex Account"
                        subheader={
                          `Username: ${PlexSession?.plexTVUserData?.username}`
                            ? PlexSession?.plexTVUserData?.username
                            : null
                        }
                      />
                      <CardContent>
                        <Accordion variant="dense">
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography
                              sx={{ flexGrow: 1 }}
                              component="div"
                              variant="h7"
                            >
                              Account Details
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container spacing={1}>
                              <Grid item xs={12}>
                                <Typography
                                  sx={{ flexGrow: 1 }}
                                  component="div"
                                >
                                  Username:{' '}
                                  {PlexSession?.plexTVUserData?.username}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography
                                  sx={{ flexGrow: 1 }}
                                  component="div"
                                >
                                  Email: {PlexSession?.plexTVUserData?.email}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography
                                  sx={{ flexGrow: 1 }}
                                  component="div"
                                >
                                  Account Status:{' '}
                                  {
                                    PlexSession?.plexTVUserData
                                      ?.subscriptionDescription
                                  }
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography
                                  sx={{ flexGrow: 1 }}
                                  component="div"
                                >
                                  Plex Auth Token:{' '}
                                  {PlexSession?.plexTVAuthToken
                                    ? PlexSession?.plexTVAuthToken
                                    : null}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography
                                  sx={{ flexGrow: 1 }}
                                  component="div"
                                >
                                  {'       '}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography
                                  sx={{ flexGrow: 1 }}
                                  component="div"
                                >
                                  Servers:
                                </Typography>
                              </Grid>
                              <TableContainer component={Paper}>
                                <Table
                                  sx={{ flexGrow: 1 }}
                                  size="small"
                                  aria-label="a dense table"
                                >
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Name</TableCell>
                                      <TableCell align="right">
                                        Public IP
                                      </TableCell>
                                      <TableCell align="right">
                                        Platform
                                      </TableCell>
                                      <TableCell align="right">Yours</TableCell>
                                      <TableCell align="right">
                                        Connection
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {PlexSession?.plexServers?.map((row) => (
                                      <TableRow
                                        key={row.name}
                                        sx={{
                                          '&:last-child td, &:last-child th': {
                                            border: 0,
                                          },
                                        }}
                                      >
                                        <TableCell component="th" scope="row">
                                          {row?.name}
                                        </TableCell>
                                        <TableCell align="right">
                                          {row?.publicAddress}
                                        </TableCell>
                                        <TableCell align="right">
                                          {row?.platform}
                                        </TableCell>
                                        <TableCell align="right">
                                          {row?.owned ? 'Yes' : 'No'}
                                        </TableCell>
                                        <TableCell align="right">
                                          {row?.publicAddressMatches
                                            ? 'Local'
                                            : 'Remote'}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              {/* {plexServers
                                ? [...plexServers]?.map((entry) => (
                                    <Grid item xs={12}>
                                      <Typography
                                        key={entry.name}
                                        sx={{ flexGrow: 1 }}
                                        component="div"
                                      >
                                        {entry.attributes?.name +
                                          ' - ' +
                                          entry.attributes?.platform +
                                          ' - Internal:(' +
                                          '   ' +
                                          entry.children
                                            ?.filter((obj) =>
                                              ipaddr
                                                .parse(
                                                  obj.attributes.uri
                                                    .replace('http://', '')
                                                    .replace(':32400', '')
                                                )
                                                .range()
                                                .includes('private')
                                            )
                                            ?.map(
                                              (entry) =>
                                                ' ' +
                                                entry.attributes.uri
                                                  .replace('http://', '')
                                                  .replace(':32400', '')
                                            ) +
                                          ' )   ' +
                                          ' - External:(' +
                                          '   ' +
                                          entry.children
                                            ?.filter((obj) =>
                                              ipaddr
                                                .parse(
                                                  obj.attributes.uri
                                                    .replace('http://', '')
                                                    .replace(':32400', '')
                                                )
                                                .range()
                                                .includes('unicast')
                                            )
                                            ?.map(
                                              (entry) =>
                                                ' ' +
                                                entry.attributes.uri
                                                  .replace('http://', '')
                                                  .replace(':32400', '') +
                                                ' )   '
                                            )}
                                      </Typography>
                                    </Grid>
                                  ))
                                : null} */}
                            </Grid>
                          </AccordionDetails>
                          <AccordionActions></AccordionActions>
                        </Accordion>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
