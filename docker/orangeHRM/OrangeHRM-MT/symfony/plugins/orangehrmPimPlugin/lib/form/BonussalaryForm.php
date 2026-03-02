<?php

class BonussalaryForm extends BaseForm {

    private $bsalaryService;

    public function getBonussalaryService() {
        if(is_null($this->bsalaryService)) {
            $this->bsalaryService = new BonussalaryService();
        }
        return $this->bsalaryService;
    }

    public function configure() {

        $this->setWidgets(array(
            'empID' => new sfWidgetFormInputHidden(),
            'tenantID' => new sfWidgetFormInputHidden(),
            'year' => new sfWidgetFormInputText(),
            'value' => new sfWidgetFormInputText()
        ));

        $this->setValidators(array(
            'empID' => new sfValidatorNumber(array('required' => false)),
            'tenantID' => new sfValidatorNumber(array('required' => false)),
            'year' =>  new sfValidatorNumber(array('required' => true)),
            'value' =>  new sfValidatorNumber(array('required' => true))
        ));

        $this->widgetSchema->setNameFormat('bonussalary[%s]');

        $this->setDefault('empID', $this->getOption('empID'));
        $this->setDefault('tenantID', $this->getOption('tenantID'));

        $this->getWidgetSchema()->setLabels($this->getFormLabels());
    }

    public function save() {

        $bonussalary = new Bonussalary();
        $bonussalary->setEmpId($this->getValue('empID'));
        $bonussalary->setTenantId($this->getValue('tenantID'));
        $bonussalary->setYear($this->getValue('year'));
        $bonussalary->setValue($this->getValue('value'));

        $savedBonussalary = $this->getBonussalaryService()->saveBonussalary($bonussalary);

        return $savedBonussalary;
    }

    protected function getFormLabels() {
        $required = '<em> *</em>';
        $labels = array(
            'year' => __('Year') . $required,
            'value' => __('Value') . $required,
        );

        return $labels;
    }

}