<?php

namespace Orangehrm\Rest\Api\Pim;

use Orangehrm\Rest\Api\EndPoint;
use Orangehrm\Rest\Api\Exception\BadRequestException;
use Orangehrm\Rest\Api\Exception\RecordNotFoundException;
use Orangehrm\Rest\Api\Exception\InvalidParamException;
use Orangehrm\Rest\Api\Pim\Entity\EmployeeBonussalary;
use Orangehrm\Rest\Http\Response;

class EmployeeBonussalaryAPI extends EndPoint{

    const PARAMETER_ID = "id";
    const PARAMETER_YEAR = "year";
    const PARAMETER_VALUE = "value";

    protected $bonussalaryService;
    protected $employeeService;
    protected $systemUserService;

    public function getBonussalaryService() {
        if(is_null($this->bonussalaryService)) {
            $this->bonussalaryService = new \BonussalaryService();
        }
        return $this->bonussalaryService;
    }
        
    public function getSystemUserService() {
        $this->systemUserService = new \SystemUserService();
        return $this->systemUserService;
    }

    protected function getEmployeeService()
    {
        if ($this->employeeService != null) {
            return $this->employeeService;
        } else {
            return new \EmployeeService();
        }
    }

    public function getEmployeeBonussalary($userId)
    {
        $this->checkEmloyeeId();
        $empId = $this->getRequestParams()->getUrlParam(self::PARAMETER_ID);        
        $tenantId = $this->getSystemUserService()->getSystemUser($userId)->tenant_id;

        $bonussalaryList = $this->getBonussalaryService()->getBonussalaryList($empId, $tenantId);
        
        $response = null;

        foreach ($bonussalaryList as $bonussalary) {

            $empBonussalary = new EmployeeBonussalary();
            $empBonussalary->build($bonussalary);
            $response[] = $empBonussalary->toArray();

        }
        if (count($response) > 0) {
            return new Response($response);
        } else {
            throw new RecordNotFoundException('No Bonussalary Found');
        }

    }

    public function saveEmployeeBonussalary($userId)
    {
        $this->checkEmloyeeId();

        $empId = $this->getRequestParams()->getUrlParam(self::PARAMETER_ID);
        $year =  $this->getRequestParams()->getUrlParam(self::PARAMETER_YEAR);
        $value = $this->getRequestParams()->getUrlParam(self::PARAMETER_VALUE);
        $tenantId = $this->getSystemUserService()->getSystemUser($userId)->tenant_id;      
        

        if (empty($year)) {
            throw new InvalidParamException('Year Must Not Be Empty');
        }
        if (empty($value)) {
            throw new InvalidParamException('Value Must Not Be Empty');
        }

        $bonussalary = new \Bonussalary();
        $bonussalary->setEmpId($empId);
        $bonussalary->setTenantId($tenantId);
        $bonussalary->setYear($year);
        $bonussalary->setValue($value);

        $result = $this->getBonussalaryService()->saveBonussalary($bonussalary);

        if ($result instanceof \Bonussalary) {
            return new Response(array('success' => 'Successfully Saved'));
        } else {
            throw new BadRequestException();
        }
    }

    public function deleteEmployeeBonussalary($userId)
    {
        $this->checkEmloyeeId();

        $empId = $this->getRequestParams()->getUrlParam(self::PARAMETER_ID);
        $year =  $this->getRequestParams()->getUrlParam(self::PARAMETER_YEAR);
        $tenantId = $this->getSystemUserService()->getSystemUser($userId)->tenant_id;      

        if (empty($year)) {
            throw new InvalidParamException('Year Must Not Be Empty');
        }

        $result = $this->getBonussalaryService()->deleteBonussalary($empId, $tenantId, $year);

        if ($result>0){
            return new Response(array('success' => 'Successfully Deleted'));
        } else {
            return new Response(array('failed' => 'No Matching Bonussalary Found'));
        } 
    }

    private function checkEmloyeeId(){
        $employee = $this->getEmployeeService()->getEmployee($this->getRequestParams()->getUrlParam(self::PARAMETER_ID));
        if (empty($employee)) {
            throw new InvalidParamException('No Matching Employee For Given ID Found');
        }
    }


}
