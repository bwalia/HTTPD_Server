<?php

require_once "JWT.php";

//define some functions we may need it later
function generateRandomString($length = 10) {
    return substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)) )),1,$length);
}

//authenticate_jwt function will generate a JWT token and pass it back to 4D
function authenticate_jwt($keyStr, $userNameStr, $serverISSStr)
    {
    
    $header = '{"typ":"JWT", "alg":"HS384"}';

	$tokenId    = base64_encode(generateRandomString(32)); //if mcrypt_create_iv PHP function is available then you could try mcrypt_create_iv(32)
	$issuedAt   = time();
	$expire     = $issuedAt + 60;            // Adding 60 seconds

	$payload = '{
		"iss":"'.$serverISSStr.'",
 		"iat":'.$issuedAt.',
 		"jti" : "'.$tokenId.'",
 		"exp" : '.$expire.',
 		"data" : "'.$userNameStr.'"
	}';
	    
	$JWT = new JWT;
	
    $JWT_TokenStr = $JWT->encode($header, $payload, $keyStr);
    return $JWT_TokenStr;
    
    }

?>