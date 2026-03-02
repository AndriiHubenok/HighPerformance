<?php

class viewTenantsAction extends baseAdminAction {

    const TENANT_ALREADY_EXISTS = "Tenant With Such Name And Attribute Already Exists";

    private $tenantService;

    public function getTenantService() {
        if(is_null($this->tenantService)) {
            $this->tenantService = new TenantService();
        }
        return $this->tenantService;
    }

    public function execute($request) {

        $this->form = new TenantForm();

        if ($this->getRequest()->isMethod('post')) {
                
            $this->form->bind($request->getParameter($this->form->getName()));

            if ($this->form->isValid()) {
                if ($this->form->save()){
                    $this->getUser()->setFlash('success', __(TopLevelMessages::SAVE_SUCCESS));
                } else {
                    $this->getUser()->setFlash('error', self::TENANT_ALREADY_EXISTS);
                }               
            } else {
                $this->handleBadRequest();
                $this->forwardToSecureAction();
            }
        }

        $this->tenantList = $this->getTenantService()->getTenantList();
    }

}