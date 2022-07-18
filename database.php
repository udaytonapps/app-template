<?php

// The SQL to uninstall this tool
$DATABASE_UNINSTALL = array();

/** Table names */
$TEMPLATE_ALERT_TABLE_NAME = "{$CFG->dbprefix}template_alert";
$TEMPLATE_COMMENT_TABLE_NAME = "{$CFG->dbprefix}template_comment";

/** Table schemas */
$TEMPLATE_ALERT = "CREATE TABLE {$TEMPLATE_ALERT_TABLE_NAME} (

    /* PRIMARY KEY */
    alert_id                INTEGER NOT NULL AUTO_INCREMENT,
    
    /* COMMON COLS */
    user_id                 INTEGER NOT NULL, /* ID of the instructor the created the settings */
    context_id              INTEGER NOT NULL, /* Tracked and scoped, this is the course */
    link_id                 INTEGER NOT NULL, /* Tracked but not scoped, this is the instance */
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    /* TEMPLATE ALERT COLS */
    alert_message           TEXT NOT NULL,
    alert_type              VARCHAR(255) NOT NULL,

    PRIMARY KEY(alert_Id)

) ENGINE = InnoDB DEFAULT CHARSET=utf8";

$TEMPLATE_COMMENT = "CREATE TABLE {$TEMPLATE_COMMENT_TABLE_NAME} (

    /* PRIMARY KEY */
    comment_id              INTEGER NOT NULL AUTO_INCREMENT,
    
    /* COMMON COLS */
    user_id                 INTEGER NOT NULL, /* ID of the instructor the created the settings */
    context_id              INTEGER NOT NULL, /* Tracked and scoped, this is the course */
    link_id                 INTEGER NOT NULL, /* Tracked but not scoped, this is the instance */
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    /* TEMPLATE COMMENT COLS */
    comment_message         TEXT NOT NULL,

    PRIMARY KEY(comment_id)

) ENGINE = InnoDB DEFAULT CHARSET=utf8";

/** Table installation (if tables don't exist) */
$DATABASE_INSTALL = array(
    array($TEMPLATE_ALERT_TABLE_NAME, $TEMPLATE_ALERT),
    array($TEMPLATE_COMMENT_TABLE_NAME, $TEMPLATE_COMMENT),
);
