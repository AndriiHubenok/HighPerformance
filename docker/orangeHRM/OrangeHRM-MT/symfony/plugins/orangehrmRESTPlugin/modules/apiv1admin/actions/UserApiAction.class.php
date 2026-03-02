<?php
/**
 * OrangeHRM is a comprehensive Human Resource Management (HRM) System that captures
 * all the essential functionalities required for any enterprise.
 * Copyright (C) 2006 OrangeHRM Inc., http://www.orangehrm.com
 *
 * OrangeHRM is free software; you can redistribute it and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * OrangeHRM is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program;
 * if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA  02110-1301, USA
 */
 
use Orangehrm\Rest\Http\Request;
use Orangehrm\Rest\Api\Admin\UserAPI;
use Orangehrm\Rest\Api\Exception\NotImplementedException;
use Orangehrm\Rest\Api\Exception\BadRequestException;


class UserApiAction extends baseRestAction
{
    private $systemUserApi = null;
    private $systemUserService;

    public function getSystemUserService()
    {
        if (is_null($this->systemUserService)) {
            $this->systemUserService = new \SystemUserService();
        }
        return $this->systemUserService;
    }

    protected function init(Request $request)
    {
        $this->systemUserApi= new UserAPI($request);
    }

	//Anpassungen durch Prototyp
    protected function handleGetRequest(Request $request)
    {
        if ($this->checkPermission()) {
            return $this->systemUserApi->getSystemUsers();
        } else {
            throw new BadRequestException('You have no permission for this action.');
        }         
    }

	//Start Erweiterung des Prototyps
    protected function handlePostRequest(Request $request)
    {
        if ($this->checkPermission()) {
            return $this->systemUserApi->addSystemUser();
        } else {
            throw new BadRequestException('You have no permission for this action.');
        }  
    }

    protected function handlePutRequest(Request $request)
    {
        if ($this->checkPermission()) {
            return $this->systemUserApi->editSystemUser();
        } else {
            throw new BadRequestException('You have no permission for this action.');
        } 
    }

    protected function handleDeleteRequest(Request $request)
    {
        if ($this->checkPermission()) {
            return $this->systemUserApi->deleteSystemUser();
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
    //Ende Erweiterung des Prototyps

}
