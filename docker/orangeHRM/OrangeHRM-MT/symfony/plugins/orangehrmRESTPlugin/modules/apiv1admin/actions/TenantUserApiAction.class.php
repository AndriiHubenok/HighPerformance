<?php

use Orangehrm\Rest\Http\Request;
use Orangehrm\Rest\Api\Admin\TenantUserAPI;
use Orangehrm\Rest\Api\Exception\NotImplementedException;
use Orangehrm\Rest\Api\Exception\BadRequestException;


class TenantUserApiAction extends baseRestAction
{
    private $systemUserService;
    private $tenantUserApi = null;

    public function getSystemUserService()
    {
        if (is_null($this->systemUserService)) {
            $this->systemUserService = new \SystemUserService();
        }
        return $this->systemUserService;
    }

    protected function init(Request $request)
    {
        $this->tenantUserApi= new TenantUserAPI($request);
    }

    protected function handleGetRequest(Request $request)
    {
        if ($this->checkPermission()) {
            return $this->tenantUserApi->getTenantUser();
        } else {
            throw new BadRequestException('You have no permission for this action.');
        }         
    }

    protected function handlePostRequest(Request $request)
    {
        if ($this->checkPermission()) {
            return $this->tenantUserApi->addTenantUser();
        } else {
            throw new BadRequestException('You have no permission for this action.');
        }  
    }

    protected function handleDeleteRequest(Request $request)
    {
        if ($this->checkPermission()) {
            return $this->tenantUserApi->deleteTenantUser();
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
