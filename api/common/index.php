<?php

// Listed in order of dependency
require_once __DIR__ . '/common-dao.php';
// Service relies on DAO
require_once __DIR__ . '/common-service.php';
// Controller relies on DAO and (potentially) service
require_once __DIR__ . '/common-controller.php';
// Routes rely on controller
require_once __DIR__ . '/common-routes.php';
