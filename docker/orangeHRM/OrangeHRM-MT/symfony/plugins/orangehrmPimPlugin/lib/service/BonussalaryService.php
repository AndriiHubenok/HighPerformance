<?php

class BonussalaryService extends BaseService {

    private $bsalaryDao;

    public function __construct() {
        $this->bsalaryDao = new BonussalaryDao();
    }

    public function getBonussalaryList($empNumber, $tenant_id) {
        return $this->bsalaryDao->getBonussalaryList($empNumber, $tenant_id);
    } 

    public function saveBonussalary(Bonussalary $bonussalary) {
        return $this->bsalaryDao->saveBonussalary($bonussalary);
    } 

    public function deleteBonussalaryById($deleteIds){
        return $this->bsalaryDao->deleteBonussalaryById($deleteIds);
    }

    public function deleteBonussalary($empNumber, $tenant_id, $year){
        return $this->bsalaryDao->deleteBonussalary($empNumber, $tenant_id, $year);
    }

    public function getBonussalaryTotal($searchClues){
        return $this->bsalaryDao->getBonussalaryTotal($searchClues);
    }

    public function getYearList(){
        return $this->bsalaryDao->getYearList();
    } 
   
}

?>
