const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request');
const fs = require('fs');
const xml2json = require('xml2json-light');

try {
  const zipFile = core.getInput('zip-file');
  const publishProfile = core.getInput('publish-profile');
  const scheduleName = core.getInput('schedule-name');
  const webJobName = core.getInput('webjob-name');

  const profile = xml2json.xml2json(publishProfile);
  const msDeployProfile = profile.publishData.publishProfile.find(x => x.publishMethod === 'MSDeploy');

  const userName = msDeployProfile.userName;
  const password = msDeployProfile.userPWD;

  const authHeader = `Basic ${Buffer.from(`${userName}:${password}`).toString('base64')}`;

  const apiUrl = `${msDeployProfile.destinationAppUrl}/api`;

  const url = `${apiUrl}/zip/site/wwwroot/App_Data/jobs/${scheduleName}/${webJobName}`;

  fs.createReadStream(zipFile).pipe(request.put(url, {
    headers: {
      Authorization: authHeader
    }
  }));
  
} catch (error) {
  core.setFailed(error.message);
}
