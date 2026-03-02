<?php

class saveBonussalaryAction extends basePimAction {

    public function execute($request) {

        $empNumber = $request->getParameter('empNumber');

        if ($this->getRequest()->isMethod('post')) {
                
            $this->form = new BonussalaryForm();    
            $this->form->bind($request->getParameter($this->form->getName()));

            if ($this->form->isValid()) {
                $this->bonussalary = $this->form->save();
                $this->getUser()->setFlash('success', __(TopLevelMessages::SAVE_SUCCESS));
            } else {
                $this->handleBadRequest();
                $this->forwardToSecureAction();
            }
        } 
        $this->redirect('pim/viewSalaryList?empNumber=' . $empNumber);  

    }
}
