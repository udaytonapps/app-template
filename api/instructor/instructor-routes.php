<?php

/** Instructor Requests */
$resource = '/instructor';

/** Just a simple test call */
AppRouter::add($resource . '/check', CommonService::restrictToInstructor(function () {
    $res = array('Made it' => 'through!');
    return AppRouter::sendJson($res);
}), 'get');

/** CREATE */
AppRouter::add($resource . '/alerts', CommonService::restrictToInstructor(function () {
    $data = array();
    // Define the expected data
    $requiredData = array('message');
    $optionalData = array('type');
    // Assemble from JSON to PHP associative array
    $data = AppRouter::assembleRouteData($requiredData, $optionalData);
    if (!isset($data)) {
        // Reject if required data is missing
        return AppRouter::sendJson(array('error' => 'Missing parameters'));
    } else {
        $res = InstructorCtr::addAlert($data);
        return AppRouter::sendJson($res);
    }
}), 'post');

/** READ */
AppRouter::add($resource . '/alerts', CommonService::restrictToInstructor(function () {
    // Note: this one just calls the learner DAO and doesn't really need to be 
    // 'restricted' in this state, but it is generally good practice to do so....
    $res = InstructorCtr::getCourseAlerts();
    return AppRouter::sendJson($res);
}), 'get');

/** DELETE */
AppRouter::add($resource . '/alerts/([0-9]*)', CommonService::restrictToInstructor(function ($id) {
    if (!isset($id)) {
        // Reject if required data is missing
        return AppRouter::sendJson(array('error' => 'Missing parameters'));
    } else {
        $res = InstructorCtr::deleteAlert($id);
        return AppRouter::sendJson($res);
    }
}), 'delete');
