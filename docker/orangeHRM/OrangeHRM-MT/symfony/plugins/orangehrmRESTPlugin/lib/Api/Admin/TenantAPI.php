<?php

namespace Orangehrm\Rest\Api\Admin;

use Orangehrm\Rest\Api\Admin\Entity\Tenant;
use Orangehrm\Rest\Api\EndPoint;
use Orangehrm\Rest\Api\Exception\RecordNotFoundException;
use Orangehrm\Rest\Http\Response;
use Orangehrm\Rest\Api\Exception\InvalidParamException;
use Orangehrm\Rest\Api\Exception\BadRequestException;

class TenantAPI extends EndPoint
{
    const PARAMETER_ID = "id";
    const PARAMETER_TENANT_NAME = "tenantName";
    const PARAMETER_TENANT_ATTRIBUTE = "tenantAttribute";

    private $tenantService;

    public function getTenantService() {
        if(is_null($this->tenantService)) {
            $this->tenantService = new \TenantService();
        }
        return $this->tenantService;
    }

    public function getTenant()
    {
        $tenantList = $this->getTenantService()->getTenantList();

        $response = null;

        foreach ($tenantList as $tenant) {

            $tenantEntity = new Tenant();
            $tenantEntity->build($tenant);
            $response[] = $tenantEntity->toArray();

        }
        if (count($response) > 0) {
            return new Response($response);
        } else {
            throw new RecordNotFoundException('No Bonussalary Found');
        }
    }

    public function addTenant()
    {
        $name = $this->getRequestParams()->getUrlParam(self::PARAMETER_TENANT_NAME);
        $attribute = $this->getRequestParams()->getUrlParam(self::PARAMETER_TENANT_ATTRIBUTE);

        if (empty($name)) {
            throw new InvalidParamException('Name Must Not Be Empty');
        }

        $tenant = new \Tenant();
        $tenant->setTenantName($name);
        $tenant->setTenantAttribute($attribute);

        $savedTenant = $this->getTenantService()->saveTenant($tenant);
        
        if ($savedTenant) {
            return new Response(array('success' => 'Successfully Added'));
        } else {
            throw new BadRequestException('Tenant already exists');
        }
        
    }

    public function deleteTenant()
    {
        $tenantId = $this->getRequestParams()->getUrlParam(self::PARAMETER_ID);
        
        if (empty($tenantId)) {
            throw new InvalidParamException('ID Must Not Be Empty');
        }

        $tenantIds = array();
        $tenantIds[0] = $tenantId;

        $deletedTenant = $this->getTenantService()->deleteTenantById($tenantIds);

        if ($deletedTenant == 1){
            return new Response(array('success' => 'Successfully Deleted'));
        } else {
            throw new InvalidParamException('No Matching Tenant For Given ID Found');
        }

    }


}
