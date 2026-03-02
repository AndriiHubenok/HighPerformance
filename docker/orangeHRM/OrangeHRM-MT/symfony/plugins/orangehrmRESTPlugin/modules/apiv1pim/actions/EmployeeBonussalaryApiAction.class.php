<?php

use Orangehrm\Rest\Http\Request;
use Orangehrm\Rest\Api\Pim\EmployeeBonussalaryAPI;
use Orangehrm\Rest\Api\Exception\BadRequestException;

class EmployeeBonussalaryApiAction extends baseRestAction
{
    private $apiEmployeeBonussalary = null;
    private $userId;

    const GRANT_TYPE_FAIL = array("grant type error" => "please use a password credentials grant type for this action");

    protected function init(Request $request)
    {
        $this->apiEmployeeBonussalary = new EmployeeBonussalaryAPI($request);
    }

    protected function handleGetRequest(Request $request)
    {
        if ($this->checkGrantType()) {
            return $this->apiEmployeeBonussalary->getEmployeeBonussalary($this->userId);
        } else {
            throw new BadRequestException('Please use a password credentials grant type for this action');
        } 
    }

    protected function handlePostRequest(Request $request)
    {
        if ($this->checkGrantType()) {
            return $this->apiEmployeeBonussalary->saveEmployeeBonussalary($this->userId);
        } else {
            throw new BadRequestException('Please use a password credentials grant type for this action');
        }
    }

    protected function handleDeleteRequest(Request $request)
    {
        if ($this->checkGrantType()) {
            return $this->apiEmployeeBonussalary->deleteEmployeeBonussalary($this->userId);
        } else {
            throw new BadRequestException('Please use a password credentials grant type for this action');
        }
    }


    protected function checkGrantType(){

        $this->userId = $this->getAccessorUserId();
        return (!is_null($this->userId)) ? true : false;

    }

    protected function getAccessorUserId(){

        $server = $this->getOAuthServer();
        $oauthRequest = $this->getOAuthRequest();
        $oauthResponse = $this->getOAuthResponse();
        $accessTokenData = $server->getResourceController()->getAccessTokenData($oauthRequest, $oauthResponse);

        return $accessTokenData['user_id'];

    }



}

