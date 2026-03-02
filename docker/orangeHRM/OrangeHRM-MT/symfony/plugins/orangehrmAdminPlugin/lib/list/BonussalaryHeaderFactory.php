<?php

class BonussalaryHeaderFactory extends ohrmListConfigurationFactory {

	protected function init() {

		$header1 = new ListHeader();
		$header2 = new ListHeader();
		$header3 = new ListHeader();
        $header4 = new ListHeader();
        $header5 = new ListHeader();

        $header1->populateFromArray(array(
		    'name' => 'Employee',
		    'width' => '30%',
		    'isSortable' => false,
		    'sortField' => 'employee',
		    'elementType' => 'label',
		    'elementProperty' =>  array('getter' => 'employee'),
        ));
        
		$header2->populateFromArray(array(
		    'name' => 'Tenant Name',
		    'width' => '30%',
		    'isSortable' => false,
		    'sortField' => 'tenant_name',
		    'elementType' => 'label',
		    'elementProperty' =>  array('getter' => 'tenant_name'),
		));
		
		$header3->populateFromArray(array(
		    'name' => 'Tenant Attribute',
		    'width' => '20%',
		    'isSortable' => false,
		    'sortField' => 'tenant_attribute',
		    'elementType' => 'label',
		    'elementProperty' => array('getter' => 'tenant_attribute'),
		    
		));

		$header4->populateFromArray(array(
		    'name' => 'Year',
		    'width' => '10%',
		    'isSortable' => false,
		    'sortField' => 'year',
		    'elementType' => 'label',
		    'elementProperty' => array('getter' => 'year'),
		    
		));
                
        $header5->populateFromArray(array(
		    'name' => 'Value',
		    'width' => '10%',
		    'isSortable' => false,
		    'sortField' => 'value',
		    'elementType' => 'label',
		    'elementProperty' => array('getter' => 'value'),
		    
        ));
        
		$this->headers = array($header2, $header3, $header1, $header4, $header5);
	}
	
	public function getClassName() {
		return 'Bonussalary';
	}

}

?>
