<?php

namespace Orangehrm\Rest\Api\Pim\Entity;

use Orangehrm\Rest\Api\Entity\Serializable;

class EmployeeBonussalary implements Serializable
{
    private $id = '';

    private $emp_id = '';

    private $tenant_id = '';

    private $year = '';

    private $value = '';


    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getEmpId()
    {
        return $this->emp_id;
    }

    public function setEmpId($emp_id)
    {
        $this->emp_id = $emp_id;
    }

    public function getTenantId()
    {
        return $this->tenant_id;
    }

    public function setTenantId($tenant_id)
    {
        $this->tenant_id = $tenant_id;
    }

    public function getYear()
    {
        return $this->year;
    }

    public function setYear($year)
    {
        $this->year = $year;
    }

    public function getValue()
    {
        return $this->value;
    }

    public function setValue($value)
    {
        $this->value = $value;
    }

    public function toArray()
    {
        return array(
            //'id' => $this->getId(),
            //'empId' => $this->getEmpId(),
            //'tenantId' => $this->getTenantId(),
            'year' => $this->getYear(),
            'value' => $this->getValue()
        );
    }

    public function build($bonussalary)
    {
        $this->setId($bonussalary->id);
        $this->setEmpId($bonussalary->emp_id);
        $this->setTenantId($bonussalary->tenant_id);
        $this->setYear($bonussalary->year);
        $this->setValue($bonussalary->value);

    }

}