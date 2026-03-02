<?php

namespace Orangehrm\Rest\Api\Admin\Entity;

use Orangehrm\Rest\Api\Entity\Serializable;

class Tenant implements Serializable
{

    private $id;
    private $name;
    private $attribute;

    public function getId(){
        return $this->id;
    }

    public function setId($id){
        $this->id = $id;
    }

    public function getName(){
        return $this->name;
    }

    public function setName($name){
        $this->name = $name;
    }

    public function getAttribute(){
        return $this->attribute;
    }

    public function setAttribute($attribute){
        $this->attribute = $attribute;
    }

    public function build($tenant)
    {
        $this->setId($tenant->id);
        $this->setName($tenant->tenant_name);
        $this->setAttribute($tenant->tenant_attribute);
    }

    public function toArray()
    {
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'attribute' => $this->getAttribute()
        );
    }

}
