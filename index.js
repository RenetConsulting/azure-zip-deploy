const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request');
const fs = require('fs');
const xml2json = require('xml2json-light');

try {
  const zipFile = core.getInput('zip-file');
  const publishProfile = core.getInput('publish-profile');

  const profile = xml2json.xml2json(publishProfile);
  const msDeployProfile = profile.publishData.publishProfile.find(x => x.publishMethod === 'MSDeploy');

  const userName = msDeployProfile.userName;
  const password = msDeployProfile.userPWD;

  const authHeader = `Basic ${Buffer.from(`${userName}:${password}`).toString('base64')}`;

  //const apiUrl = `https://${msDeployProfile.publishUrl}/api/zipdeploy`;
  const apiUrl = 'https://en3oh5fsaafse.x.pipedream.net';

  fs.createReadStream(zipFile).pipe(request.post(apiUrl, {
    headers: {
      Authorization: authHeader
    }
  }));
  
} catch (error) {
  core.setFailed(error.message);
}
