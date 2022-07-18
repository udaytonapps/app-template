<?php

/** Holds methods for handling each route. Constructed with the request path (uri) */
class InstructorCtr
{
    /** @var InstructorDAO */
    protected static $DAO;
    /** @var LearnerDAO */
    protected static $learnerDAO;
    /** @var CommonDAO */
    protected static $commonDAO;
    protected static $LTIX;
    protected static $user;
    protected static $contextId;
    protected static $linkId;

    public static function init()
    {
        global $USER, $CONTEXT, $LINK;
        self::$DAO = new InstructorDAO();
        self::$learnerDAO = new LearnerDAO();
        self::$commonDAO = new CommonDAO();
        self::$user = $USER;
        self::$contextId = $CONTEXT->id;
        self::$linkId = $LINK->id;
    }

    /** Template function to add an alert for the banner */
    static function addAlert($data)
    {
        $message = $data['message'];
        // Default type to 'info' if not specified (in this demo it is optional in the route function)
        $type = $data['type'] ? $data['type'] : 'info';
        return self::$DAO->addAlert(self::$user->id, self::$contextId, self::$linkId, $message, $type);
    }

    /** Template function to update an alert for the banner */
    static function getCourseAlerts()
    {
        // Instructor can call learner DAO, but not the other way around
        return self::$learnerDAO->getCourseAlerts(self::$contextId);
    }

    /** Template function to delete an alert for the banner */
    static function deleteAlert($alertId)
    {
        // Don't need to return the result of a delete operation
        self::$DAO->deleteAlert($alertId);
    }
}
InstructorCtr::init();
