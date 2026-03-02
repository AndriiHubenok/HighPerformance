<?php

class deleteUserFromTenantAction extends baseAdminAction {    
    
    private $systemUserService;

    public function getSystemUserService() {
        $this->systemUserService = new SystemUserService();
        return $this->systemUserService;
    }

    public function execute($request) {

        $tenantId = $request->getParameter('tenantId');
       
        if ($request->isMethod('post')) {

            $deleteIds = $request->getParameter('delUserFromTenant');

            if (count($deleteIds) > 0) {
                    $this->getSystemUserService()->deleteUserFromTenant($deleteIds);
                    $this->getUser()->setFlash('success', __(TopLevelMessages::DELETE_SUCCESS));
            }
        }

        $this->redirect('admin/editTenant?tenantId='. $tenantId);
    }

}
?>