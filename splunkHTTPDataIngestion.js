const request = require('request');
const async = require('async');

const SPLUNK_API_ENDPOINT = 'https://splunk.example.com/services/collector';
const SPLUNK_AUTH = {
  username: 'my-username',
  password: 'my-password',
};
const BATCH_SIZE = 1000;

function ingestDataIntoSplunk(data, callback) {
    // First, we'll create a new array to hold the batches of data
    const dataBatches = [];
  
    // Then, we'll split the data into batches of the specified size
    let currentBatch = [];
    data.forEach((datum) => {
      currentBatch.push(datum);
      if (currentBatch.length === BATCH_SIZE) {
        dataBatches.push(currentBatch);
        currentBatch = [];
      }
    });
    if (currentBatch.length > 0) {
      dataBatches.push(currentBatch);
    }
    // ...
  }

// function ingestDataIntoSplunk(data, callback) {
//   // First, we'll create a new array to hold the batches of data
//   const dataBatches = [];

//   // Then, we'll split the data into batches of the specified size
//   let currentBatch = [];
//   dataBatches = data.map((datum) => {
//     currentBatch.push(datum);
//     if (currentBatch.length === BATCH_SIZE) {
//       const batch = currentBatch;
//       currentBatch = [];
//       return batch;
//     }
//   });
//   if (currentBatch.length > 0) {
//     dataBatches.push(currentBatch);
//   }
//   // ...
// }

  async.each(dataBatches, (batch, batchCallback) => {
    // Here, we'll construct the options for the API request
    const options = {
      method: 'POST',
      uri: SPLUNK_API_ENDPOINT,
      auth: SPLUNK_AUTH,
      body: batch,
      json: true,
    };

     // Then, we'll make the request to the Splunk API
     request(options, (error, response, body) => {
        // If there was an error, we'll return an error to the callback
        if (error) {
          return callback(error);
        }
  
        // Otherwise, we'll check the status code of the response
        // If it's not a success status, we'll return an error
        if (response.statusCode < 200 || response.statusCode >= 300) {
          return callback(new Error(`Unexpected status code: ${response.statusCode}`));
        }

          // Otherwise, we'll move on to the next batch of data
      return batchCallback();
    });
  }, (error) => {
    // When all of the batches have been processed, we'll call the callback
    // to indicate that the operation is complete
    return callback(error);
  });
