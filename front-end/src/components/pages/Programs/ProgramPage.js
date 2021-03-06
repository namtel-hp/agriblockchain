import React, { useState, useEffect, useContext } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Alert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import { useConfirm } from "material-ui-confirm";

import { LoginDialogContext } from '../../global/Contexts/LoginDialogContext';


const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  stage:{
    display: 'inline-block',
    backgroundColor: theme.palette.secondary.main,
    padding: '0.2rem 0.5rem',
    marginBottom: '0.5rem',
    color: theme.palette.secondary.contrastText,
    textTransform: 'capitalize'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer * 100,
    color: '#fff',
  },
}));


export default withRouter(function ProgramPage(props) {
  const classes = useStyles();
  const history = useHistory();
  const confirm = useConfirm();
  const { match } = props;

  const { loginData } = useContext(LoginDialogContext);
  const [ program, setProgram ] = useState({
    "programAbout": {
      "completed": false,
      "status": "",
      "stage": "",
      "currentAmount": 0,
      "programName": "",
      "about": "",
      "cityAddress": "",
      "ngo": "",
      "requiredAmount": 0
    },
    "timeline": {
      "programDate": ""
    },
    "farmersParticipating": [],
    "sponsors": [
      {
        "sponsorId": "",
        "amountFunded": 0,
        "dateFunded": ""
      },
      {
        "sponsorId": "",
        "amountFunded": 0,
        "dateFunded": ""
      }
    ],
    "produceRequirements": [],
    "id": ""    
  });
  const [ ngo, setNgo ] = useState({
    "loginDetails": {
      "username": "",
      "password": "",
    },
    "ngoAbout": {
      "ngoPicture": "",
      "ngoName": "",
      "addressLine1": "",
      "addressLine2": "",
      "ngoRegion": "",
      "ngoCity": "",
      "ngoCountry": "",
    },
    "programs": {
      "activePrograms": [],
      "completedPrograms": [],
    },
    "ngoContactDetails": {
      "authorizedRepresentative": "",
      "ngoContactNumber": "",
      "ngoEmailAddress": ""
    },
    "id": "",
 })
  const [ pledgeDialog, setPledgeDialog ] = useState({
    loading: false,
    open: false,
    pledgeAmount: 0,
  });
  const [ produceDialog, setProduceDialog ] = useState({
    loading: false,
    open: false,
    produce: {
      name: "",
      price: 0,
      quantity: 0,
    }
  });
  const [ executionLoading, setExecutionLoading ] = useState(false);
  const [ success, setSuccess ] = useState(false);
  const [ error, setError ] = useState(false);

  const handlePledgeOpen = () => {
    setPledgeDialog({ ...pledgeDialog, open: true })
  }
  
  const handlePledgeClose = () => {
    setPledgeDialog({ ...pledgeDialog, open: false })
  }

  const handleProduceChange = e => {
    setProduceDialog({
      ...produceDialog,
      produce: {
        ...produceDialog.produce,
        [e.target.name]: e.target.value
      }
    })
  }

  const handleProduceOpen = () => {
    setProduceDialog({ ...produceDialog, open: true })
  }
  
  const handleProduceClose = () => {
    setProduceDialog({ ...produceDialog, open: false })
  }

  const submitPledge = () => {
    if (loginData.type === "corporation" || loginData.type === "individual") {
      setPledgeDialog({
        ...pledgeDialog,
        loading: true
      })
      // /api/crowdfunding/pledge/:programId/:sponsorId
      axios.post(`/api/crowdfunding/pledge/${match.params.programId}/${loginData.uid}`, {
        amount: pledgeDialog.pledgeAmount
      }, { params: {
        programId: match.params.programId,
        sponsorId: loginData.uid
      }})
      .then(res => {
        console.log(res.data)
        setSuccess(true)
        setPledgeDialog({
          loading: false,
          open: false,
          pledgeAmount: 0
        })
        getProgramDetails()
      })
      .catch(err => {
        console.error(err)
        setError(true)
        setPledgeDialog({
          loading: false,
          open: false,
          pledgeAmount: 0
        })
        getProgramDetails()
      })
    } else {
      console.error('Not logged in as a sponsor!');
      setError(true);
      setSuccess(false);
      setPledgeDialog({
        loading: false,
        open: false,
        pledgeAmount: 0
      })
      getProgramDetails()
    }
  }

  const submitProduce = () => {
    if (loginData.type === "farmer") {
      setProduceDialog({
        ...produceDialog,
        loading: true
      })
      // /api/crowdfunding/addFarmerPartnership/:programId/:farmerId
      axios.post(`/api/crowdfunding/addFarmerPartnership/${match.params.programId}/${loginData.uid}`, produceDialog.produce)
        .then(res => {
          console.log(res.data)
          setSuccess(true)
          setProduceDialog({
            loading: false,
            open: false,
            produce: {
              name: "",
              price: 0,
              quantity: 0,
            }
          })
          getProgramDetails()
        })
        .catch(err => {
          console.error(err)
          setError(true)
          setProduceDialog({
            loading: false,
            open: false,
            produce: {
              name: "",
              price: 0,
              quantity: 0,
            }
          })
          getProgramDetails()
        })
    } else {
      console.error('Not logged in as a farmer!');
      setError(true);
      setSuccess(false);
      setProduceDialog({
        loading: false,
        open: false,
        produce: {
          name: "",
          price: 0,
          quantity: 0,
        }
      })
      getProgramDetails()
    }
  }

  const moveToExecution = () => {
    confirm({ 
      title: 'Move to Execution Stage?',
      description: 'This will automatically make the pledged funds available to be disbursed to farmers according to their contributions.',
      cancellationButtonProps: {
        color: 'primary',
      }
    })
      .then(() => {
        setExecutionLoading(true)
        program.farmersParticipating.forEach(farmer => {
          axios.post(`/api/crowdfunding/transferFunds/${match.params.programId}/${farmer.farmerId}`)
          .then((res) => {
            setSuccess(true)
            console.log(res.data)
            getProgramDetails()
            setExecutionLoading(false)
          })
          .catch(err => {
            setError(true);
            setSuccess(false);
            console.error(err)
            getProgramDetails()
            setExecutionLoading(false)
          })
        })
        
      })
      .catch(() => {
        console.log("Canceled move to execution")
        setExecutionLoading(false)
      });
  }

  const getProgramDetails = () => {
    axios.get(`/api/programs/${match.params.programId}`)
      .then((res) => {
        setProgram(res.data);
        // if (res.data.programAbout && res.data.programAbout.ngo !== "") {
        //   axios.get(`/api/ngo/${res.data.programAbout.ngo}`)
        //     .then(res => setNgo(res.data))
        //     .catch(err => console.error(err))
        // }
        if (res.data.sponsors.length !== 0) {
          res.data.sponsors.forEach(sponsor => {
            axios.get(`/api/sponsors/${sponsor.sponsorId}`)
              .then(res => {
                sponsor.sponsorAbout = res.data.sponsorAbout
              })
              .catch(err => console.error(err));
          });
        }
        if (res.data.farmersParticipating.length !== 0) {
          res.data.farmersParticipating.forEach(farmer => {
            axios.get(`/api/farmers/${farmer.farmerId}`)
              .then(res => {
                farmer.farmerAbout = res.data.farmerAbout
              })
              .catch(err => console.error(err));
          });
        }
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    getProgramDetails()
  }, [match.params.programId]);

  return (
    <>
      {/* Backdrop Status */}
      <Backdrop className={classes.backdrop} open={pledgeDialog.loading || produceDialog.loading || executionLoading}>
        <CircularProgress size={28} color="inherit" />
        <Box ml={2}>
          <Typography variant="button">
            Submitting
          </Typography>
        </Box>
      </Backdrop>
      
      {/* Main content */}
      <Container maxWidth="md" component={Box} mb={5}>
        <Button 
          startIcon={<ArrowBackIcon/>}
          onClick={() => history.goBack()}
        >
          Go Back to Programs
        </Button>
        <Grid container spacing={2}>
          <Grid item sm={12} md={4} lg={5}>
            <Box pb={2}>
              <Box>
                <Typography component="h1" variant="h2" gutterBottom>
                  {program.programAbout.programName}
                </Typography>
                <Typography component="h5" variant="h5" color="textSecondary" gutterBottom>
                  {/* NGO: {ngo.ngoAbout.ngoName}&nbsp; 
                  ({ngo && ngo.loginDetails.username}) */}
                  NGO: Juan Foundation
                </Typography>
                <Box>
                  <Typography display="inline" variant="subtitle2" gutterBottom>
                    Status: &nbsp;
                  </Typography>
                  <Typography display="inline" variant="overline" color="primary" gutterBottom>
                    Active 
                  </Typography>
                </Box>
                <Box>
                  <Typography display="inline" variant="subtitle2">
                    Stage: &nbsp;&nbsp;
                  </Typography>
                  <Typography display="inline" variant="subtitle2" className={classes.stage}>
                    {program.programAbout.stage}
                  </Typography>
                </Box>
                <Box>
                  <Typography display="inline" variant="subtitle2">
                    Program Date: &nbsp;
                  </Typography>
                  <Typography display="inline" variant="subtitle1">
                    {moment(program.timeline.programDate).format('dddd, MMMM Do YYYY')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item sm={12} md={8} lg={7}>
            <Box pb={2} display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <CircularProgressWithLabel value={ program.programAbout.currentAmount / program.programAbout.requiredAmount * 100} />
              <Box my={2}>
                <Typography variant="h6" component="div">
                  &#8369;{program.programAbout.currentAmount} of &#8369;{program.programAbout.requiredAmount} pledged
                </Typography>
              </Box>
              <Box display={ program.programAbout.stage === "crowdfunding" ? "block" : "none" }>
                {
                  loginData.username !== "" && ( loginData.type === "individual" || loginData.type === "corporation" ) ?
                    <Button 
                      variant="contained" 
                      color="primary"
                      disabled={ program.programAbout.stage === "procurement" ? true : false }
                      onClick={handlePledgeOpen}
                    > 
                      Make a Pledge
                    </Button>
                    :
                    <Typography variant="button" component="div" color="textSecondary">
                      You must be sponsor to make a pledge
                    </Typography>
                }
              </Box>
              <Box display={ program.programAbout.stage === "procurement" ? "block" : "none" } textAlign="center">
                {
                  loginData.username !== "" && loginData.type === "farmer" ?
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={handleProduceOpen}
                    > 
                      Offer Produce
                    </Button>
                    :
                    <Typography variant="button" component="div" color="textSecondary" gutterBottom>
                      You must be a farmer to offer produce
                    </Typography>
                }
                {
                  loginData.username !== "" && loginData.type === "ngo" ?
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={moveToExecution}
                    > 
                      Move to Execution
                    </Button>
                    :
                    ""
                }
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Divider/>
        <Box pt={3}>
          <Box mb={2} display={error ? "block" : "none"}>
            <Alert severity="error">Something went wrong. Please check logs.</Alert>
          </Box>
          <Box mb={2} display={success ? "block" : "none"}>
            <Alert severity="success">Action successful!</Alert>
          </Box>
          <Typography component="p" variant="body1" paragraph>
            {program.programAbout.about}
          </Typography>
          <Typography variant="subtitle2">
            Current sponsors          
          </Typography>
          {
            program.sponsors.map((programSponsor, index) => {
              // alert(JSON.stringify(programSponsor))
              return (
                <Box display="flex" key={index} flexDirection="row" alignItems="center" my={1}>
                  <Avatar>
                    {programSponsor.sponsorAbout && programSponsor.sponsorAbout.corporationName[0]}
                  </Avatar>
                  <Typography variant="subtitle1" style={{ marginLeft: 8 }}>
                    {programSponsor.sponsorAbout && programSponsor.sponsorAbout.corporationName}
                    (&#8369;{programSponsor.amountFunded})
                  </Typography>
                </Box>
            )})
          }
          <br/>
          <Typography variant="subtitle2">
            Farmers participating
          </Typography>
          {
            program.farmersParticipating.map((programFarmer, index) => (
              <Box key={index} display="flex" flexDirection="row" alignItems="center" my={2}>
                <Avatar>
                  {programFarmer.farmerAbout && programFarmer.farmerAbout.firstName[0]}
                </Avatar>
                <Box ml={1}>
                  <Typography variant="subtitle1">
                    {programFarmer.farmerAbout && programFarmer.farmerAbout.firstName}&nbsp;{programFarmer.farmerAbout && programFarmer.farmerAbout.middletName}&nbsp;{programFarmer.farmerAbout && programFarmer.farmerAbout.lastName}
                  </Typography>
                  <Typography variant="caption">
                    {programFarmer.quantity} kg of {programFarmer.name}
                  </Typography>
                </Box>
                
              </Box>
            ))
          }
        </Box>
      </Container>

      {/* Pledge dialog for sponsors */}
      <Dialog open={pledgeDialog.open} onClose={handlePledgeClose} aria-labelledby="form-dialog-pledge">
        <DialogTitle id="form-dialog-pledge">Make a Pledge</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To pledge to this program, please enter the amount here.
          </DialogContentText>
          <TextField
            autoFocus
            label="Pledge Amount"
            fullWidth
            variant="outlined"
            id="pledgeAmount"
            name="pledgeAmount"
            type="number"
            value={setPledgeDialog.pledgeAmount}
            onChange={(e) => setPledgeDialog({ ...pledgeDialog, pledgeAmount: e.target.value })}
            InputProps={{
              startAdornment: <InputAdornment position="start">&#8369;</InputAdornment>,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePledgeClose} color="primary">
            Cancel
          </Button>
          <Button onClick={submitPledge} color="primary">
            Pledge
          </Button>
        </DialogActions>
      </Dialog>

      {/* Offer produce dialog for farmers */}
      <Dialog open={produceDialog.open} onClose={handleProduceClose} aria-labelledby="form-dialog-produce">
        <DialogTitle id="form-dialog-produce">Offer Produce</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To offer produce to this program, please enter the details below.
          </DialogContentText>
          <Box my={2}>
            <TextField
              autoFocus
              label="Produce name"
              fullWidth
              variant="outlined"
              id="produceName"
              name="name"
              value={produceDialog.produce.name}
              onChange={handleProduceChange}
            />
          </Box>
          <Box my={2}>
            <TextField
              autoFocus
              label="Produce quantity"
              fullWidth
              variant="outlined"
              id="produceQuantity"
              name="quantity"
              value={produceDialog.produce.quantity}
              onChange={handleProduceChange}
            />
          </Box>
          <Box my={2}>
            <TextField
              autoFocus
              label="Price per quantity"
              fullWidth
              variant="outlined"
              type="number"
              id="price"
              name="price"
              value={produceDialog.produce.price}
              onChange={handleProduceChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">&#8369;</InputAdornment>,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProduceClose} color="primary">
            Cancel
          </Button>
          <Button onClick={submitProduce} color="primary">
            Submit Offer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
})

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex" >
      <CircularProgress size={240} variant="determinate" color="secondary" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h3" component="div" color="textSecondary">
          {`${Math.round(props.value,)}%`}
        </Typography>
      </Box>
    </Box>
  );
}