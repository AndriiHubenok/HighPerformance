<?php

class SearchBonussalaryForm extends BaseForm {

    private $bsalaryService;
    private $tenantService;
    private $employeeService;

    public function getEmployeeService() {
        if (is_null($this->employeeService)) {
            $this->employeeService = new EmployeeService();
            $this->employeeService->setEmployeeDao(new EmployeeDao());
        }
        return $this->employeeService;
    }
   
    public function getBonussalaryService() {
        if(is_null($this->bsalaryService)) {
            $this->bsalaryService = new BonussalaryService();
        }
        return $this->bsalaryService;
    }

    public function getTenantService() {
        if(is_null($this->tenantService)) {
            $this->tenantService = new TenantService();
        }
        return $this->tenantService;
    }

    public function configure() {

        
        $tenantList = $this->getTenantList();
        $attributeList = $this->getTenantAttributeList();
        $yearList = $this->getYearList();
        $valueList = $this->getValueChoices();
        $employeeList = $this->getEmployeeList();


        $widgets = array();
        $widgets['employee'] = new sfWidgetFormSelect(array('choices' => $employeeList));
        $widgets['tenant_name'] = new sfWidgetFormSelect(array('choices' => $tenantList));
        $widgets['tenant_attribute'] = new sfWidgetFormSelect(array('choices' => $attributeList));
        $widgets['year'] = new sfWidgetFormSelect(array('choices' => $yearList));
        $widgets['value'] = new sfWidgetFormSelect(array('choices' => $valueList)); 
        $this->setWidgets($widgets);
        
        
        $validators = array();
        $validators['employee'] = new sfValidatorChoice(array('required' => false, 
                'choices' => array_keys($employeeList))); 
        $validators['tenant_name'] = new sfValidatorChoice(array('required' => false, 
                'choices' => array_keys($tenantList))); 
        $validators['tenant_attribute'] = new sfValidatorChoice(array('required' => false, 
                'choices' => array_keys($attributeList)));                
        $validators['year'] = new sfValidatorChoice(array('required' => false, 
                'choices' => array_keys($yearList))); 
        $validators['value'] = new sfValidatorChoice(array('required' => false, 
                'choices' => array_keys($valueList)));   
        $this->setValidators($validators);

        $this->getWidgetSchema()->setNameFormat('searchBonussalary[%s]');
        $this->getWidgetSchema()->setLabels($this->getFormLabels());
        

    }

    public function getEmployeeList(){
        $list = array();
        $list[''] = __("All");
        $employees = $this->getEmployeeService()->getEmployeeList();
        foreach ($employees as $employee) {
            $list[$employee->empNumber] = $employee->firstName . " " . $employee->lastName;
        }
        return $list;
    }

    private function getTenantList() {
        $list = array();
        $list[''] = __("All");
        $tenantNames = $this->getTenantService()->getTenantList('tenant_name', 'tenant_name');
        
        foreach ($tenantNames as $name) {
                $list[$name->tenant_name] = $name->tenant_name;
        }
        return $list;
    }

    private function getTenantAttributeList() {
        $list = array();
        $list[''] = __("All");
        $tenantAttributes = $this->getTenantService()->getTenantList('tenant_attribute', 'tenant_attribute');
        
        foreach ($tenantAttributes as $attribute) {
                $list[$attribute->tenant_attribute] = $attribute->tenant_attribute;
        }
        return $list;
    }

    private function getYearList() {
        $list = array();
        $list[''] = __("All");
        $years = $this->getBonussalaryService()->getYearList();
        
        foreach ($years as $year) {
                $list[$year->year] = $year->year;
        }
        return $list;
    }

    private function getValueChoices() {
        $list = array();
        $list[''] = __("All");
        $list['IS NOT NULL'] = __("Set");
        $list['IS NULL'] = __("Not Set");

        return $list;
    }

    /**
     *
     * @return array
     */
    protected function getFormLabels() {
        $labels = array(
            'employee' => 'Employee Name',
            'tenant_name' => 'Tenant Name',
            'tenant_attribute' => 'Attribute',
            'year' => 'Year',
            'value' => 'Value',
        );

        return $labels;
    }

}