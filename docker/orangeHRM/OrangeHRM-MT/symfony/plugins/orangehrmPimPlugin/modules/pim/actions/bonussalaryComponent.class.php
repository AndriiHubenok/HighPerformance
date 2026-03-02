<?php

class bonussalaryComponent extends sfComponent {

    private $bsalaryService;
    private $systemUserService;

    public function getBonussalaryService() {
        if(is_null($this->bsalaryService)) {
            $this->bsalaryService = new BonussalaryService();
        }
        return $this->bsalaryService;
    }
        
    public function getSystemUserService() {
        $this->systemUserService = new SystemUserService();
        return $this->systemUserService;
    }

    public function execute($request) {       

        $this->userID = $this->getUser()->getAttribute('user')->getUserId();
        $this->tenantID = $this->getSystemUserService()->getSystemUser($this->userID)->tenant_id;

        $this->bonussalaryList = $this->getBonussalaryService()->getBonussalaryList($this->empNumber, $this->tenantID);

        $params = array('empID' => $this->empNumber, 'tenantID' => $this->tenantID);
        $this->form = new BonussalaryForm(array(), $params);

    }   

}

?>