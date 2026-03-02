<?php

namespace Orangehrm\Rest\Api\Admin;

use Orangehrm\Rest\Api\Admin\Entity\Tenant;
use Orangehrm\Rest\Api\Admin\Entity\User;
use Orangehrm\Rest\Api\EndPoint;
use Orangehrm\Rest\Api\Exception\RecordNotFoundException;
use Orangehrm\Rest\Http\Response;
use Orangehrm\Rest\Api\Exception\InvalidParamException;
use Orangehrm\Rest\Api\Exception\BadRequestException;

class TenantUserAPI extends EndPoint
{
    const PARAMETER_ID = "id";
    const PARAMETER_USER_ID = "userId";

    private $systemUserService;
    private $tenantService;

    public function getTenantService() {
        if(is_null($this->tenantService)) {
            $this->tenantService = new \TenantService();
        }
        return $this->tenantService;
    }

    public function getSystemUserService()
    {
        if (is_null($this->systemUserService)) {
            $this->systemUserService = new \SystemUserService();
        }
        return $this->systemUserService;
    }


    public function getTenantUser()
    {
        $tenantId = $this->getRequestParams()->getUrlParam(self::PARAMETER_ID);
        $this->checkTenantId($tenantId);

        $tenantUserList = $this->getSystemUserService()->getSystemUserByTenantId($tenantId);

        $response = null;

        foreach ($tenantUserList as $tenantUser) {

            $user = new User();
            $user->buildUser($tenantUser);
            $response[] = $user->toArray();

        }
        if (count($response) > 0) {
            return new Response($response);
        } else {
            throw new RecordNotFoundException('No Users For This Tenant Found');
        }
    }

    public function addTenantUser()
    {
        $tenantId = $this->getRequestParams()->getUrlParam(self::PARAMETER_ID);
        $userId = $this->getRequestParams()->getUrlParam(self::PARAMETER_USER_ID);

        if (empty($userId)) {
            throw new InvalidParamException('UserID Must Not Be Empty');
        }

        $user = $this->getSystemUserService()->getSystemUser($userId);
        if (empty($user)){
            throw new InvalidParamException('No Matching User For Given ID Found');
        }

        $userTenantId = $user->tenant_id;
        if (!is_null($userTenantId)){
            throw new InvalidParamException('User Already Member Of A Tenant');
        }

        $this->getSystemUserService()->setUserTenant($userId, $tenantId);
        
        return new Response(array('success' => 'Successfully Added'));
        
    }

    public function deleteTenantUser()
    {
        $tenantId = $this->getRequestParams()->getUrlParam(self::PARAMETER_ID);
        $userId = $this->getRequestParams()->getUrlParam(self::PARAMETER_USER_ID);
        
        if (empty($userId)) {
            throw new InvalidParamException('UserID Must Not Be Empty');
        }

        $user = $this->getSystemUserService()->getSystemUser($userId);
        if (empty($user)){
            throw new InvalidParamException('No Matching User For Given ID Found');
        }

        $userTenantId = $user->tenant_id;
        if ($userTenantId != $tenantId){
            throw new InvalidParamException('User Not A Member Of This Tenant');
        }

        $users = array();
        $users[] = $userId;

        $deletedUser = $this->getSystemUserService()->deleteUserFromTenant($users);

        return new Response(array('success' => 'Successfully Deleted'));
    }

    protected function checkTenantId($tenantId){
        $tenant = $this->getTenantService()->getTenant($tenantId);
        if (count($tenant) == 0) {
            throw new InvalidParamException('No Matching Tenant For Given ID Found');
        }
    }


}
