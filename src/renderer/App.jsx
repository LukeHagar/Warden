/* eslint-disable prefer-template */
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
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
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
import { PlexAPIOAuth } from 'plex-api-oauth';
import qs from 'qs';
import NoArt from './noart.png';

const drawerWidth = 240;

const iconindex = {
  Home: <HomeIcon />,
  Library: <LibraryMusicIcon />,
  Playlists: <FeaturedPlayListIcon />,
  Settings: <SettingsIcon />,
};

function App() {
  const [activePage, setActivePage] = useState(0);
  const [activeArtist, setActiveArtist] = useState();
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
    PlexSession.SavePlexSession();
  }
  console.log(PlexSession);

  async function PlexLoginButton() {
    await PlexSession.PlexLogin();
    await PlexSession.GetPlexUserData();
    await PlexSession.GetPlexServers();
    await PlexSession.GetPlexLibraries();
    await PlexSession.GetPlexMusicLibraryContent();
    await PlexSession.SavePlexSession();

    setPlexStateTracker(plexStateTracker + 1);
  }

  async function PlexLogoutButton() {
    await PlexSession.PlexLogout();
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
            <Divider />
            <ListItem key="Libraries" disablePadding>
              <ListItemButton onClick={() => setActivePage(2)}>
                <ListItemIcon>{iconindex.Library}</ListItemIcon>
                <ListItemText primary="Artists" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem key="Libraries" disablePadding>
              <ListItemButton onClick={() => setActivePage(3)}>
                <ListItemIcon>{iconindex.Library}</ListItemIcon>
                <ListItemText primary="Albums" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem key="Libraries" disablePadding>
              <ListItemButton onClick={() => setActivePage(4)}>
                <ListItemIcon>{iconindex.Library}</ListItemIcon>
                <ListItemText primary="Songs" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem key="Playlists" disablePadding>
              <ListItemButton onClick={() => setActivePage(5)}>
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
          TransitionProps={{
            unmountOnExit: true,
            mountOnEnter: true,
            timeout: 200,
          }}
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
          <Accordion
            TransitionProps={{
              unmountOnExit: true,
              mountOnEnter: true,
              timeout: 400,
            }}
          >
            <AccordionSummary>
              <Typography variant="h3">Artists</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{}}>
                <Grid container spacing={2}>
                  {PlexSession?.plexArtistLibraries?.map((Obj) => (
                    <Grid item xs={3} key={Obj.guid}>
                      <Card>
                        <CardActionArea
                          onClick={() => {
                            setActivePage(4);
                            setActiveArtist(Obj);
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="240"
                            image={
                              Obj.server.relayConnections[0].uri +
                                '/photo/:/transcode?' +
                                qs.stringify({
                                  width: 240,
                                  height: 240,
                                  minSize: 1,
                                  upscale: 1,
                                  url:
                                    Obj.thumb +
                                    '?X-Plex-Token=' +
                                    Obj.server.accessToken,
                                  'X-Plex-Token': Obj.server.accessToken,
                                }) || NoArt
                            }
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = NoArt;
                            }}
                          />
                          <CardContent>
                            <Typography>{Obj.title}</Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion
            TransitionProps={{
              unmountOnExit: true,
              mountOnEnter: true,
              timeout: 200,
            }}
          >
            <AccordionSummary>
              <Typography variant="h3">Albums</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{}}>
                <Grid container spacing={2}>
                  {PlexSession?.plexArtistLibraries?.map((Obj) => (
                    <Grid item xs={3} key={Obj.guid}>
                      <Card>
                        <CardActionArea
                          onClick={() => {
                            setActivePage(4);
                            setActiveArtist(Obj);
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="240"
                            image={
                              Obj.server.relayConnections[0].uri +
                                '/photo/:/transcode?' +
                                qs.stringify({
                                  width: 240,
                                  height: 240,
                                  minSize: 1,
                                  upscale: 1,
                                  url:
                                    Obj.thumb +
                                    '?X-Plex-Token=' +
                                    Obj.server.accessToken,
                                  'X-Plex-Token': Obj.server.accessToken,
                                }) || NoArt
                            }
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = NoArt;
                            }}
                          />
                          <CardContent>
                            <Typography>{Obj.title}</Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion
            TransitionProps={{
              unmountOnExit: true,
              mountOnEnter: true,
              timeout: 200,
            }}
          >
            <AccordionSummary>
              <Typography variant="h3">Songs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{}}>
                <Grid container spacing={2}>
                  {PlexSession?.plexSongLibraries?.map((Obj) => (
                    <Grid item xs={3} key={Obj.guid}>
                      <Card>
                        <CardActionArea
                          onClick={() => {
                            setActivePage(4);
                            setActiveArtist(Obj);
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="240"
                            image={
                              Obj.server.relayConnections[0].uri +
                                '/photo/:/transcode?' +
                                qs.stringify({
                                  width: 240,
                                  height: 240,
                                  minSize: 1,
                                  upscale: 1,
                                  url:
                                    Obj.thumb +
                                    '?X-Plex-Token=' +
                                    Obj.server.accessToken,
                                  'X-Plex-Token': Obj.server.accessToken,
                                }) || NoArt
                            }
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = NoArt;
                            }}
                          />
                          <CardContent>
                            <Typography>{Obj.title}</Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box
          hidden={isHidden(2)}
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
          label="Playlists"
          TransitionProps={{
            unmountOnExit: true,
            mountOnEnter: true,
            timeout: 100,
          }}
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
          TransitionProps={{
            unmountOnExit: true,
            mountOnEnter: true,
            timeout: 100,
          }}
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
                              <Button
                                onClick={() => PlexLogoutButton()}
                                variant="outlined"
                              >
                                Logout
                              </Button>
                            </Grid>
                          </Grid>
                        }
                        title="Plex Account"
                        subheader={`Username: ${
                          PlexSession?.plexTVUserData?.username
                            ? PlexSession?.plexTVUserData?.username
                            : null
                        }`}
                      />
                      <CardContent>
                        <Accordion
                          variant="dense"
                          TransitionProps={{
                            unmountOnExit: true,
                            mountOnEnter: true,
                          }}
                        >
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
        <Box
          hidden={isHidden(4)}
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
          label="Playlists"
          TransitionProps={{
            unmountOnExit: true,
            mountOnEnter: true,
            timeout: 100,
          }}
        >
          <Toolbar />
          <Typography>{activeArtist?.title}</Typography>
          <List></List>
        </Box>
        <Box
          hidden={isHidden(5)}
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
          label="Playlists"
          TransitionProps={{
            unmountOnExit: true,
            mountOnEnter: true,
            timeout: 100,
          }}
        >
          <Toolbar />
          <Typography paragraph>
            This will be the Album page of my App
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
