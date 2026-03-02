<?php

class BonussalaryDao extends BaseDao {

    public function getBonussalaryList($empNumber,$tenant_id, $year = null){

        try {
            $q = Doctrine_Query::create()
                            ->from('Bonussalary')
                            ->where('emp_id = ?', $empNumber);

            if (!is_null($tenant_id)){
                $q->andWhere('tenant_id = ?', $tenant_id);
            } else {
                $q->andWhere('tenant_id is NULL');
            }

            if (!is_null($year)){
                $q->andWhere('year = ?', $year);
            }

            $q->orderBy("year" . ' ' . "DESC");
            
            return $q->execute();
            
        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    } 

    public function saveBonussalary(Bonussalary $bonussalary){

        try {
            $entry = $this->getBonussalaryList($bonussalary->getEmpId(), $bonussalary->getTenantId(), $bonussalary->getYear());

            if ($entry->count() > 0){

                $q = Doctrine_Query::create()
                               ->update('Bonussalary')
                               ->set('value', $bonussalary->getValue())
                               ->where('id = ?', $entry[0]->id);
            
                $q->execute();

            } else {
                $bonussalary->save();
            }
        
            return $bonussalary;

        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    }

    public function deleteBonussalaryById($deleteIds){

        try {
            if (is_array($deleteIds) && count($deleteIds) > 0) {
            $q = Doctrine_Query::create()->delete('Bonussalary')
                                        ->whereIn('id', $deleteIds);                
            }
            
            return $q->execute();

        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    }

    public function deleteBonussalary($empNumber, $tenant_id, $year){

        try {
            
            $q = Doctrine_Query::create()->delete('Bonussalary')
                                    ->where('emp_id = ?', $empNumber);
                                        
                if (!is_null($tenant_id)){
                    $q->andWhere('tenant_id = ?', $tenant_id);
                } else {
                    $q->andWhere('tenant_id is NULL');
                }
                    $q->andWhere('year = ?', $year);                 
            
            return $q->execute();

        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    }


    public function getBonussalaryTotal($searchClues){

        try {           
            
            $employee = ''; $name = ''; $attribute = '' ; $year = ''; $value = '';

            if (!empty($searchClues['employee'])){
                $employee = " AND b.emp_id = \"" . $searchClues['employee'] . "\"";
            }

            if (!empty($searchClues['tenant_name'])){
                $name = " AND t.tenant_name = \"" . $searchClues['tenant_name'] . "\"";
            }

            if (!empty($searchClues['tenant_attribute'])){
                $attribute = " AND t.tenant_attribute = \"" . $searchClues['tenant_attribute'] . "\"";
            }

            if (!empty($searchClues['year'])){
                $year = " AND b.year = \"" . $searchClues['year'] . "\"";
            }

            if (!empty($searchClues['value'])){
                $value = " AND b.value " . $searchClues['value'];
            }

            $q = Doctrine_Manager::getInstance()->getCurrentConnection();
            
            return $q->execute("SELECT t.tenant_name, t.tenant_attribute, CONCAT_WS(' ',e.emp_firstname, e.emp_lastname) as employee, b.year, b.value 
                                FROM hs_hr_emp_bonussalary b 
                                RIGHT JOIN ohrm_tenant t ON b.tenant_id = t.id 
                                LEFT JOIN hs_hr_employee e ON b.emp_id = e.emp_number
                                WHERE true". $employee . $name . $attribute . $year . $value . 
                              " ORDER BY t.tenant_name, b.year DESC");

        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    } 

    public function getYearList() {
        
        try {
            $q = Doctrine_Query::create()
                            ->select('year')
                            ->from('Bonussalary')
                            ->groupBy('year');

            return $q->execute();
            
        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    }    
}

?>