<?php

class deleteTenantAction extends baseAdminAction {    
    
    private $tenantService;

    public function getTenantService() {
        if(is_null($this->tenantService)) {
            $this->tenantService = new TenantService();
        }
        return $this->tenantService;
    }

    public function execute($request) {
       
        if ($request->isMethod('post')) {

            $deleteIds = $request->getParameter('delTenant');

            if (count($deleteIds) > 0) {
                    $this->getTenantService()->deleteTenantById($deleteIds);
                    $this->getUser()->setFlash('success', __(TopLevelMessages::DELETE_SUCCESS));
            }
        }

        $this->redirect('admin/viewTenants');
    }

}
?>