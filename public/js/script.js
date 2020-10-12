$( "#bars" ).click(function() {
    if($('#app > ul').css('display') == 'none'){
      $( "#app > ul" ).show();
   }else{
      $( "#app > ul" ).hide();
   }})