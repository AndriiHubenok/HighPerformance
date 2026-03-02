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

namespace Orangehrm\Rest\Api\Admin;

use Orangehrm\Rest\Api\Admin\Entity\User;
use Orangehrm\Rest\Api\EndPoint;
use Orangehrm\Rest\Api\Exception\RecordNotFoundException;
use Orangehrm\Rest\Http\Response;
use Orangehrm\Rest\Api\Exception\InvalidParamException;
use Orangehrm\Rest\Api\Exception\BadRequestException;

class UserAPI extends EndPoint
{
	
	//Anpassungen durch Prototyp für Tenant spezifische Variablen, Konstanten und Servicefunktionen
    const PARAMETER_USER_NAME = 'userName';
    const PARAMETER_USER_TYPE = 'userRole';
    const PARAMETER_EMPLOYEE_ID = 'employeeId';
    const PARAMETER_OFFSET = 'offset';
    const PARAMETER_LIMIT = 'limit';
    const PARAMETER_USER_PASSWORD = "userPassword";
    const PARAMETER_TENANT = "tenantId";
    const PARAMETER_USER_ID = "userId";

    private $systemUserService;
    private $tenantService;

    public function getSystemUserService()
    {
        if (is_null($this->systemUserService)) {
            $this->systemUserService = new \SystemUserService();
        }
        return $this->systemUserService;
    }

    public function getTenantService() {
        if(is_null($this->tenantService)) {
            $this->tenantService = new \TenantService();
        }
        return $this->tenantService;
    }

    public function getSystemUsers()
    {
        $parameterObject = $this->getSearchParameters();
        $systemUserList = $this->getSystemUserService()->searchSystemUsers($parameterObject);

        $responseList = null;
        if (!count($systemUserList) == 0) {
            foreach ($systemUserList as $user) {
                $systemUser = new User();
                $systemUser->buildUser($user);
                $responseList[] = $systemUser->toArray();
            }
            return new Response($responseList);
        }else {
            throw new RecordNotFoundException('No Users Found');
        }

    }

    private function getSearchParameters()
    {
        $searchParameters = array(

            'userName' => $this->getRequestParams()->getUrlParam(self::PARAMETER_USER_NAME),
            'userType' => $this->getRequestParams()->getUrlParam(self::PARAMETER_USER_TYPE),
            'employeeId' => $this->getRequestParams()->getUrlParam(self::PARAMETER_EMPLOYEE_ID),
            'offset' => $this->getRequestParams()->getUrlParam(self::PARAMETER_OFFSET),
            'limit' => $this->getRequestParams()->getUrlParam(self::PARAMETER_LIMIT),
            'use_ids' => array(1, 2)
        );

        return $searchParameters;
    }

	//Start Erweiterung des Prototyps
    public function addSystemUser()
    {
        $username = $this->getRequestParams()->getUrlParam(self::PARAMETER_USER_NAME);
        $password = $this->getRequestParams()->getUrlParam(self::PARAMETER_USER_PASSWORD);
        $tenantId = $this->getRequestParams()->getUrlParam(self::PARAMETER_TENANT);

        if (empty($username)) {
            throw new InvalidParamException('Username Must Not Be Empty');
        }
        if (empty($password)) {
            throw new InvalidParamException('Password Must Not Be Empty');
        }
        if (!empty($tenantId)) {
            $this->checkTenantId($tenantId);
        }

        $user = new \SystemUser();
        $user->setUserRoleId(1);
        $user->setUserName($username);
        $user->setUserPassword($password);
        $user->setDateEntered(date('Y-m-d H:i:s'));
        $user->setTenantId($tenantId);

        $savedUser = $this->getSystemUserService()->saveSystemUser($user, true);
        
        if ($savedUser instanceof \SystemUser) {
            return new Response(array('success' => 'Successfully Added'));
        } else {
            throw new BadRequestException();
        }
        
    }

    public function deleteSystemUser()
    {
        $userId = $this->getRequestParams()->getUrlParam(self::PARAMETER_USER_ID);
        
        if (empty($userId)) {
            throw new InvalidParamException('UserId Must Not Be Empty');
        }

        $userIds = array();
        $userIds[0] = $userId;

        $this->getSystemUserService()->deleteSystemUsers($userIds);

        return new Response(array('success' => 'Successfully Deleted'));

    }

    public function editSystemUser()
    {
        $userid = $this->getRequestParams()->getUrlParam(self::PARAMETER_USER_ID);
        $password = $this->getRequestParams()->getUrlParam(self::PARAMETER_USER_PASSWORD);
        $tenantId = $this->getRequestParams()->getUrlParam(self::PARAMETER_TENANT);

        if (empty($userid)) {
            throw new InvalidParamException('UserId Must Not Be Empty');
        }

        if (empty($password) && empty($tenantId)){
            throw new InvalidParamException('Password or TenantId Must Not Be Empty');
        }

        if (!empty($password)){
            $this->getSystemUserService()->updatePassword($userid, $password);
        }

        if (!empty($tenantId)){
            $this->checkTenantId($tenantId);
            $this->getSystemUserService()->setUserTenant($userid, $tenantId);
        }

        $active = $this->getSystemUserService()->reactivateSystemUser($userid);

        return new Response(array('success' => 'Successfully Changed'));

    }

    private function checkTenantId($tenantId){
        $tenant = $this->getTenantService()->getTenant($tenantId)->count();
        if ($tenant == 0) {
            throw new InvalidParamException('No Matching Tenant For Given ID Found');
        }
    }
    //Ende Erweiterung des Prototyps	

}
