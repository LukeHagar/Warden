/* eslint-disable default-case */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
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
import AlbumIcon from '@mui/icons-material/Album';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
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
  Skeleton,
  Snackbar,
  Alert,
  Grow,
  Slide,
  SnackbarContent,
  Chip,
  CardActions,
  ListItemAvatar,
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
  GetArtistPage,
  GetPlexDevices,
} from 'plex-api-oauth';
import NoArt from './noart.png';

const drawerWidth = 240;

const iconindex = {
  Home: <HomeIcon />,
  Library: <LibraryMusicIcon />,
  Artist: <PersonIcon />,
  Album: <AlbumIcon />,
  Song: <MusicNoteIcon />,
  Playlists: <FeaturedPlayListIcon />,
  Settings: <SettingsIcon />,
};

function App() {
  const [activePage, setActivePage] = useState(0);
  const [plexStateTracker, setPlexStateTracker] = useState(0);

  const loadedSession = LoadPlexSession();
  console.log(loadedSession);
  if (loadedSession.plexClientInformation == null) {
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
  const [plexDevices, setPlexDevices] = useState();
  const [plexTVUserData, setPlexTVUserData] = useState();
  const [plexLibraries, setPlexLibraries] = useState();

  const [musicHubs, setMusicHubs] = useState([]);
  const [itemPageData, setItemPageData] = useState('null');

  const [libraryItems, setLibraryItems] = useState([]);
  const [libraryHasMore, setLibraryHasMore] = useState(false);
  const [searchData, setSearchData] = useState();
  const [libraryFilter, setLibraryFilter] = useState('BOOO');
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [topic, setTopic] = useState();

  function handleSearch(event) {
    setQuery(event.target.value);
  }

  if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
    // console.log('🎉 Dark mode is supported');
  }

  // console.log('🎉 Dark mode is preferred');
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  // console.log('🎉 Light mode is preferred');
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const [activeTheme, setActiveTheme] = useState(darkTheme);

  console.log('Theme');
  console.log(activeTheme);

  function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
  }

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

  async function UpdateHubs(argPlexServers, argPlexLibraries) {
    const tempMusicHubs = await GetMusicHub(
      plexClientInformation,
      argPlexServers,
      argPlexLibraries
    );
    setMusicHubs(tempMusicHubs);
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
    const tempPlexDevices = await GetPlexDevices(
      plexClientInformation,
      plexTVAuthToken
    );
    const tempPlexLibraries = await GetPlexLibraries(tempPlexServers);
    UpdateHubs(tempPlexServers, tempPlexLibraries);
    setPlexServers(tempPlexServers);
    setPlexDevices(tempPlexDevices);
    setPlexTVUserData(tempPlexTVUserData);
    setPlexLibraries(tempPlexLibraries);
    setIsRefreshing(false);
  }

  async function OpenItem(Obj) {
    let tempItemData = null;
    switch (Obj.type) {
      case 'artist':
        tempItemData = await GetArtistPage(
          plexClientInformation,
          plexServers,
          plexLibraries,
          Obj
        );
        break;
      case 'album':
        tempItemData = await GetAlbumPage(
          plexClientInformation,
          plexServers,
          plexLibraries,
          Obj
        );
        break;
      default:
        break;
    }
    console.log(tempItemData);
    setItemPageData(tempItemData);
    setActivePage(7);
  }

  async function UpdateLibrary() {
    setIsLoading(true);
    const returnObject = await GetLibraryPages(
      plexServers,
      plexLibraries,
      topic,
      pageNumber,
      250
    );
    console.log(returnObject);
    const tempItemArray = Array.from([
      ...new Set([...libraryItems, ...returnObject.items]),
    ]);

    setLibraryItems(tempItemArray);
    setLibraryHasMore(returnObject.hasMore);
    setIsLoading(false);
  }

  const twofiftyArray = [];
  let i = 0;
  while (i < 250) {
    twofiftyArray.push(i);
    i += 1;
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
    UpdateLibrary();
  }, [pageNumber]);

  useEffect(() => {
    setLibraryItems([]);
    setLibraryHasMore(false);
    UpdateLibrary();
  }, [plexServers, plexLibraries, topic]);

  useEffect(() => {
    setIsRefreshing(true);
    setLibraryItems([]);
    setLibraryHasMore(false);
    Refresh();
  }, []);

  console.info('PlexTV Auth Token:');
  console.info(plexTVAuthToken);
  console.log('Plex Client Information:');
  console.log(plexClientInformation);
  console.log('Plex Session Data:');
  console.log(plexTVUserData);
  console.log('Plex Servers:');
  console.log(plexServers);
  console.log('Plex Devices:');
  console.log(plexDevices);
  console.log('Topic:');
  console.log(topic);
  console.log('Page Number:');
  console.log(pageNumber);
  console.log('Plex Library Data:');
  console.log(libraryItems);
  console.log(libraryHasMore);
  console.log('Item Page Data:');
  console.log(itemPageData);
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
              <Chip
                sx={{ marginleft: 3 }}
                onClick={() => setLibraryFilter(null)}
                disabled={libraryFilter === null}
                label="Clear Filter"
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
                  selected={activePage === 0}
                  onClick={() => {
                    setActivePage(0);
                    setPageNumber(0);
                    UpdateHubs(plexServers, plexLibraries);
                  }}
                >
                  <ListItemIcon>{iconindex.Home}</ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem key="LibrariesTab" disablePadding>
                <ListItemButton
                  selected={activePage === 1}
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
                  selected={topic === 'artists' && activePage === 2}
                  onClick={() => {
                    setActivePage(2);
                    topic !== 'artists' && setLibraryItems([]);
                    setPageNumber(0);
                    setTopic('artists');
                  }}
                >
                  <ListItemIcon>{iconindex.Artist}</ListItemIcon>
                  <ListItemText primary="Artists" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem key="AlbumsTab" disablePadding>
                <ListItemButton
                  selected={topic === 'albums' && activePage === 2}
                  onClick={() => {
                    setActivePage(2);
                    topic !== 'albums' && setLibraryItems([]);
                    setPageNumber(0);
                    setTopic('albums');
                  }}
                >
                  <ListItemIcon>{iconindex.Album}</ListItemIcon>
                  <ListItemText primary="Albums" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem key="SongsTab" disablePadding>
                <ListItemButton
                  selected={topic === 'songs' && activePage === 2}
                  onClick={() => {
                    setActivePage(2);
                    topic !== 'songs' && setLibraryItems([]);
                    setPageNumber(0);
                    setTopic('songs');
                  }}
                >
                  <ListItemIcon>{iconindex.Song}</ListItemIcon>
                  <ListItemText primary="Songs" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem key="PlaylistsTab" disablePadding>
                <ListItemButton
                  selected={activePage === 5}
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
                  selected={activePage === 6}
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
              overflow: 'auto',
              flexGrow: 1,
              maxWidth: 'auto',
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
                      gap={15}
                      direction="row"
                      sx={{
                        flexGrow: 1,
                        gridAutoFlow: 'column',
                        gridTemplateColumns:
                          'repeat(auto-fill,minmax(240px,1fr)) !important',
                        gridAutoColumns: 'minmax(240px, 1fr)',
                      }}
                    >
                      {Obj.Metadata?.map((listItem) => {
                        return (
                          <ImageListItem>
                            <Card sx={{ margin: 1, minWidth: 165 }}>
                              <CardActionArea
                                onClick={() => OpenItem(listItem)}
                              >
                                <CardMedia
                                  component="img"
                                  height="165"
                                  width="165"
                                  loading="lazy"
                                  image={listItem.thumb || NoArt}
                                  onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = NoArt;
                                  }}
                                />
                                <CardContent>
                                  <Typography
                                    variant="h6"
                                    justifyContent="center"
                                    noWrap
                                  >
                                    {listItem.title}
                                  </Typography>
                                </CardContent>
                              </CardActionArea>
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
              <Grid container spacing={1}>
                {libraryItems?.map((Obj, index) => {
                  if (topic === 'songs') {
                    if (libraryItems?.length === index + 100) {
                      return (
                        <Grid item xs="12" key={Obj.guid + index}>
                          <ListItem ref={lastLibraryItem}>
                            <ListItemAvatar>
                              <Avatar alt={NoArt} src={Obj.thumb} />
                            </ListItemAvatar>
                            <Typography variant="h6" noWrap>
                              {Obj.title} - {Obj.grandparentTitle} -{' '}
                              {Obj.parentTitle}
                            </Typography>
                          </ListItem>
                        </Grid>
                      );
                    }
                    return (
                      <Grid item xs="12" key={Obj.guid + index}>
                        <ListItem ref={lastLibraryItem}>
                          <ListItemButton>
                            <ListItemAvatar>
                              <Avatar alt={NoArt} src={Obj.thumb} />
                            </ListItemAvatar>
                            <Typography variant="h6" noWrap>
                              {Obj.title} - {Obj.grandparentTitle} -{' '}
                              {Obj.parentTitle}
                            </Typography>
                          </ListItemButton>
                        </ListItem>
                      </Grid>
                    );
                  }
                  if (libraryItems?.length === index + 100) {
                    return (
                      <Grid item xs="auto" key={Obj.guid + index}>
                        <Card ref={lastLibraryItem}>
                          <CardActionArea
                            onClick={() => {
                              OpenItem(Obj);
                            }}
                          >
                            <CardMedia
                              loading="lazy"
                              component="img"
                              height="165"
                              width="165"
                              image={Obj.thumb || NoArt}
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = NoArt;
                              }}
                            />
                          </CardActionArea>
                        </Card>
                        <Typography variant="body1" noWrap>
                          {Obj.title}
                        </Typography>
                        <Typography variant="body2" noWrap>
                          {Obj.parentTitle}
                        </Typography>
                      </Grid>
                    );
                  }
                  return (
                    <Grid item xs="auto" key={Obj.guid + index}>
                      <Card sx={{ width: 165 }}>
                        <CardActionArea
                          onClick={() => {
                            OpenItem(Obj);
                          }}
                        >
                          <CardMedia
                            loading="lazy"
                            component="img"
                            height="165"
                            sx={{ width: 165 }}
                            image={Obj.thumb || NoArt}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = NoArt;
                            }}
                          />
                          <CardContent>
                            <Typography variant="body1" noWrap>
                              {Obj.title}
                            </Typography>
                            <Typography variant="body2" noWrap>
                              {Obj.parentTitle}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
                {isLoading &&
                  topic !== 'songs' &&
                  twofiftyArray?.map((Obj, index) => {
                    return (
                      <Grid item xs="auto" key={`Skeleton${index}`}>
                        <Skeleton
                          animation="wave"
                          variant="rectangular"
                          width={165}
                          height={165}
                        />
                      </Grid>
                    );
                  })}
                {isLoading &&
                  topic === 'songs' &&
                  twofiftyArray?.map((Obj, index) => {
                    return (
                      <Grid item xs="12" key={`Skeleton${index}`}>
                        <Skeleton
                          animation="wave"
                          variant="text"
                          fullWidth
                          height={64}
                        />
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
                <Typography sx={{ flexGrow: 1 }}>Local App Data:</Typography>
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
                                onClick={() => {
                                  setIsRefreshing(true);
                                  Refresh();
                                }}
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
          <Box
            hidden={isHidden(7)}
            component="main"
            sx={{
              flexGrow: 1,
              flexShrink: 1,
              bgcolor: 'background.default',
              p: 3,
            }}
            label="ItemPage"
            TransitionProps={{
              unmountOnExit: true,

              timeout: 100,
            }}
          >
            <Toolbar />
            {itemPageData !== 'null' &&
              itemPageData.inputObject.type === 'artist' &&
              [1].map(() => {
                return (
                  <div>
                    <Box>
                      <Typography variant="h4" margin={1} alight="left">
                        {itemPageData.response.MediaContainer.parentTitle}
                      </Typography>
                      <Typography variant="body2" margin={1} align="left">
                        {itemPageData.albums.length} Albums
                      </Typography>
                    </Box>
                    <Divider />
                    <Accordion margin={4}>
                      <AccordionSummary>Summary</AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          paragraph
                          sx={{ margin: 1 }}
                          variant="body2"
                        >
                          {itemPageData.response.MediaContainer.summary}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                );
              })}

            <Grid container spacing={2}>
              <Grid item xs="12" margin={1}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ margin: 2 }}>
                  <Grid container spacing={0}>
                    <Grid item xs="12" margin={1}>
                      <Typography> Songs:</Typography>
                      {itemPageData !== 'null' &&
                        itemPageData.songs.length === 0 &&
                        [1].map(() => {
                          return (
                            <Typography variant="body2" noWrap>
                              No Popular Song Data
                            </Typography>
                          );
                        })}
                    </Grid>
                    {itemPageData !== 'null' &&
                      itemPageData.inputObject.type === 'artist' &&
                      itemPageData.songs.map((Obj) => {
                        return (
                          <Grid item xs={4}>
                            <ListItem>
                              <ListItemButton>
                                <ListItemAvatar>
                                  <Avatar alt={NoArt} src={Obj.thumb} />
                                </ListItemAvatar>
                                <ListItemText>
                                  <Typography variant="body2" noWrap>
                                    {Obj.title} - {Obj.parentTitle}
                                  </Typography>
                                  <Typography variant="body2" noWrap>
                                    {Obj.grandparentTitle}
                                  </Typography>
                                </ListItemText>
                              </ListItemButton>
                            </ListItem>
                          </Grid>
                        );
                      })}
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs="12">
                <Box sx={{ margin: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs="12" margin={1}>
                      <Typography> Albums:</Typography>
                      {itemPageData !== 'null' &&
                        itemPageData.albums.length === 0 &&
                        [1].map(() => {
                          return (
                            <Typography variant="body2" noWrap>
                              No Popular Song Data
                            </Typography>
                          );
                        })}
                    </Grid>
                    {itemPageData !== 'null' &&
                      itemPageData.inputObject.type === 'artist' &&
                      itemPageData.albums.map((Obj, index) => {
                        return (
                          <Grid
                            item
                            xs="auto"
                            key={Obj.guid + index}
                            margin={1}
                          >
                            <Card sx={{ width: 165 }}>
                              <CardActionArea
                                onClick={() => {
                                  OpenItem(Obj);
                                }}
                              >
                                <CardMedia
                                  loading="lazy"
                                  component="img"
                                  height="165"
                                  sx={{ width: 165 }}
                                  image={Obj.thumb || NoArt}
                                  onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = NoArt;
                                  }}
                                />
                                <CardContent>
                                  <Typography variant="h6" noWrap>
                                    {Obj.title}
                                  </Typography>
                                  <Typography variant="p7" noWrap>
                                    {Obj.parentTitle}
                                  </Typography>
                                </CardContent>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        );
                      })}
                    <Grid item xs="12" margin={1}>
                      <Typography> Related Artists:</Typography>
                      {itemPageData !== 'null' &&
                        itemPageData.relatedArtists.length === 0 &&
                        [1].map(() => {
                          return (
                            <Typography variant="body2" noWrap>
                              No Related Artists Data
                            </Typography>
                          );
                        })}
                    </Grid>

                    {itemPageData !== 'null' &&
                      itemPageData.inputObject.type === 'artist' &&
                      itemPageData.relatedArtists.map((Obj, index) => {
                        return (
                          <Grid
                            item
                            xs="auto"
                            key={Obj.guid + index}
                            margin={1}
                          >
                            <Card sx={{ width: 165 }}>
                              <CardActionArea
                                onClick={() => {
                                  OpenItem(Obj);
                                }}
                              >
                                <CardMedia
                                  loading="lazy"
                                  component="img"
                                  height="165"
                                  sx={{ width: 165 }}
                                  image={Obj.thumb || NoArt}
                                  onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = NoArt;
                                  }}
                                />
                                <CardContent>
                                  <Typography variant="h6" noWrap>
                                    {Obj.title}
                                  </Typography>
                                  <Typography variant="p7" noWrap>
                                    {Obj.parentTitle}
                                  </Typography>
                                </CardContent>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        );
                      })}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Snackbar
          TransitionComponent={SlideTransition}
          open={isRefreshing}
          autoHideDuration={10000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="info">Refreshing Data</Alert>
        </Snackbar>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
