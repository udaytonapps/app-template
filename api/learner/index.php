<?php

// Listed in order of dependency
require_once __DIR__ . '/learner-dao.php';
// Controller relies on DAO
require_once __DIR__ . '/learner-controller.php';
// Routes rely on controller
require_once __DIR__ . '/learner-routes.php';
