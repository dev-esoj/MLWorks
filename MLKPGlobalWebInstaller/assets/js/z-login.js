$(document).ready(function(){
    var clk = false;
    var idleTime = 0;
    var chcklogin = false;
   
    setInterval(function(){
        incrementTime();
    }, 60000)

    $(this).mousemove(function(e){
        idleTime = 0;
    });
    $(this).keypress(function(e){
        idleTime = 0;
    });

    function incrementTime() {
        idleTime++;
        if(idleTime > 5){
            $('#modalsess').modal({backdrop: 'static', keyboard: false});
            $('.modal-body').text('Your Session Has Expired.');
		$('#modalsess').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#modalsess').modal('show'); 
        }
    }

    $('#modalsess .modal-footer button').on('click', function() {
        window.location.href='/';
    });
    
    $('#modalsess .modal-header button').on('click', function() {
        window.location.href='/';
    });

    // function chckVal(chcker, msg){
    //     if(chcker){
    //         $('.modal-body').text(msg);
    //         $('#modalinfo').modal('show');
    //         chcklogin = false;
    //     }
        
    // }
   
    $('#btnLogIn').click(function(){
        var values = {};
        var $inputs = $('#frmLogin :input');
        $inputs.each(function(index, input){
            values[input.name] = input.value;
        });
        
        // alert(JSON.stringify(values));
        // alert($('#frmLogin').attr('action'));
        var formid = $(this).attr('id');
        $.ajax({
            async: true,
            type: 'POST',
            url:  $('#frmLogin').attr('action'),
            data: JSON.stringify(values),
            contentType: 'application/json',
            dataType: 'json',
            cache: false,
            success: function (result) {
                if(result.respcode == 0){
                    window.location.href = '/'
                }
            },
            error: function (errMsg) {
                $('#iderrval label').text('Invalid Credentials');
                // $('.modal-body').text('Invalid Credentials...');
                // $('#modalinfo').modal({backdrop: 'static', keyboard: false});
                // $('#modalinfo').modal('show');
            }
        });
    });

    $('#eyepass').on('mousedown',function(){
        $('#passid').attr('type','text');
    });
    $('#eyepass').on('mouseup',function(){
        $('#passid').attr('type','password');
    });

    $('#passid').on('change', function(){
        $('#passid').attr('type','password');
        if($.trim($('#passid').val()) == ''){
            $('#eyepass').addClass('eyehide');    
            $('#eyepass').removeClass('eyeshow');
         }else{
             $('#eyepass').addClass('eyeshow');
             $('#eyepass').removeClass('eyehide');    
        }
    });
    $('#passid').on('click', function(){
        
    });

});


