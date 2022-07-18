<?php

// Listed in order of dependency
require_once __DIR__ . '/instructor-dao.php';
// Controller relies on DAO
require_once __DIR__ . '/instructor-controller.php';
// Routes rely on controller
require_once __DIR__ . '/instructor-routes.php';