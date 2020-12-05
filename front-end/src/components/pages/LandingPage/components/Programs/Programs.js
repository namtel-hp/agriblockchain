import React from 'react';
import Program from './Program';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Programs() {
  const classes = useStyles();

  return (
    <Box mt={3}>
      <Grid container spacing={2} style={{ width: '100vw', }}>
        <Grid item xs={12} md={6} lg={3}>
          <Program
            programName="Program Name"
            programDate="December 19, 2020"
            programDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
            programStage="crowdfunding"
            programStatus="active"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Program
            programName="Program Name"
            programDate="December 19, 2020"
            programDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
            programStage="procurement"
            programStatus="active"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Program
            programName="Program Name"
            programDate="December 19, 2020"
            programDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
            programStage="execution"
            programStatus="completed"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Program
            programName="Program Name"
            programDate="December 19, 2020"
            programDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
            programStage="leftover"
            programStatus="cancelled"
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Box display="flex" flexDirection="row-reverse" p={1}>
            <Button variant="contained" color="primary">
              <span>More Programs</span>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}