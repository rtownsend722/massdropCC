// Import Modules
const axios = require('axios');
const db = require('./database.js').URLCache;
const kue = require('kue');

const jobs = kue.createQueue({
  prefix: 'q',
  redis: {
    port: 6379,
    host: 'localhost',
  },
  disableSearch: false,
});

// Kue UI available at localhost:4568
kue.app.listen(4568);


/*=================Queue Methods=================*/

const addJob = (url, cb) => {
  let job = jobs.create('new job', {
    url: url
  });

  // Report enqueued job id to client
  job.on('enqueue', id => {
    cb(job.id);
  })

  .on('failed', () => {
    job.remove(() => {
      console.log(`${job.id} has failed and has been removed`);
    })
  });

  job.save(error => {
    if (error) { console.log(error) };
  });
};

const checkStatus = (id, cb) => {
  kue.Job.get(id, (err, job) => {
    cb(job._state, job._progress);
  });
}

jobs.process('new job', (job, done) => {
  // fetch html
  axios.get(`http://${job.data.url}`)
    .then(res => {
      // save result in database
      db.findOrCreate({
        where: {
          queueId: job.id,
          url: job.data.url,
          html: res.data
        }
      }).then(results => {
        console.log('Success creating record');

      // If html is too long, re-attempt create record with null html value
      }).catch(error => {
        db.findOrCreate({
          where: {
            queueId: job.id,
            url: job.data.url,
            html: null
          }
        });
      });
    })

    .catch(error => {
      console.log(error);
    });

  done && done();
});


module.exports.addJob = addJob;
module.exports.checkStatus = checkStatus;
