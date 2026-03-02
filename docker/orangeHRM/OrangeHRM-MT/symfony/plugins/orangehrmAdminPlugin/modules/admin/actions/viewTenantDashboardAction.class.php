<?php

class viewTenantDashboardAction extends baseAdminAction {

    private $bsalaryService;

    public function getBonussalaryService() {
        if(is_null($this->bsalaryService)) {
            $this->bsalaryService = new BonussalaryService();
        }
        return $this->bsalaryService;
    }

    public function execute($request) {
    
        $this->form = new SearchBonussalaryForm();

        if ($request->isMethod('post')) {
            $this->form->bind($request->getParameter($this->form->getName()));
            if ($this->form->isValid()) {
                $searchClues = $this->_setSearchClues();
            }else{
                $this->handleBadRequest();
                $this->forwardToSecureAction();
            }
        }

        $bonussalaryList = $this->getBonussalaryService()->getBonussalaryTotal($searchClues);
        $this->_setListComponent($bonussalaryList);
    }

    private function _setListComponent($bonussalaryList) {

        $configurationFactory = $this->getBonussalaryHeaderFactory();

        ohrmListComponent::setConfigurationFactory($configurationFactory);
        ohrmListComponent::setListData($bonussalaryList);
    }

    protected function getBonussalaryHeaderFactory() {

        return new BonussalaryHeaderFactory();
    }

    private function _setSearchClues() {
               
        $searchClues = array(
            'employee' => $this->form->getValue('employee'),
            'tenant_name' => $this->form->getValue('tenant_name'),
            'tenant_attribute' => $this->form->getValue('tenant_attribute'),
            'year' => $this->form->getValue('year'),
            'value' => $this->form->getValue('value')
        );

        return $searchClues;
    }
}

