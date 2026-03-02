<?php

class TenantDao extends BaseDao {

    public function getTenantList($column = null, $groupBy = null) {
        
        try {
            $q = Doctrine_Query::create()
                            ->from('Tenant');

                if (!is_null($column)){
                    $q->select($column);
                }

                if (!is_null($groupBy)){
                    $q->groupBy($groupBy);
                }

            return $q->execute();
            
        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    }

    public function getTenant($tenantId) {
        
        try {
            $q = Doctrine_Query::create()
                            ->from('Tenant')
                            ->where('id = ?', $tenantId);

            return $q->execute();
            
        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }

    }

    public function saveTenant($tenant) {
        
        try {
            if ($this->checkTenantExists($tenant->getTenantName(), $tenant->getTenantAttribute())){
                return false;
            } else {
                $tenant->save();
                return true;
            }
        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    }

    public function deleteTenantById($deleteIds) {
        
        try {

            if (is_array($deleteIds) && count($deleteIds) > 0) {
                $q = Doctrine_Query::create()->delete('Tenant')
                                            ->whereIn('id', $deleteIds);                
                }
                
            return $q->execute();
            

        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    }

    public function checkTenantExists($tenantName, $tenantAttribute){

        try {
            $q = Doctrine_Query::create()
                            ->from('Tenant')
                            ->where('tenant_name = ?', $tenantName);
                if (is_null($tenantAttribute)){
                    $q->andWhere('tenant_attribute is NULL');
                } else {
                    $q->andWhere('tenant_attribute = ?', $tenantAttribute);
                } 

            return ($q->execute()->count() > 0 );

        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    }

   
}