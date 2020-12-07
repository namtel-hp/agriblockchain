require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// Responsible to get the body off of network requests.
const bodyParser = require('body-parser');
const cors = require('cors');

// =================================
//              Models
// =================================
const Farmer = require('./models/Farmer');
const Program = require('./models/Program');
const NGO = require('./models/NGO');
const { produce, produceRequirement } = require('./models/Produce');
const { sponsorIndividual, sponsorCorporation } = require('./models/Sponsor');

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('Successfully connected to MongoDB!');
  })
  .catch(error => {
    console.log(`Error connecting to MongoDB:`, error.message)
  });

// Create an express app
const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
})

const currentUser = 'individual';

// =================================
//          VIEW Data Only
// =================================

app.get('/api/ngo', (req, res) => {
  NGO.find({})
    .then(result => {
      res.json(result);
    });
})

app.get('/api/programs', (req, res) => {
  Program.find({})
    .then(result => {
      res.json(result);
    });
})

app.get('/api/farmers', (req, res) => {
  // Get all farmers from MongoDB
  Farmer.find({})
    .then(result => {
      res.json(result);
    });
})

// =================================
//          ALTER Data Only
// =================================

app.get('/createngo', (req, res) => {

  const testNGO = new NGO({
    loginDetails: {
      username: 'red@cross.com',
      password: 'redcrosspassword'
    },
    ngoAbout: {
      ngoPicture: '/assets/img',
      ngoName: 'Red Cross',
      addressLine1: 'Quezon City',
      addressLine2: 'Cavite City',
      ngoRegion: 'NCR',
      ngoCity: 'Manila',
      ngoCountry: 'Philippines',
    },
    ngoContactDetails: {
      authorizedRepresentative: 'Dale Gacusan',
      ngoContactNumber: '1234567890',
      ngoEmailAddress: 'dale@gmail.com'
    },
    programs: {
      activePrograms: [],
      completedPrograms: [],
    }
  });

  testNGO.save()
    .then(result => {
      console.log('testNGO Saved to MongoDB!');
      mongoose.connection.close();
    })
    .catch(err => {
      console.log('Error: ', err.errors._message);
    });

})

app.get('/createprogram', (req, res) => {

  NGO.find({})
    .then((result) => {
      const testProgram = new Program({
        programAbout: {
          programPicture: '/assets/img',
          programName: 'Bantay Bata',
          about: 'To help children',
          completed: false,
          cityAddress: 'Manila, Philippines',
          // For testing purposes
          ngo: result[0],
          status: 'Completed',
          stage: 'Procurement',
          requiredAmount: 100000,
          currentAmount: 0,
        },
        timeline: {
          submissionDate: '2002-12-09',
          fundingStartDate: '2001-12-09',
          fundingEndDate: '2002-11-09',
          procurementStartDate: '2000-12-09',
          procurementEndDate: '2002-12-02',
          programDate: '2006-12-09',
        },
        // Create a Requirement Schema
        produceRequirements: [],
        produceGathered: [],
        farmersParticipating: [],
        // Contains Sponsors Schema
        sponsors: [],
        sponsorshipOptions: {
          minor: 50000,
          major: 100000
        },
      });

      // Save a farmer to MongoDB
      testProgram.save()
        .then(result => {
          console.log('testProgram Saved to MongoDB!');
          mongoose.connection.close();
        })
        .catch(err => {
          console.log('Error: ', err.errors['programAbout.ngo'].message);
        });
    });

})

app.get('/createfarmer', (req, res) => {

  const testFarmer = new Farmer({
    loginDetails: {
      username: 'mangjose',
      password: 'mangjosepassword'
    },
    farmerAbout: {
      profilePicture: '/assets/img',
      firstName: 'Jose',
      middleName: 'El',
      lastName: 'Manalo',
      suffix: 'P',
      addressLine1: 'Cotabato',
      addressLine2: 'Davao',
      region: 'NCR',
      city: 'Cavite',
      country: 'Philippines',
    },
    contactDetails: {
      emailAddress: 'mangjose@gmail.com',
      contactNumber: '1234567890'
    },
    producePortfolio: [],
    programStatistics: {
      expectedAmountToReceive: 0,
      dateParticipated: null,
      // For active program, just get the latest item on activePrograms array
      activePrograms: [],
      programsParticipated: [],
      completedPrograms: []
    }
  });

  testFarmer.save()
    .then(result => {
      console.log('testFarmer Saved to MongoDB!');
      mongoose.connection.close();
    })
    .catch(err => {
      console.log('Error: ', err);
    });

});

// uses currentUser
app.get('/createsponsor', (req, res) => {

  if (currentUser === 'individual') {

    const testSponsorInvidivual = new sponsorIndividual({
      loginDetails: {
        username: 'hermansara',
        password: 'hermansara123'
      },
      corporationAbout: {
        profilePicture: '/assets/img',
        firstName: 'Herman',
        middleName: 'Co',
        lastName: 'Sara',
        suffix: 'S',
        addressLine1: 'Manila',
        addressLine2: 'Quezon',
        region: 'NCR',
        city: 'Manila',
        country: 'Philippines'
      },
      contactDetails: {
        contactNumber: '1234567890',
        emailAddress: 'herman@sara.com'
      },
      programStatistics: {
        amountFunded: 20000,
        dateFunded: null,
        // For active program, just get the latest item on activePrograms array
        activePrograms: [],
        sponsoredPrograms: [],
        completedPrograms: [],
      },
      walletBalance: 0
    });

    testSponsorInvidivual.save()
      .then(result => {
        console.log('testSponsorInvidivual Saved to MongoDB!');
        mongoose.connection.close();
      })
      .catch(err => {
        console.log('Error: ', err);
      });

  } else if (currentUser === 'corporation') {

    const testSponsorCorporation = new sponsorCorporation({
      loginDetails: {
        username: 'adminaccount',
        password: 'admin123'
      },
      corporationAbout: {
        profilePicture: '/assets/img',
        corporationName: 'PLDT Corporation',
        addressLine1: 'Taguig',
        addressLine2: 'Makati',
        region: 'NCR',
        city: 'Manila',
        country: 'Philippines'
      },
      contactDetails: {
        authorizedRepresentative: 'Bill Gates',
        contactNumber: '1234567890',
        emailAddress: 'admin@account.com'
      },
      programStatistics: {
        amountFunded: 20000,
        dateFunded: null,
        // For active program, just get the latest item on activePrograms array
        activePrograms: [],
        sponsoredPrograms: [],
        completedPrograms: [],
      },
      walletBalance: 0
    })

    testSponsorCorporation.save()
      .then(result => {
        console.log('testSponsorCorporation Saved to MongoDB!');
        mongoose.connection.close();
      })
      .catch(err => {
        console.log('Error: ', err);
      });

  }

})

app.get('/addfarmerproduce', (req, res) => {

  const testFarmerProduce = new produce({
    farmerId: '5fcde43aaa30ac31d86a20dd',
    name: 'Rice',
    price: 100,
    quantity: 500
  });

  Farmer.updateOne({ _id: testFarmerProduce.farmerId }, { $push: { producePortfolio: testFarmerProduce } })
    .then(() => {
      console.log('Successfully Updated Farmer Produce List');
    })
    .catch(err => {
      console.log(err);
    })

})

app.get('/addprogramproducerequirement', (req, res) => {
  // Produce Requirements
  const testProgramRequirementProduce = new produceRequirement({
    taken: false,
    takenByFarmerId: '',
    name: 'Carrots',
    price: 20,
    quantity: 40,
  });

  Program.updateOne({ _id: '5fcde3ec21a5b22940aebeaa' }, { $push: { produceRequirements: testProgramRequirementProduce } })
    .then(() => {
      console.log('Successfully Updated Program Produce Requirements List');
    })
    .catch(err => {
      console.log(err);
    });
})

// uses currentUser
app.get('/addprogramsponsor', (req, res) => {

  if (currentUser === 'individual') {

    sponsorIndividual.find({ _id: '5fcdffa242dd1d2e4c231b7f' })
      .then(currentSponsor => {
        Program.updateOne({ _id: '5fcde3ec21a5b22940aebeaa' }, { $push: { sponsors: currentSponsor } })
          .then(() => {
            console.log('Successfully Updated Program Sponsors List - Individual');
          })
          .catch(err => {
            console.log(err);
          })
      })

  } else if (currentUser === 'corporation') {
    sponsorCorporation.find({ _id: '5fcdffc9141f1532f4dbb37f' })
      .then(currentSponsor => {
        Program.updateOne({ _id: '5fcde3ec21a5b22940aebeaa' }, { $push: { sponsors: currentSponsor } })
          .then(() => {
            console.log('Successfully Updated Program Sponsors List - Corporation');
          })
          .catch(err => {
            console.log(err);
          })
      })
  }

})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})