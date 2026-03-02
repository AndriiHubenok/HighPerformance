<?php

class editTenantAction extends baseAdminAction {

    private $systemUserService;
    private $tenantService;

    public function getTenantService() {
        if(is_null($this->tenantService)) {
            $this->tenantService = new TenantService();
        }
        return $this->tenantService;
    }

    public function getSystemUserService() {
        $this->systemUserService = new SystemUserService();
        return $this->systemUserService;
    }

    public function execute($request) {

        $request->setParameter('initialActionName', 'viewTenants');

        $tenantId = $request->getParameter('tenantId');
        if (!($this->isTenant($tenantId))) { $this->redirect('admin/viewTenants'); }

        $this->tenant = $this->getTenantService()->getTenant($tenantId);
        $this->form = new AddUserToTenantForm();

        if ($this->getRequest()->isMethod('post')) {
            $this->form->bind($request->getParameter($this->form->getName()));
            if ($this->form->isValid()) {
                $this->form->add($tenantId);
                $this->getUser()->setFlash('success', __(TopLevelMessages::SAVE_SUCCESS));             
            } else {
                $this->handleBadRequest();
                $this->forwardToSecureAction();
            }
        }

        $this->userList = $this->getSystemUserService()->getSystemUserByTenantId($tenantId);
    }

    public function isTenant($tenantId) {

        if (is_null($tenantId)) {return false;}
        $count = $this->getTenantService()->getTenant($tenantId)->count();
        return ($count > 0);

    }

}