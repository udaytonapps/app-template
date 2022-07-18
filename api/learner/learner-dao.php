<?php

/** DAO class methods/properties are not static as prefix string cannot be easily embedded */

/** Holds methods for retrieving data from the db */
class LearnerDAO
{
    protected $p;
    protected $alertTable;
    protected $commentTable;
    protected $PDOX;

    public function __construct()
    {
        global $CFG, $PDOX;

        $this->p = $CFG->dbprefix;
        $this->alertTable = $CFG->dbprefix . "template_alert";
        $this->commentTable = $CFG->dbprefix . "template_comment";
        $this->PDOX = $PDOX;
    }

    /** Retrieves alerts for a given context (course) */
    public function getCourseAlerts($contextId)
    {
        // These are being aliased to camelCase - may or may not be really necessary
        $query = "SELECT alert_id as `id`, alert_message as `message`, alert_type as `type` FROM {$this->alertTable}
        WHERE context_id = :contextId ORDER BY created_at DESC;";
        $arr = array(':contextId' => $contextId);
        return $this->PDOX->allRowsDie($query, $arr);
    }

    /** Adds a comment with multiple identifying IDs */
    public function addComment($userId, $contextId, $linkId, $commentText)
    {
        $query = "INSERT INTO {$this->commentTable} (user_id, context_id, link_id, comment_message)
        VALUES (:userId, :contextId, :linkId, :commentText);";
        $arr = array(':userId' => $userId, ':contextId' => $contextId, ':linkId' => $linkId, ':commentText' => $commentText);
        $this->PDOX->queryDie($query, $arr);
        return $this->PDOX->lastInsertId();
    }

    /** Retrieves alerts for a given context (course) */
    public function getCourseComments($contextId)
    {
        // These are being aliased to camelCase - may or may not be really necessary
        $query = "SELECT c.comment_id as `id`, c.comment_message as `text`, c.created_at as `createdAt`, u.displayname as learnerName FROM {$this->commentTable} c
        INNER JOIN {$this->p}lti_user u
            ON u.user_id = c.user_id
        WHERE c.context_id = :contextId ORDER BY c.created_at DESC;";
        $arr = array(':contextId' => $contextId);
        return $this->PDOX->allRowsDie($query, $arr);
    }
}
