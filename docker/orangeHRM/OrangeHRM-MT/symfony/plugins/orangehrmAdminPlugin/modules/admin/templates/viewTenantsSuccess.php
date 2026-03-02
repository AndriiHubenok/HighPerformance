<!-- Add Tenant Component -->
<div class="box">
    <div id="addTenantComponent">
        <div class="head">
            <h1 id="headAddTenant"><?php echo __('Add Tenant'); ?></h1>
        </div>
        
        <div class="inner">
            <form id="frmAddTenant" action="<?php echo url_for('admin/viewTenants'); ?>" method="post">
                <fieldset>
                    <ol>
                        <?php echo $form->render(); ?>
                        <li class="required">
                            <em>*</em> <?php echo __(CommonMessages::REQUIRED_FIELD); ?>
                        </li>
                    </ol>
                    <p>
                        <input type="button" class="" id="btnTenantSave" value="<?php echo __("Save"); ?>" />
                        <input type="button" class="reset" id="btnTenantCancel" value="<?php echo __("Cancel"); ?>" />
                    </p>
                </fieldset>
            </form>
        </div>
    </div>
</div>
<!-- End Add Tenant Component -->


<!-- Tenant List Component -->
<div class="box">
    <div class="miniList" id="tenantList">

        <div class="head">
            <h1><?php echo __("Tenants"); ?></h1>
        </div>

        <div class="inner">

            <?php include_partial('global/flash_messages'); ?>

            <form id="frmDeleteTenant" action="<?php echo url_for('admin/deleteTenant'); ?>" method="post" class="longLabels">      
                
                <p id="actionTenant">
                    <input type="button" value="<?php echo __("Add"); ?>" class="" id="addTenant" />
                    <?php if (count($tenantList) > 0) { ?>
                        <input type="button" value="<?php echo __("Delete"); ?>" class="delete" id="delTenant" />
                    <?php } ?>     
                </p>
      
            <table id="tblTenant" class="table hover">
                
                <thead>
                    <tr>
                        <th class="check" style="width:2%"><input type="checkbox" id="tenantCheckAll" /></th>
                        <th class="name"><?php echo __('Tenant Name'); ?></th>
                        <th class="attribute"><?php echo __('Tenant Attribute'); ?></th>
                    </tr>
                </thead>

                <tbody>
                    <?php if (!(count($tenantList) > 0)) { ?>
                        <tr>
                            <td><?php echo __(TopLevelMessages::NO_RECORDS_FOUND); ?></td>
                            <td colspan="3"></td>
                        </tr>
                    <?php } else { ?> 
                        <?php
                        $row = 0;
                        foreach ($tenantList as $tenant) :
                            $cssClass = ($row % 2) ? 'even' : 'odd'; ?>
                            <tr class="<?php echo $cssClass; ?>">
                                <td class="check">
                                    <input type="checkbox" class="chkbox" value="<?php echo $tenant->id; ?>" name="delTenant[]"/>
                                </td>
                                <td class="name" >
                                    <a href="editTenant?tenantId=<?php echo $tenant->id;?>" class="edit"><?php echo $tenant->tenant_name; ?></a>
                                </td>
                                <td class="attribute" ><?php echo $tenant->tenant_attribute; ?></td>
                            </tr>
                            <?php 
                            $row++;
                        endforeach; ?>
                    <?php } ?>
                </tbody>
            </table>
            </form>
        </div>
    </div>
</div>
<!-- End Tenant List Component -->



<!-- Skript -->
<script type="text/javascript">

    var lang_name = "<?php echo __js(ValidationMessages::TEXT_LENGTH_EXCEEDS, array('%amount%' => 100)); ?>";
    var lang_attribute = "<?php echo __js(ValidationMessages::TEXT_LENGTH_EXCEEDS, array('%amount%' => 100)); ?>";

    $('#delTenant').attr('disabled', 'disabled');
    $("#addTenantComponent").hide();

    $("#tenantCheckAll").click(function() {
        $(".check .chkbox").removeAttr("checked");
        if ($("#tenantCheckAll").attr("checked")) {
            $(".check .chkbox").attr("checked", "checked");
        }
        
        if($('.check .chkbox:checkbox:checked').length > 0) {
            $('#delTenant').removeAttr('disabled');
        } else {
            $('#delTenant').attr('disabled', 'disabled');
        }
        });

    $(".check .chkbox").click(function() {
        $("#tenantCheckAll").removeAttr('checked');
        if ($(".check .chkbox").length == $(".check .chkbox:checked").length) {
            $("#tenantCheckAll").attr('checked', 'checked');
        }
        
        if($('.check .chkbox:checkbox:checked').length > 0) {
            $('#delTenant').removeAttr('disabled');
        } else {
            $('#delTenant').attr('disabled', 'disabled');
        }
    });

    $("#addTenant").click(function() {
        $("#addTenantComponent").show();
    });

    $("#delTenant").click(function() {
        $("#frmDeleteTenant").submit(); 
    });

    $("#btnTenantSave").click(function() {          
        $("#frmAddTenant").submit();
    });

    $("#btnTenantCancel").click(function() {
        clearTenant();
        $("#addTenantComponent").hide();
    });

    function clearTenant() {
        tenantValidator.resetForm();
        $("#tenant_name").val('');
        $("#tenant_attribute").val('');
    }

    var tenantValidator =
        $("#frmAddTenant").validate({
        rules: {
            'tenant[name]': {required: true},
            'tenant[attribute]': {required: false},
        },
        messages: {
            'tenant[name]': {maxlength: lang_name, required: "<?php echo __js(ValidationMessages::REQUIRED); ?>"},
            'tenant[attribute]': {maxlength: lang_attribute, required: "<?php echo __js(ValidationMessages::REQUIRED); ?>"},
        }
    });

</script>