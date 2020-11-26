module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 810:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const core = __webpack_require__(127);
const github = __webpack_require__(309);
const request = __webpack_require__(997);
const fs = __webpack_require__(747);
const xml2json = __webpack_require__(579);
const StreamZip = __webpack_require__(978);

try {
  const zipFile = core.getInput('zip-file');
  const publishProfile = core.getInput('publish-profile');

  const profile = xml2json.xml2json(publishProfile);
  const msDeployProfile = profile.publishData.publishProfile.find(x => x.publishMethod === 'MSDeploy');

  const userName = msDeployProfile.userName;
  const password = msDeployProfile.userPWD;

  const authHeader = `Basic ${Buffer.from(`${userName}:${password}`).toString('base64')}`;

  const apiUrl = `https://${msDeployProfile.publishUrl}/api/zipdeploy`;

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


/***/ }),

/***/ 127:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 309:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 978:
/***/ ((module) => {

module.exports = eval("require")("node-stream-zip");


/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = eval("require")("request");


/***/ }),

/***/ 579:
/***/ ((module) => {

module.exports = eval("require")("xml2json-light");


/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(810);
/******/ })()
;