<!-- Search Filter -->
<div id="searchFilterBonussalary" class="box searchForm toggableForm">
    <div class="head">
        <h1><?php echo __("Search Filters") ?></h1>
    </div>    
    <div class="inner">
        <form id="search_form" name="frmBonussalarySearch" method="post" action="<?php echo url_for('admin/viewTenantDashboard'); ?>">
            <fieldset> 
                <ol>
                    <?php echo $form->render(); ?>
                </ol>                
                <p>
                    <input type="button" class="searchbutton" id="searchBtn" value="<?php echo __("Search") ?>" name="_search" />
                    <input type="button" class="reset" id="resetBtn" value="<?php echo __("Reset") ?>" name="_reset" />
                </p>
                
            </fieldset>   
        </form>
    </div>
    <a href="#" class="toggle tiptip" title="<?php echo __(CommonMessages::TOGGABLE_DEFAULT_MESSAGE); ?>">&gt;</a>
</div> 
<!-- End Search Filter -->

<div id="bonussalaryList">
    <?php include_component('core', 'ohrmList'); ?>
</div>

<script type="text/javascript">
    $('#searchBtn').click(function() {
        $('#search_form').submit();
    });

    $('#resetBtn').click(function() {
        $("#searchBonussalary_employee").val('');
        $("#searchBonussalary_tenant_name").val('');
        $("#searchBonussalary_tenant_attribute").val('');
        $("#searchBonussalary_year").val('');
        $("#searchBonussalary_value").val('');
        $('#search_form').submit();
    });
</script>