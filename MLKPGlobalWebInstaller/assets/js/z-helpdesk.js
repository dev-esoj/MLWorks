$(document).ready(function(){

$('#clearpkey').click(function(){
    clearHDhome();
    $('#savepkey').prop('disabled', true);
    $('#genpkey').prop('disabled', true);
    $(this).prop('disabled', true);
});

 function clearHDhome(){
        $('#productkey').text('');
        $('#rctunameid').val('');
        $('#rctnameid').val('');
        $('#rctbcodeid').val('');
        $('#rctbmanagerid').val('');
        $('#selectbname').find('option:gt(0)').remove();
        $('#savepkey').prop('disabled', true);
        $('#genpkey').prop('disabled', true);
        $('#clearpkey').prop('disabled', true);
    }

    function clearPKhome(){
        $('#vproductkey').val('');
        $('#bbcodeviewpkey').val('');
        $('#bnameviewpkey').val('');
        $('#bmanviewpkey').val('');
        $('#vvproductkey').text('');
        $('#selectzonename').val($("#selectzonename option:first").val());
    }

    $('#vclearpkey').on('click', function()
    {
        clearPKhome();
    });

    $('#genpkey').click(function(){
        $('#clearpkey').prop('disabled', false);
        $('#savepkey').prop('disabled', false);

        var bbcode = $('#rctbcodeid').val();
        $.ajax({
            type: 'GET',
            url:  'HelpDesk/generatePkey',
            data: {bbcode : bbcode},
            contentType: 'application/json',
            dataType: 'json',
            cache: false,
            success: function (res) {
                $('#productkey').text(res.randString);
            },
            error: function (err) {
                $('.modal-body').text('Connection lost: Please re-login the page');
		        $('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                $('#modalinfo').modal('show');
            }
        });
    })

    $('#vviewpkey').click(function(){
        var bcode = $('#bbcodeviewpkey').val();
        var zonename = $('#selectzonename option:selected').text();

        $.ajax({
            type: 'GET',
            url:  'HelpDesk/viewexistingPkey',
            data: {bcode : bcode, zonename: zonename},
            contentType: 'application/json',
            dataType: 'json',
            cache: false,
            success: function (res) {
                if(res.respcode == '0'){
                    $('.modal-body').text(res.message);
			$('#modelinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                    $('#modalinfo').modal('show');
                }else if(res.respcode == '-0'){
                    $('.modal-body').text(res.message);
			$('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                    $('#modalinfo').modal('show');
                }else{
                    $('#vvproductkey').text(res.pkey);
                }
            },
            error: function (err) {
                $('.modal-body').text('Connection lost: Please re-login the page');
			    $('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                $('#modalinfo').modal('show');
            }
        });
    });

    $('#viewpkey').click(function(){
        clearPKhome();
        $('#hdInfoAni').addClass('hid_frm');
        $('#frmViewPkey').removeClass('hid_frm');
        if($('#hdInfoAni').hasClass('hid_frm')){
            $(setTimeout(function(){
                $('#frmViewPkey').removeClass('hidepgHD');
                $('#frmViewPkey').addClass('showpgHD');
            },500))
        }
        
        $.ajax({
            type: 'GET',
            url:  'HelpDesk/getzonelist',
            data: '',
            contentType: 'application/json',
            dataType: 'json',
            cache: false,
            success: function (res) {
                if(res.respcode == '0'){
                    $('.modal-body').text(res.message);
			$('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                    $('#modalinfo').modal('show');
                }else{
                    var htmlOptions = [];
                    var select = $('#selectzonename');
                    var data = res.zone;
                    if(data.length ){
                        for(item in data){
                            html = '<option value="' + data[item].zonecode + '">' + data[item].zonename + '</option>';
                            htmlOptions[htmlOptions.length] = html;
                        }
                    
                    select.find('option:gt(0)').remove();
                    select.append( htmlOptions.join('') );
                    }
                }
            },
            error: function (err) {
                $('.modal-body').text('Connection lost: Please re-login the page');
                $('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                $('#modalinfo').modal('show');
            }
        });
        
    })

    $('#hdlogout').click(function(){
        window.location.href='/';
    })
    $('#backpkey').click(function(){
        clearHDhome();
        $('#hdInfoAni').removeClass('hid_frm');

        $('#frmViewPkey').addClass('hid_frm');

        if($('#frmViewPkey').hasClass('hid_frm')){

            $(setTimeout(function(){
                $('#hdInfoAni').removeClass('hidepgHD');
                $('#hdInfoAni').addClass('showpgHD');
            },500))
        }


    })


    
$('#rctunameid').on('keydown', function(e){
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13' || keycode == '9') {
        var rctuname = $('#rctunameid').val();

        console.log(rctuname)
        $.ajax({
            type: 'GET',
            url:  'HelpDesk/branchList',
            data: {rctID : rctuname},
            contentType: 'application/json',
            dataType: 'json',
            cache: false,
            success: function (res) {
                var htmlOptions = [];
                var select = $('#selectbname');
                $('#rctnameid').val(res.rctfname);
                var data = res.branchdet;
                if(data.length ){
                    for(item in data){
                        html = '<option value="' + data[item].branchcode + '">' + data[item].branchname + '</option>';
                        htmlOptions[htmlOptions.length] = html;
                    }
                   select.find('option:gt(0)').remove();
                   select.append( htmlOptions.join('') );
                }
            },
            error: function (err) {
                $('.modal-body').text('Connection lost: Please re-login the page');
		        $('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                $('#modalinfo').modal('show');
            }
        });
    }
});

$('#bbcodeviewpkey').on('keydown', function(e){
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13' || keycode == '9') {
        var vbcode = $(this).val();
        var vzcode = $('#selectzonename').val();
        $.ajax({
            type: 'GET',
            url:  'HelpDesk/branchManAndCode',
            data: {branchcode : vbcode, zonecode : vzcode},
            contentType: 'application/json',
            dataType: 'json',
            cache: false,
            success: function (res) {
                if(res.respcode == '0'){
                    $('.modal-body').text(res.message);
$('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                    $('#modalinfo').modal('show');
                }else if(res.respcode == '-0'){
                    $('.modal-body').text(res.message);
			$('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                    $('#modalinfo').modal('show');
                }else{
                    $('#bnameviewpkey').val(res.BName)
                    $('#bmanviewpkey').val(res.BMname)
                }
            },
            error: function (err) {
                $('.modal-body').text('Connection lost: Please re-login the page');
		        $('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                $('#modalinfo').modal('show');
            }
        });
    }
});

$('#selectbname').change(function() {
    var bcode = $(this).val();
    $.ajax({
        type: 'GET',
        url:  'HelpDesk/branchManAndCode',
        data: {branchcode : bcode},
        contentType: 'application/json',
        dataType: 'json',
        cache: false,
        success: function (res) {
            if(res.respcode == '0'){
                $('.modal-body').text(res.message);
$('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                $('#modalinfo').modal('show');
            }else{
                $('#rctbcodeid').val(res.BCCode)
                $('#rctbmanagerid').val(res.BMname)
                $('#genpkey').prop('disabled', false);
            }
        },
        error: function (err) {
            $('.modal-body').text('Connection lost: Please re-login the page');
		    $('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#modalinfo').modal('show');
        }
    });
});

$('#savepkey').on('click', function(){
    var pkey = $('#productkey').text();
    var data = {pkey:pkey};
    $.ajax({
        type: 'POST',
        url:  'HelpDesk/SavePKey',
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        cache: false,
        success: function (res) {
            if(res.respcode == '-1'){
                clearHDhome();
                $('.modal-body').text(res.message);
$('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                $('#modalinfo').modal('show');

            }else if(res.respcode == '1'){
                clearHDhome();
                $('.modal-body').text(res.message);
$('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                $('#modalinfo').modal('show');
            }else if(res.respcode == '0'){
                clearHDhome();
                $('.modal-body').text(res.message);
$('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                $('#modalinfo').modal('show');
            }
            else{
                $('.modal-body').text(res.message);
$('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
                $('#modalinfo').modal('show');
            }
        },
        error: function (err) {
            $('.modal-body').text('Connection lost: Please re-login the page');
            $('#modalinfo').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#modalinfo').modal('show');
        }
    });

});

});

