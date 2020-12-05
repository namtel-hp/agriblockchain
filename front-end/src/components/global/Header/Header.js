import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    minWidth: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    minWidth: drawerWidth,
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Bay-ANI-han
          </Typography>
          <IconButton onClick={handleDrawerOpen} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={open}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div>
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {/* {['Home', 'Login', 'Register', 'Programs', 'About Us', 'Contact Us'].map((text, index) => (
            <ListItem button key={index}>
              <ListItemText primary={text} />
            </ListItem>
          ))} */}
          <ListItemLink to='/' onClick={handleDrawerClose}>
            <ListItemText primary="Home" />
          </ListItemLink>
          <ListItemLink to='/login' onClick={handleDrawerClose}>
            <ListItemText primary="Login" />
          </ListItemLink>
          <ListItemLink to='/register' onClick={handleDrawerClose}>
            <ListItemText primary="Register" />
          </ListItemLink>
          <ListItemLink to='/programs' onClick={handleDrawerClose}>
            <ListItemText primary="Programs" />
          </ListItemLink>
          <ListItemLink to='/about' onClick={handleDrawerClose}>
            <ListItemText primary="About us" />
          </ListItemLink>
        </List>
      </Drawer>
    </div>
  );
}

function ListItemLink(props) {
  return <ListItem button component={Link} {...props} />;
}