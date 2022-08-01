/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
/* eslint-disable prefer-template */
import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
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

import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import SettingsIcon from '@mui/icons-material/Settings';
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
  CircularProgress,
  Grid,
  Icon,
  IconButton,
  StepButton,
  TextareaAutosize,
  TextField,
  Stack,
  ImageList,
  ImageListItem,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Howl, Howler } from 'howler';
import {
  CreatePlexClientInformation,
  PlexLogin,
  GetLibraryPages,
  GetPlexUserData,
  GetPlexServers,
  GetPlexLibraries,
  LoadPlexSession,
  SavePlexSession,
  GetMusicHub,
} from 'plex-api-oauth';
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
  const [plexStateTracker, setPlexStateTracker] = useState(0);

  let loadedSession = LoadPlexSession();
  console.log(loadedSession);
  if (
    loadedSession.plexClientInformation === null ||
    loadedSession.plexClientInformation === undefined
  ) {
    loadedSession.plexClientInformation = CreatePlexClientInformation();
  }

  console.log(loadedSession);

  const [plexClientInformation, setPlexClientInformation] = useState(
    loadedSession.plexClientInformation
  );
  const [plexTVAuthToken, setPlexTVAuthToken] = useState(
    loadedSession.plexTVAuthToken
  );
  const [plexServers, setPlexServers] = useState();
  const [plexTVUserData, setPlexTVUserData] = useState();
  const [plexLibraries, setPlexLibraries] = useState();

  const [musicHubs, setMusicHubs] = useState([]);

  const [libraryItems, setLibraryItems] = useState([]);
  const [libraryHasMore, setLibraryHasMore] = useState(false);
  const [searchData, setSearchData] = useState();

  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState();

  function handleSearch(event) {
    setQuery(event.target.value);
  }

  if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
    // console.log('🎉 Dark mode is supported');
  }

  const themeBaseline = {
    components: {
      MuiCssBaseline: {
        styleOverrides: ``,
      },
    },
  };

  // console.log('🎉 Dark mode is preferred');
  const darkTheme = createTheme({
    ...themeBaseline,
    palette: {
      mode: 'dark',
    },
  });

  // console.log('🎉 Light mode is preferred');
  const lightTheme = createTheme({
    ...themeBaseline,
    palette: {
      mode: 'light',
    },
  });

  const [activeTheme, setActiveTheme] = useState(darkTheme);

  console.log('Theme');
  console.log(activeTheme);

  async function PlexLoginButton() {
    const tempPlexTVAuthToken = await PlexLogin(plexClientInformation);
    const tempPlexTVUserData = await GetPlexUserData(
      plexClientInformation,
      tempPlexTVAuthToken
    );
    const tempPlexServers = await GetPlexServers(
      plexClientInformation,
      tempPlexTVAuthToken
    );
    const tempPlexLibraries = await GetPlexLibraries(tempPlexServers);
    setPlexTVAuthToken(tempPlexTVAuthToken);
    setPlexServers(tempPlexServers);
    setPlexTVUserData(tempPlexTVUserData);
    setPlexLibraries(tempPlexLibraries);
    SavePlexSession(plexClientInformation, tempPlexTVAuthToken);
  }

  async function PlexLogoutButton() {
    setPlexStateTracker(plexStateTracker + 1);
  }

  async function Refresh() {
    const tempPlexTVUserData = await GetPlexUserData(
      plexClientInformation,
      plexTVAuthToken
    );
    const tempPlexServers = await GetPlexServers(
      plexClientInformation,
      plexTVAuthToken
    );
    const tempPlexLibraries = await GetPlexLibraries(tempPlexServers);
    const tempMusicHubs = await GetMusicHub(
      plexClientInformation,
      tempPlexServers,
      tempPlexLibraries
    );
    setMusicHubs(tempMusicHubs);
    setPlexServers(tempPlexServers);
    setPlexTVUserData(tempPlexTVUserData);
    setPlexLibraries(tempPlexLibraries);
  }

  // useEffect(() => {
  //   const { searchItems, searchHasMore, searchLoading, searchError } =
  //     GetLibraryPages(
  //       {
  //         servers: plexSessionData.plexServers,
  //         libraries: plexSessionData.plexLibraries,
  //       },
  //       topic,
  //       query,
  //       pageNumber
  //     );
  //   setSearchData({ searchItems, searchHasMore, searchLoading, searchError });
  // }, [pageNumber, topic, query, plexSessionData]);

  async function UpdateLibrary() {
    setIsLoading(true);
    let returnObject = await GetLibraryPages(
      plexServers,
      plexLibraries,
      topic,
      pageNumber,
      50
    );
    console.log(returnObject);
    returnObject.items = [...new Set([...libraryItems, ...returnObject.items])];

    setLibraryItems(returnObject.items);
    setLibraryHasMore(returnObject.hasMore);
    setIsLoading(false);
  }

  const observer = useRef();
  const lastLibraryItem = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && libraryHasMore) {
          setPageNumber(pageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
      console.log(node);
    },
    [isLoading, libraryHasMore]
  );

  useEffect(() => {
    setLibraryItems([]);
    setLibraryHasMore(false);
  }, [topic]);

  useEffect(() => {
    UpdateLibrary();
  }, [pageNumber, plexServers, plexLibraries, topic]);

  useEffect(() => {
    Refresh();
  }, []);

  console.log('Plex Session:');
  console.log(plexTVAuthToken);
  console.log(plexClientInformation);
  console.log('Plex Session Data:');
  console.log(plexTVUserData);
  console.log(plexServers);
  console.log(plexLibraries);
  console.log('Topic:');
  console.log(topic);
  console.log('Page Number:');
  console.log(pageNumber);
  console.log('Plex Library Data:');
  console.log(libraryItems);
  console.log(libraryHasMore);
  console.log('Hubs:');
  console.log(musicHubs);
  console.log('Search Data:');
  console.log(searchData);

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
      <CssBaseline enableColorScheme>
        <Box sx={{ display: 'flex', bgcolor: 'primary.main' }}>
          <AppBar
            position="fixed"
            sx={{
              width: `calc(100% - ${drawerWidth}px)`,
              ml: `${drawerWidth}px`,
            }}
          >
            <Toolbar>
              <Box />
              <TextField
                id="outlined-basic"
                label="Search"
                variant="standard"
                margin="dense"
                fullWidth
                value={query}
                onChange={handleSearch}
              />
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
              <ListItem key="HomeTab" disablePadding>
                <ListItemButton
                  onClick={() => {
                    setActivePage(0);
                    setPageNumber(0);
                  }}
                >
                  <ListItemIcon>{iconindex.Home}</ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem key="LibrariesTab" disablePadding>
                <ListItemButton
                  onClick={() => {
                    setActivePage(1);
                    setPageNumber(0);
                  }}
                >
                  <ListItemIcon>{iconindex.Library}</ListItemIcon>
                  <ListItemText primary="Libraries" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem key="ArtistsTab" disablePadding>
                <ListItemButton
                  onClick={() => {
                    setActivePage(2);
                    topic !== 'artists' && setLibraryItems([]);
                    setPageNumber(0);
                    setTopic('artists');
                  }}
                >
                  <ListItemIcon>{iconindex.Library}</ListItemIcon>
                  <ListItemText primary="Artists" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem key="AlbumsTab" disablePadding>
                <ListItemButton
                  onClick={() => {
                    setActivePage(2);
                    topic !== 'albums' && setLibraryItems([]);
                    setPageNumber(0);
                    setTopic('albums');
                  }}
                >
                  <ListItemIcon>{iconindex.Library}</ListItemIcon>
                  <ListItemText primary="Albums" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem key="SongsTab" disablePadding>
                <ListItemButton
                  onClick={() => {
                    setActivePage(2);
                    topic !== 'songs' && setLibraryItems([]);
                    setPageNumber(0);
                    setTopic('songs');
                  }}
                >
                  <ListItemIcon>{iconindex.Library}</ListItemIcon>
                  <ListItemText primary="Songs" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem key="PlaylistsTab" disablePadding>
                <ListItemButton
                  onClick={() => {
                    setActivePage(5);
                    setPageNumber(0);
                  }}
                >
                  <ListItemIcon>{iconindex.Playlists}</ListItemIcon>
                  <ListItemText primary="Playlists" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem key="SettingsTab" disablePadding>
                <ListItemButton
                  onClick={() => {
                    setActivePage(6);
                    setPageNumber(0);
                  }}
                >
                  <ListItemIcon>{iconindex.Settings}</ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
          <Box
            hidden={isHidden(0)}
            component="main"
            sx={{
              overflow: 'hidden',
              flexGrow: 1,
              maxWidth: self.innerWidth - drawerWidth,
              bgcolor: 'background.default',
              p: 3,
            }}
            label="Home"
            TransitionProps={{
              unmountOnExit: true,
              timeout: 200,
            }}
          >
            <Toolbar />
            {musicHubs?.map((Obj) => {
              if (Obj.size > 0) {
                return (
                  <div>
                    {Obj.title}
                    <ImageList
                      direction="row"
                      sx={{
                        overflow: 'scroller',
                        flexGrow: 1,
                        margin: 4,
                        gridAutoFlow: 'column',
                        gridTemplateColumns:
                          'repeat(auto-fill,minmax(240px,1fr)) !important',
                        gridAutoColumns: 'minmax(240px, 1fr)',
                      }}
                    >
                      {Obj.Metadata?.map((listItem) => {
                        return (
                          <ImageListItem>
                            <Card sx={{ margin: 1, minWidth: 240 }}>
                              <CardMedia
                                component="img"
                                height="240"
                                width="240"
                                image={listItem.thumb || NoArt}
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src = NoArt;
                                }}
                              />
                              <CardContent>
                                <Typography noWrap>{listItem.title}</Typography>
                              </CardContent>
                            </Card>
                          </ImageListItem>
                        );
                      })}
                    </ImageList>
                  </div>
                );
              }
              return null;
            })}
          </Box>
          <Box
            hidden={isHidden(1)}
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            label="Library"
          >
            <Toolbar />
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} xs>
                {plexLibraries
                  ?.filter((Obj) => Obj.type === 'artist')
                  ?.map((Obj, index) => (
                    <Grid item xs="auto" key={Obj.guid + index}>
                      <Card>
                        <CardActionArea
                          onClick={() => {
                            setActivePage(4);
                            setPageNumber(0);
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="240"
                            image={Obj.thumb || NoArt}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = NoArt;
                            }}
                          />
                          <CardContent>
                            <Typography noWrap>{Obj.title}</Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Box>
          <Box
            hidden={isHidden(2)}
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            label="ItemLibrary"
            TransitionProps={{
              timeout: 100,
            }}
          >
            <Toolbar />
            <Box sx={{}}>
              <Grid container spacing={2}>
                {libraryItems?.sort()?.map((Obj, index) => {
                  if (libraryItems?.length === index + 10) {
                    return (
                      <Grid item xs="auto" key={Obj.guid + index}>
                        <Card ref={lastLibraryItem}>
                          <CardActionArea
                            onClick={() => {
                              setActivePage(4);
                            }}
                          >
                            <CardMedia
                              loading="lazy"
                              component="img"
                              height="240"
                              width="240"
                              image={Obj.thumb || NoArt}
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = NoArt;
                              }}
                            />
                            <CardContent>
                              <Typography noWrap>{Obj.title}</Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    );
                  }
                  return (
                    <Grid item xs="auto" key={Obj.guid + index}>
                      <Card sx={{ width: 240 }}>
                        <CardActionArea
                          onClick={() => {
                            setActivePage(4);
                          }}
                        >
                          <CardMedia
                            loading="lazy"
                            component="img"
                            height="240"
                            sx={{ width: 240 }}
                            image={Obj.thumb || NoArt}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = NoArt;
                            }}
                          />
                          <CardContent>
                            <Typography noWrap>{Obj.title}</Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Box>
          <Box
            hidden={isHidden(5)}
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            label="Playlists"
            TransitionProps={{
              unmountOnExit: true,

              timeout: 100,
            }}
          >
            <Toolbar />
            <Typography paragraph>
              This will be the Playlists page of my App
            </Typography>
          </Box>
          <Box
            hidden={isHidden(6)}
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            label="Settings"
            TransitionProps={{
              unmountOnExit: true,

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
                  UUID:{plexClientInformation?.clientIdentifier}
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
                              alt={plexTVUserData?.friendlyName}
                              src={plexTVUserData?.thumb}
                              sx={{ width: 56, height: 56 }}
                            />
                          }
                          action={
                            <div>
                              <Button
                                onClick={() => Refresh()}
                                variant="outlined"
                                sx={{ margin: 1 }}
                              >
                                Refresh
                              </Button>
                              <Button
                                onClick={() => PlexLoginButton()}
                                variant="outlined"
                                sx={{ margin: 1 }}
                              >
                                Login
                              </Button>

                              <Button
                                onClick={() => PlexLogoutButton()}
                                variant="outlined"
                                sx={{ margin: 1 }}
                              >
                                Logout
                              </Button>
                            </div>
                          }
                          title="Plex Account"
                          subheader={`Username: ${
                            plexTVUserData?.username
                              ? plexTVUserData?.username
                              : null
                          }`}
                        />
                        <CardContent>
                          <Accordion
                            variant="dense"
                            TransitionProps={{
                              unmountOnExit: true,
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
                                    Username: {plexTVUserData?.username}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography
                                    sx={{ flexGrow: 1 }}
                                    component="div"
                                  >
                                    Email: {plexTVUserData?.email}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography
                                    sx={{ flexGrow: 1 }}
                                    component="div"
                                  >
                                    Account Status:{' '}
                                    {plexTVUserData?.subscriptionDescription}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography
                                    sx={{ flexGrow: 1 }}
                                    component="div"
                                  >
                                    Plex Auth Token: {plexTVAuthToken || null}
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
                                        <TableCell align="right">
                                          Yours
                                        </TableCell>
                                        <TableCell align="right">
                                          Connection
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {plexServers?.map((row) => (
                                        <TableRow
                                          key={row.name}
                                          sx={{
                                            '&:last-child td, &:last-child th':
                                              {
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
                              </Grid>
                            </AccordionDetails>
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
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
