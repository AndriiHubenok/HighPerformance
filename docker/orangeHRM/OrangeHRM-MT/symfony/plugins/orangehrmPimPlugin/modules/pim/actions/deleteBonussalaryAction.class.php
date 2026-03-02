<?php

class deleteBonussalaryAction extends basePimAction {    
    
    private $bsalaryService;

    public function getBonussalaryService() {
        if(is_null($this->bsalaryService)) {
            $this->bsalaryService = new BonussalaryService();
        }
        return $this->bsalaryService;
    }

    public function execute($request) {

        $empNumber = $request->getParameter('empNumber');
       
        if ($request->isMethod('post')) {

            $deleteIds = $request->getParameter('delBonussalary');

            if (count($deleteIds) > 0) {
                    $this->getBonussalaryService()->deleteBonussalaryById($deleteIds);
                    $this->getUser()->setFlash('success', __(TopLevelMessages::DELETE_SUCCESS));
            }
        }

        $this->redirect('pim/viewSalaryList?empNumber='. $empNumber);
    }



}
?>