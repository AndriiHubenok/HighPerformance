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

namespace Orangehrm\Rest\Api\Admin\Entity;

use Orangehrm\Rest\Api\Entity\Serializable;

//Anpassung durch Prototyp bzgl Tenant ID
class User implements Serializable
{

    /**
     * @var
     */
    private $id;
    private $userName;
    private $userRole;
    private $employeeName;
    private $status;
    private $employeeId;
    private $tenantId;

    const ENABLED = 'Enabled';
    const DISABLED = 'Disabled';

    public function getId(){
        return $this->id;
    }

    public function setId($id){
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getUserName()
    {
        return $this->userName;
    }

    /**
     * @param mixed $userName
     */
    public function setUserName($userName)
    {
        $this->userName = $userName;
    }

    /**
     * @return mixed
     */
    public function getUserRole()
    {
        return $this->userRole;
    }

    /**
     * @param mixed $userRole
     */
    public function setUserRole($userRole)
    {
        $this->userRole = $userRole;
    }

    /**
     * @return mixed
     */
    public function getEmployeeName()
    {
        return $this->employeeName;
    }

    /**
     * @param mixed $employeeName
     */
    public function setEmployeeName($employeeName)
    {
        $this->employeeName = $employeeName;
    }

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param mixed $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }

    /**
     * @return mixed
     */
    public function getEmployeeId()
    {
        return $this->employeeId;
    }

    /**
     * @param mixed $employeeId
     */
    public function setEmployeeId($employeeId)
    {
        $this->employeeId = $employeeId;
    }

    public function getTenantId(){
        return $this->tenantId;
    }

    public function setTenantId($tenantId){
        $this->tenantId = $tenantId;
    }

    public function buildUser(\SystemUser $user)
    {
        $this->setId($user->getId());
        $this->setStatus($this->getUserStatus($user->getStatus()));
        $this->setEmployeeName($user->getEmployee()->getFullName());
        $this->setUserRole($user->getUserRole());
        $this->setUserName($user->getUserName());
        $this->setEmployeeId($user->getEmpNumber());
        $this->setTenantId($user->getTenantId());
    }

    public function toArray()
    {
        return array(
            'id' => $this->getId(),
            'userName' => $this->getUserName(),
            'userRole' => $this->getUserRole()->getName(),
            'status' => $this->getStatus(),
            'employeeName' => $this->getEmployeeName(),
            'employeeId'   => $this->getEmployeeId(),
            'tenantId'   => $this->getTenantId()
        );
    }

    protected function getUserStatus($id){
        if(1 == $id){
            return self::ENABLED;
        }else {
            return self::DISABLED;
        }
}

}
