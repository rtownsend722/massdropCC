// Import Modules
const express = require('express');
const app = express();
const axios = require('axios');
const parser = require('body-parser');
const db = require('./database.js').URLCache;

const port = 3000;

// Import Helper Functions
const addJob = require('./queue.js').addJob;
const checkStatus = require('./queue.js').checkStatus;

// Middleware
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

/*=======================REST API=======================*/

app.post('/queue', (req, res) => {

  // First check if url is already stored
  db.findOne({
    where: {
      url: req.body.url
    }
  })
  .then(record => {
    if (record.html !== null) {
      res.status(200).send(record.html);
    } else {
      throw new Error;
    }
  })

  // If not stored or retrieval error add job to queue
  .catch(error => {
    addJob(req.body.url, (id) => {
      res.status(201).send(`Remember your transactionId: ${id}`);
    });
  });
});

app.get('/queue', (req, res) => {
  checkStatus(req.body.id, (state, progress) => {

    // If job is incomplete
    if (state !== 'complete') {
      res.status(200).send('Your job is still processing. Progress is ${progress} out of 100');

    // If job is complete 
    } else {
      db.findOne({
        where: {
          queueId: req.body.id
        }
      })
      .then(record => {

        // if html was too long to store, fetch and report
        if (record.html === null) {
          axios.get(`http://${record.url}`)
            // Destroy null record and report html
            .then(result => {
              db.destroy({
                where: {
                  queueId: req.body.id
                }
              });
              res.status(200).send(result.data);
            });
            
        // if html is stored, report
        } else {
          res.status(200).send(record.html);
        }
      })
      .catch(error => {
        res.sendStatus(400);
      });
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));




