<?php

class TenantService extends BaseService {

    private $tenantDao;

    public function __construct() {
        $this->tenantDao = new TenantDao();
    }

    public function getTenantList($column = null, $groupBy = null) {
        return $this->tenantDao->getTenantList();
    }

    public function getTenant($tenantId) {
        return $this->tenantDao->getTenant($tenantId);
    }

    public function saveTenant($tenant) {
        return $this->tenantDao->saveTenant($tenant);
    }

    public function deleteTenantById($deleteIds) {
        return $this->tenantDao->deleteTenantById($deleteIds);
    }

}