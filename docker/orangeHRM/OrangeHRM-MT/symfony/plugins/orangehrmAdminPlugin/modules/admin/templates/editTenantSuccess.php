<!-- Add User To Tenant Component -->
<div class="box">
    <div id="addUserToTenantComponent">
        <div class="head">
            <h1 id="headAddUserToTenant"><?php echo __('Add User To ' . $tenant[0]->tenant_name); ?></h1>
        </div>
        
        <div class="inner">
            <form id="frmAddUserToTenant" action="<?php echo url_for('admin/editTenant?tenantId=' . $tenant[0]->id); ?>" method="post">
                <fieldset>
                    <ol>
                        <?php echo $form->render(); ?>
                        <li class="required">
                            <em>*</em> <?php echo __(CommonMessages::REQUIRED_FIELD); ?>
                        </li>
                    </ol>
                    <p>
                        <input type="button" class="" id="btnUserAdd" value="<?php echo __("Save"); ?>" />
                        <input type="button" class="reset" id="btnCancel" value="<?php echo __("Cancel"); ?>" />
                    </p>
                </fieldset>
            </form>
        </div>
    </div>
</div>
<!-- End Add User To Tenant Component -->


<!-- Userlist for Tenant Component -->
<div class="box">
    <div class="miniList" id="userlistTenant">

        <div class="head">
            <h1><?php echo __($tenant[0]->tenant_name); ?></h1>
        </div>


        <div class="inner">

            <?php include_partial('global/flash_messages'); ?>

            <form id="frmUserlistTenant" action="<?php echo url_for('admin/deleteUserFromTenant?tenantId=' .  $tenant[0]->id); ?>" method="post" class="longLabels">
                
                <p id="actionUserlistTenant">
                    <input type="button" value="<?php echo __("Add"); ?>" class="" id="addUserToTenant" />
                    <?php if (count($userList) > 0) { ?>
                        <input type="button" value="<?php echo __("Delete"); ?>" class="delete" id="delUserFromTenant" />
                    <?php } ?>
                </p>
      
                <table id="tblUserlistTenant" class="table hover">
                
                    <thead>
                        <tr>
                            <th class="check" style="width:2%"><input type="checkbox" id="userCheckAll" /></th>
                            <th class="username"><?php echo __('User Name'); ?></th>
                        </tr>
                    </thead>

                    <tbody>
                        <?php if (!(count($userList) > 0)) { ?>
                            <tr>
                                <td><?php echo __(TopLevelMessages::NO_RECORDS_FOUND); ?></td>
                                <td colspan="5"></td>
                            </tr>
                        <?php } else { ?> 
                            <?php
                            $row = 0;
                            foreach ($userList as $user) :
                                $cssClass = ($row % 2) ? 'even' : 'odd'; ?>
                                <tr class="<?php echo $cssClass; ?>">
                                    <td class="check">
                                        <input type="checkbox" class="chkbox" value="<?php echo $user->id; ?>" name="delUserFromTenant[]"/>
                                    </td>
                                    <td class="username" ><?php echo $user->user_name; ?></td>
                                </tr>
                                <?php $row++;
                            endforeach; ?>
                        <?php } ?>
                    </tbody>
                </table>
            </form>
        </div>
    </div>
</div>
<!-- End Userlist for Tenant Component -->



<!-- Skript -->
<script type="text/javascript">

    $('#delUserFromTenant').attr('disabled', 'disabled');
    $("#addUserToTenantComponent").hide();

    $("#userCheckAll").click(function() {
        $(".check .chkbox").removeAttr("checked");
        if ($("#userCheckAll").attr("checked")) {
            $(".check .chkbox").attr("checked", "checked");
        }
        
        if($('.check .chkbox:checkbox:checked').length > 0) {
            $('#delUserFromTenant').removeAttr('disabled');
        } else {
            $('#delUserFromTenant').attr('disabled', 'disabled');
        }
        });

    $(".check .chkbox").click(function() {
        $("#userCheckAll").removeAttr('checked');
        if ($(".check .chkbox").length == $(".check .chkbox:checked").length) {
            $("#userCheckAll").attr('checked', 'checked');
        }
        
        if($('.check .chkbox:checkbox:checked').length > 0) {
            $('#delUserFromTenant').removeAttr('disabled');
        } else {
            $('#delUserFromTenant').attr('disabled', 'disabled');
        }
    });

    $("#addUserToTenant").click(function() {
        $("#addUserToTenantComponent").show();
    });

    $("#delUserFromTenant").click(function() {
        $("#frmUserlistTenant").submit(); 
    });

    $("#btnUserAdd").click(function() {          
        $("#frmAddUserToTenant").submit();
    });

    $("#btnCancel").click(function() {
        $('#tenantuser_username').val('');
        $("#addUserToTenantComponent").hide();
    });

    var tenantValidator =
        $("#frmAddUserToTenant").validate({
        rules: {
            'tenantuser[user]': {required: true},
        },
        messages: {
            'tenant[name]': {required: "<?php echo __js(ValidationMessages::REQUIRED); ?>"},
        }
    });

</script>