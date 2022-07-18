<?php
require_once "../config.php";

// Use the common service to retrieve the core app info
require_once __DIR__ . '/api/common/common-service.php';

$info = CommonService::info();

/**
 * Configuration including the session ID so the frontend can interact with api.php
 * Adding more variables is possible, but should be limited as these are not available
 * during development. In local development mode, the session ID will need to be copied
 * over manually to the src/utils/constants.ts DEV_SESSION_ID variable.
 */
?>
<script>
    var appConfig = <?= json_encode($info) ?>;
</script>
<?php

// require './demo/demonstration.php';

/**
 * Index file that references the dynamic React build files
 * The import of the index (rather than specific script/css files) is necessary
 * as the script/css files are generated dynamically and renamed with each build
 * to ensure that the files to not remain unnecessarily cached by the end user's browser.
 */
$buildLocation = './ui/build/index.html';
if (file_exists($buildLocation)) {
    require $buildLocation;
} else {
    throw new Exception('Failed to locate index.html. You may need to run the npm build command for the UI, or verify the location of the build files.');
}
