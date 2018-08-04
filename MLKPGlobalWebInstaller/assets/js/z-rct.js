$(document).ready(function(){
    $('#selectbranchname').on('change', function(){
        var bcode = $(this).val();
        $.ajax({
            type: 'GET',
            url:  'RCT/branchManAndCode',
            data: {branchcode : bcode},
            contentType: 'application/json',
            dataType: 'json',
            cache: false,
            success: function (res) {
                if(res.respcode == '0'){
                    $('.modal-body').text(res.message);
		            $('#modalinfo').modal({backdrop: 'static',keyboard: false});
                    $('#modalinfo').modal('show');
                }else{
                    $('#bcodeidRCT').val(res.BCCode)
                    $('#bmanageridRCT').val(res.BMname)
                }
            },
            error: function (err) {
                $('.modal-body').text('Connection lost: Please re-login the page');
		        $('#modalinfo').modal({backdrop: 'static', keyboard: false});
                $('#modalinfo').modal('show');
            }
        });
    })

$('#pkeyidRCT').on('keyup', function(e){
    var count = $(this).val().length;
    if (count == 16) {
        var pkey = $(this).val();
        var vzcode = $('#selectbranchname').val();
        var data = {
            branchcode : vzcode,
            productkey : pkey
        }
    $.ajax({
        type: 'POST',
        url:  'RCT/validatePkey',
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        cache: false,
        success: function (res) {
            if(res.respcode == '-1'){
                $('.modal-body').text(res.message);
		  $('#modalinfo').modal({
                       backdrop: 'static',
                       keyboard: false
            	  });
                $('#modalinfo').modal('show');
                $('#id32bit').prop('disabled', true);
                $('#id64bit').prop('disabled', true);
		   clearRCT();
            }else if(res.respcode == '-2'){
                $('.modal-body').text(res.message);
		  $('#modalinfo').modal({
                       backdrop: 'static',
                       keyboard: false
            	  });
                $('#modalinfo').modal('show');
                $('#id32bit').prop('disabled', true);
                $('#id64bit').prop('disabled', true);
		   clearRCT();
            }else{
                // var os = navigator.platform;
                if(navigator.userAgent.indexOf("WOW64") != -1 || navigator.userAgent.indexOf("Win64") != -1){
                    var os = 'Win64';
                }
                else {
                    var os = 'Win32';
                }
                $('.modal-body').text('Your OS type is : '+ os);
		        $('#modalinfo').modal({
                       backdrop: 'static',
                       keyboard: false
            	  });
                $('#modalinfo').modal('show');
                if(os == 'Win32'){
                    $('#id32bit').prop('disabled', false);
                } else {
                    $('#id64bit').prop('disabled', false);
                }
            }
        },
        error: function (err) {
            $('.modal-body').text('Please Select Branch');
	     $('#modalinfo').modal({
                       backdrop: 'static',
                       keyboard: false
            });
            $('#myModal').modal('show');
        }
    });
    }
});

function clearRCT(){
    $('#bcodeidRCT').val('');
    $('#bmanageridRCT').val('');
    $('#pkeyidRCT').val('');
    $('#selectbranchname').val($("#selectbranchname option:first").val());
    $('#id32bit').prop('disabled', true);
    $('#id64bit').prop('disabled', true);
}

// var win32 = function(e){
    $('#id32bit').on('click', function (e){
        var winType = 'Win32';
        $.ajax({
            type: 'GET',
            url:  'RCT/getFiletoDownload',
            data: {winType : winType},
            contentType: 'application/json',
            dataType: 'json',
            cache: false,
            success: function (res) {
                if(res.respcode == '0'){
                    var c = 0;
                    $('.modal-body').text('Downloading File...');
                $('#myModal').modal({
                        backdrop: 'static',
                        keyboard: false
                        });
                    $('#myModal').modal('show');
                    window.open('/RCT/download');
                    clearRCT();
            // window.location.reload();
                }else if(res.respcode == '-1'){
                    $('.modal-body').text('res.message');
                $('#myModal').modal({
                        backdrop: 'static',
                        keyboard: false
                        });
                    $('#myModal').modal('show');
                }else{
                    $('.modal-body').text('res.message');
                $('#myModal').modal({
                        backdrop: 'static',
                        keyboard: false
                        });
                    $('#myModal').modal('show');
                }
            },
            error: function (err) {
                $('.modal-body').text('Connection lost: Please re-login the page');
            $('#myModal').modal({
                        backdrop: 'static',
                        keyboard: false
                        });
                $('#myModal').modal('show');
            }
        });
        e.stopImmediatePropagation();
        return false;
        });
    





// var win64 = function(e){
$('#id64bit').on('click', function (e){
        var winType = 'Win64';
   
    $.ajax({
        type: 'GET',
        url:  'RCT/getFiletoDownload',
        data: {winType : winType},
        contentType: 'application/json',
        dataType: 'json',
        cache: false,
        success: function (res) {
            if(res.respcode == '0'){
                $('.modal-body').text('Downloading File...');
		$('#myModal').modal({
                       backdrop: 'static',
                       keyboard: false
            	       });
                $('#myModal').modal('show');
                window.open('/RCT/download');
                clearRCT();
		//   window.location.reload();
            }else if(res.respcode == '-1'){
                $('.modal-body').text('res.message');
			$('#myModal').modal({
                       backdrop: 'static',
                       keyboard: false
            	       });
                $('#myModal').modal('show');
            }else{
                $('.modal-body').text('res.message');
			$('#myModal').modal({
                       backdrop: 'static',
                       keyboard: false
            	       });
                $('#myModal').modal('show');
            }
        },
        error: function (err) {
            $('#errModal').text('Connection lost: Please re-login the page');
			$('#myModal').modal({
                       backdrop: 'static',
                       keyboard: false
            	       });
            $('#myModal').show();
        }
    });
    e.stopImmediatePropagation();
    return false;
    });
    

// $('#id32bit').one('click', win32);

// $('#id64bit').one('click', win64);
 
});