<?php

class TenantForm extends BaseForm {

    private $tenantService;

    public function getTenantService() {
        if(is_null($this->tenantService)) {
            $this->tenantService = new TenantService();
        }
        return $this->tenantService;
    }

    public function configure() {

        $this->setWidgets(array(
            'name' => new sfWidgetFormInputText(),
            'attribute' => new sfWidgetFormInputText()
        ));

        $this->setValidators(array(
            'name' =>  new sfValidatorString(array('max_length' => 100,'required' => true)),
            'attribute' =>  new sfValidatorString(array('max_length' => 100,'required' => false))
        ));

        $this->widgetSchema->setNameFormat('tenant[%s]');

        $this->getWidgetSchema()->setLabels($this->getFormLabels());
    }

    public function save() {

        $tenant = new Tenant();
        $tenant->setTenantName($this->getValue('name'));
        $tenant->setTenantAttribute($this->getValue('attribute'));

        return $this->getTenantService()->saveTenant($tenant);
    }

    protected function getFormLabels() {
        $required = '<em> *</em>';
        $labels = array(
            'name' => __('Tenant Name') . $required,
            'attribute' => __('Tenant Attribute'),
        );

        return $labels;
    }

}