<?php

class AddUserToTenantForm extends BaseForm {

    private $systemUserService;

    public function getSystemUserService() {
        $this->systemUserService = new SystemUserService();
        return $this->systemUserService;
    }

    public function configure() {

        $userList = $this->getUserList();

        $this->setWidgets(array(
            'user' => new sfWidgetFormSelect(array('choices' => $userList))
        ));

        $this->setValidators(array(
            'user' =>  new sfValidatorChoice(array('required' => true, 
                                'choices' => array_keys($userList)))
        ));

        $this->widgetSchema->setNameFormat('tenantuser[%s]');

        $this->getWidgetSchema()->setLabels($this->getFormLabels());
    }

    public function add($tenantId) {
        $this->getSystemUserService()->setUserTenant($this->getValue('user'), $tenantId);
    }

    public function getUserList(){
        $list = array();
        $users = $this->getSystemUserService()->getSystemUserByTenantId();
        foreach ($users as $user) {
            $list[$user->id] = $user->user_name;
        }
        return $list;
    }

    protected function getFormLabels() {
        $required = '<em> *</em>';
        $labels = array(
            'user' => __('Username') . $required
        );

        return $labels;
    }

}