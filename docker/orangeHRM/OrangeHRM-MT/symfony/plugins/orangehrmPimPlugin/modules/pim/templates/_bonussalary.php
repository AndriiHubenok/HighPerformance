<!-- Add Bonussalary Component -->
<div id="changeBonussalary">
    <div class="head">
        <h1 id="headchangeBonussalary"><?php echo __('Bonussalary Component'); ?></h1>
    </div>
    
    <div class="inner">
        <form id="frmBonusalary" action="<?php echo url_for('pim/saveBonussalary?empNumber=' . $empNumber); ?>" method="post">
            <fieldset>
                <ol>
                    <?php echo $form->render(); ?>
                    <li class="required">
                        <em>*</em> <?php echo __(CommonMessages::REQUIRED_FIELD); ?>
                    </li>
                </ol>
                <p>
                    <input type="button" class="" id="btnBonussalarySave" value="<?php echo __("Save"); ?>" />
                    <input type="button" class="reset" id="btnBonussalaryCancel" value="<?php echo __("Cancel"); ?>" />
                </p>
            </fieldset>
        </form>
    </div>
</div>
<!-- End Add Bonussalary Component -->

<!-- Bonussalary Component -->
<div class="miniList" id="bonussalaryList">

    <!-- Header -->
    <div class="head">
        <h1><?php echo __("Bonussalary"); ?></h1>
    </div>


    <div class="inner">

        <?php include_partial('global/flash_messages'); ?>

        <form id="frmDelBonussalary" action="<?php echo url_for('pim/deleteBonussalary?empNumber=' . $empNumber); ?>" method="post" class="longLabels">
                    
            <!-- Buttons -->
            <p id="actionBonussalary">
                <input type="button" value="<?php echo __("Add"); ?>" class="" id="addBonussalary" />
                <?php if (count($bonussalaryList) > 0) { ?>
                    <input type="button" value="<?php echo __("Delete"); ?>" class="delete" id="delBonussalary" />
                <?php } ?>     
            </p>

            <!-- Table -->        
            <table id="tblBonussalary" class="table hover">
                
                <!-- Tablehead -->
                <thead>
                    <tr>
                        <th class="check" style="width:2%"><input type="checkbox" id="bonussalaryCheckAll" /></th>
                        <th class="year"><?php echo __('Year'); ?></th>
                        <th class="value"><?php echo __('Value'); ?></th>
                    </tr>
                </thead>

                <!-- Tablebody -->
                <tbody>
                    <?php if (!(count($bonussalaryList) > 0)) { ?>
                        <tr>
                            <td><?php echo __(TopLevelMessages::NO_RECORDS_FOUND); ?></td>
                            <td colspan="5"></td>
                        </tr>
                    <?php } else { ?> 
                        <?php
                        $row = 0;
                        foreach ($bonussalaryList as $bonussalary) :
                            $cssClass = ($row % 2) ? 'even' : 'odd';
                            ?>
                            <tr class="<?php echo $cssClass; ?>" style="cursor: pointer">
                            <td class="check">
                                <input type="checkbox" class="chkbox" value="<?php echo $bonussalary->id; ?>" name="delBonussalary[]"/>
                            </td>
                                <td class="year" ><?php echo $bonussalary->year; ?></td>
                                <td class="value" ><?php echo $bonussalary->value; ?></td>
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
<!-- End Bonussalary Component -->


<!-- Skript -->
<script type="text/javascript">

    //setup the page
    $('#delBonussalary').attr('disabled', 'disabled');
    $("#changeBonussalary").hide();

    //if check all button clicked
    $("#bonussalaryCheckAll").click(function() {
        $(".check .chkbox").removeAttr("checked");
        if ($("#bonussalaryCheckAll").attr("checked")) {
            $(".check .chkbox").attr("checked", "checked");
        }
        
        if($('.check .chkbox:checkbox:checked').length > 0) {
            $('#delBonussalary').removeAttr('disabled');
        } else {
            $('#delBonussalary').attr('disabled', 'disabled');
        }
        });

    //remove tick from the all button if any checkbox unchecked
    $(".check .chkbox").click(function() {
        $("#bonussalaryCheckAll").removeAttr('checked');
        if ($(".check .chkbox").length == $(".check .chkbox:checked").length) {
            $("#bonussalaryCheckAll").attr('checked', 'checked');
        }
        
        if($('.check .chkbox:checkbox:checked').length > 0) {
            $('#delBonussalary').removeAttr('disabled');
        } else {
            $('#delBonussalary').attr('disabled', 'disabled');
        }
    });


    //handle click on add button
    $("#addBonussalary").click(function() {
        clearBonussalary();
        $("#headchangeBonussalary").text(ADD);
        $("#changeBonussalary").show();
        $("#bonussalaryList").hide()

    });

    //handle click on delete button
    $("#delBonussalary").click(function(){
        if ($(".check .chkbox:checked").length > 0) {
            $("#frmDelBonussalary").submit();
        }
    });

    //handle click on dataset
    $(".odd .year, .odd .value, .even .year, .even .value").click(function() {
        clearBonussalary();
        $("#headchangeBonussalary").text(EDIT);
        row = $(this).parent();
        year = $(row).children(".year").text();
        value = $(row).children(".value").text();
        $("#bonussalary_year").val(year);
        $("#bonussalary_value").val(value); 
        $("#changeBonussalary").show();
        $("#bonussalaryList").hide()
    });


    function clearBonussalary() {
        bonussalaryValidator.resetForm();
        $("#bonussalary_year").val('');
        $("#bonussalary_value").val('');
    }

    //handle click on save in edit form
    $("#btnBonussalarySave").click(function() {          
            $("#frmBonusalary").submit();
        });

    //handle click on cancel in edit form
    $("#btnBonussalaryCancel").click(function() {
        clearBonussalary();
        $("#changeBonussalary").hide();
        $("#bonussalaryList").show()
    });

    //form validation
    var bonussalaryValidator =
        $("#frmBonusalary").validate({
        rules: {
            'bonussalary[id]': {required: true},
            'bonussalary[empID]': {required: true},
            'bonussalary[tenantID]': {required: true},
            'bonussalary[year]': {number:true, required: true},
            'bonussalary[value]': {number:true, required: true},
        },
        messages: {
            'bonussalary[id]': {required: "<?php echo __js(ValidationMessages::REQUIRED); ?>"},
            'bonussalary[empID]': {required: "<?php echo __js(ValidationMessages::REQUIRED); ?>"},
            'bonussalary[tenantID]': {required: "<?php echo __js(ValidationMessages::REQUIRED); ?>"},
            'bonussalary[year]': {number: "<?php echo __js("Should be a year number"); ?>", required: "<?php echo __js(ValidationMessages::REQUIRED); ?>"},
            'bonussalary[value]': {number: "<?php echo __js("Should be a numeric value"); ?>", required: "<?php echo __js(ValidationMessages::REQUIRED); ?>"},
        }
    });

    const EDIT = "Edit Bonussalary";
    const ADD = "Add Bonussalary";

</script>