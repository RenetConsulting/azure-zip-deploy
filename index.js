const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request');
const fs = require('fs');
const xml2json = require('xml2json-light');
const StreamZip = require('node-stream-zip');

try {
  const zipFile = core.getInput('zip-file');
  const publishProfile = core.getInput('publish-profile');

  const profile = xml2json.xml2json(publishProfile);
  const msDeployProfile = profile.publishData.publishProfile.find(x => x.publishMethod === 'MSDeploy');

  const userName = msDeployProfile.userName;
  const password = msDeployProfile.userPWD;

  const authHeader = `Basic ${Buffer.from(`${userName}:${password}`).toString('base64')}`;

  const apiUrl = `https://${msDeployProfile.publishUrl}/api/zipdeploy`;
  //const apiUrl = 'https://enqjpxnnm69tnwq.m.pipedream.net';
  //const apiUrl = 'https://en3oh5fsaafse.x.pipedream.net';

  console.log(apiUrl);
  
  const zip = new StreamZip({
    file: zipFile,
    storeEntries: true
  })
  zip.on('ready', () => {
    console.log('Entries read: ' + zip.entriesCount);
    for (const entry of Object.values(zip.entries())) {
        const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
        console.log(`Entry ${entry.name}: ${desc}`);
    }
    // Do not forget to close the file once you're done
    zip.close()
  });

  fs.createReadStream(zipFile).pipe(request.post(apiUrl, {
    headers: {
      Authorization: authHeader
    }
  }));
  
} catch (error) {
  core.setFailed(error.message);
}
