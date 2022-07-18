<?php
require_once "../../config.php";

use Tsugi\Core\LTIX;

$LAUNCH = LTIX::requireData(array(LTIX::CONTEXT, LTIX::LINK));

// Import the router
require_once __DIR__ . '/_router/index.php';

// Import each resource that will be used
require_once __DIR__ . '/common/index.php';
require_once __DIR__ . '/learner/index.php';
require_once __DIR__ . '/instructor/index.php';

AppRouter::initializeAppRouting();
