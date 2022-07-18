<?php

require_once __DIR__ . '/simplePHPRouter/Route.php';

/** Basic extension around the Steampixel router */
class AppRouter extends Steampixel\Route
{
    /** Send the response in json format */
    static function sendJson($res)
    {
        // Response from this API should always be in JSON format
        header('Content-Type: application/json');
        if (gettype($res) === 'string' && self::isHTML($res)) {
            return json_encode(array('status' => "error", "message" => $res));
        } else if (isset($res['error']) || isset($res['Error'])) {
            if (!isset($res['error'])) {
                $res['error'] = $res['Error'];
            }
            if (http_response_code() == 200) {
                http_response_code(404);
            }
            return json_encode(array('status' => "error", "message" => $res['error']));
        } else {
            return json_encode(array('status' => "success", "data" => $res));
        }
    }

    static private function isHTML($res)
    {
        return ($res != strip_tags($res));
    }

    static function handleDefaultRequest()
    {
        $res = array("error" => "Invalid route");
        return self::sendJson($res);
    }

    static function initializeAppRouting()
    {
        // Calculate the base path (could depend on tool/environment)
        $apiBasePath = self::getApiBasePath();

        // Run the router
        self::run($apiBasePath);
    }

    static function restrictToInstructor($resource)
    {
        $base = self::getApiBasePath();
        if (str_contains($base, $resource)) {
            // Then, check to verify current USER has the instructor role
            return self::sendJson(array('Should be restricted' => true));
        }
    }

    /**
     * Returns an associative array of the request body
     * Only copies over the properties specified in $requiredData and $optionalData
     * If required fields are missing, returns null
     */
    static function assembleRouteData($requiredData, $optionalData)
    {
        $body = json_decode(file_get_contents('php://input'), true);
        $data = array();
        // Check the required properties for any missing data
        foreach ($requiredData as $requiredProp) {
            if (!isset($body[$requiredProp])) {
                return null;
            } else {
                $data[$requiredProp] = $body[$requiredProp];
            }
        }
        // Otherwise, assemble the data from the request body
        foreach ($optionalData as $optionalProp) {
            if (isset($body[$optionalProp])) {
                $data[$optionalProp] = $body[$optionalProp];
            }
        }
        return $data;
    }

    private static function getApiBasePath()
    {
        $uri = $_SERVER['REQUEST_URI'];
        $apiResource = "/api/index.php";
        $base = substr($uri, 0, strpos($uri, $apiResource));
        $apiBasePath = $base . $apiResource;
        return $apiBasePath;
    }
};
