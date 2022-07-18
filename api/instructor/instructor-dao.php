<?php

/** DAO class methods/properties are not static as prefix string cannot be easily embedded */

/** Holds methods for retrieving data from the db */
class InstructorDAO
{
    protected $alertTable;
    protected $commentTable;
    protected $PDOX;

    public function __construct()
    {
        global $CFG, $PDOX;

        $this->alertTable = $CFG->dbprefix . "template_alert";
        $this->commentTable = $CFG->dbprefix . "template_comment";
        $this->PDOX = $PDOX;
    }

    /** Adds an alert with multiple identifying IDs */
    public function addAlert($userId, $contextId, $linkId, $alertMessage, $alertType)
    {
        $query = "INSERT INTO {$this->alertTable} (user_id, context_id, link_id, alert_message, alert_type)
        VALUES (:userId, :contextId, :linkId, :alertMessage, :alertType);";
        $arr = array(':userId' => $userId, ':contextId' => $contextId, ':linkId' => $linkId, ':alertMessage' => $alertMessage, ':alertType' => $alertType);
        $this->PDOX->queryDie($query, $arr);
        return $this->PDOX->lastInsertId();
    }

    /** Deletes an alert by ID */
    public function deleteAlert($alertId)
    {
        $query = "DELETE FROM {$this->alertTable}
        WHERE alert_id = :alertId";
        $arr = array(':alertId' => $alertId);
        return $this->PDOX->queryDie($query, $arr);
    }
}
