<?php

use Orangehrm\Rest\Http\Request;
use Orangehrm\Rest\Api\Admin\TenantAPI;
use Orangehrm\Rest\Api\Exception\NotImplementedException;
use Orangehrm\Rest\Api\Exception\BadRequestException;


class TenantApiAction extends baseRestAction
{
    private $systemUserService;
    private $tenantApi = null;

    public function getSystemUserService()
    {
        if (is_null($this->systemUserService)) {
            $this->systemUserService = new \SystemUserService();
        }
        return $this->systemUserService;
    }

    protected function init(Request $request)
    {
        $this->tenantApi= new TenantAPI($request);
    }

    protected function handleGetRequest(Request $request)
    {
        if ($this->checkPermission()) {
            return $this->tenantApi->getTenant();
        } else {
            throw new BadRequestException('You have no permission for this action.');
        }         
    }

    protected function handlePostRequest(Request $request)
    {
        if ($this->checkPermission()) {
            return $this->tenantApi->addTenant();
        } else {
            throw new BadRequestException('You have no permission for this action.');
        }  
    }

    protected function handleDeleteRequest(Request $request)
    {
        if ($this->checkPermission()) {
            return $this->tenantApi->deleteTenant();
        } else {
            throw new BadRequestException('You have no permission for this action.');
        } 
    }


    protected function checkPermission(){

        $userId = $this->getAccessorUserId();
        
        if (!$this->checkGrantType($userId)) {
            throw new BadRequestException('Please use a password credentials grant type for this action');
        }

        $userrole = $this->getSystemUserService()->getSystemUser($userId)->user_role_id;

        return ($userrole == 8 ? true : false);

    }

    protected function checkGrantType($userId){

        return (!is_null($userId)) ? true : false;

    }

    protected function getAccessorUserId(){

        $server = $this->getOAuthServer();
        $oauthRequest = $this->getOAuthRequest();
        $oauthResponse = $this->getOAuthResponse();
        $accessTokenData = $server->getResourceController()->getAccessTokenData($oauthRequest, $oauthResponse);

        return $accessTokenData['user_id'];

    }

}
