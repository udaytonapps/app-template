<?php

/** DAO class methods/properties are not static as prefix string cannot be easily embedded */

/** Holds methods for retrieving data from the db */
class CommonDAO
{
    protected $p;
    protected $PDOX;

    public function __construct()
    {
        global $CFG, $PDOX;

        $this->p = $CFG->dbprefix;
        $this->PDOX = $PDOX;
    }

    public function getUserContact($id)
    {
        $query = "SELECT displayname, email FROM {$this->p}lti_user
        WHERE user_id = :id;";
        $arr = array(':id' => $id);
        return $this->PDOX->rowDie($query, $arr);
    }
}
