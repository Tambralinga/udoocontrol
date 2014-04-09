$(function() {
  // initialize all the inputs
  $('input[type="checkbox"],[type="radio"]').not('#create-switch').bootstrapSwitch();
  $('#sl1').slider();

  // dimension
  $('#btn-size-regular-switch').on('click', function () {
    $('#dimension-switch').bootstrapSwitch('size', '');
  });
  $('#btn-size-mini-switch').on('click', function () {
    $('#dimension-switch').bootstrapSwitch('size', 'mini');
  });
  $('#btn-size-small-switch').on('click', function () {
    $('#dimension-switch').bootstrapSwitch('size', 'small');
  });
  $('#btn-size-large-switch').on('click', function () {
    $('#dimension-switch').bootstrapSwitch('size', 'large');
  });
  $('#btn-color-on-switch').on('click', function() {
    $('#change-color-switch').bootstrapSwitch('onColor', 'success');
  });
  $('#btn-color-off-switch').on('click', function() {
    $('#change-color-switch').bootstrapSwitch('offColor', 'danger');
  });

  // animation
  $('#btn-animate-switch').on('click', function() {
    $('#animated-switch').bootstrapSwitch('animate', true);
  });
  $('#btn-dont-animate-switch').on('click', function() {
    $('#animated-switch').bootstrapSwitch('animate', false);
  });
  


  var socket = io.connect();
  
  socket.on('fromserver1', function (data) {
  $('#LED10').bootstrapSwitch('state', data.sw1);
  $('#LED11').bootstrapSwitch('state', data.sw2);
  $('#LED12').bootstrapSwitch('state', data.sw3);
  $('#sl1').slider('setValue',data.p9);
  });
  
  socket.on('fromserver2', function (data) {
  $('#LED10').bootstrapSwitch('state', data.sw1);
  $('#LED11').bootstrapSwitch('state', data.sw2);
  $('#LED12').bootstrapSwitch('state', data.sw3);
  $('#sl1').slider('setValue',data.p9);
  });  


    $('.label-toggle-switchl10').on('switchChange', function(e, data) {
    socket.emit('fromclient', { l10:data.value });
   	});
    $('.label-toggle-switchl11').on('switchChange', function(e, data) {
    socket.emit('fromclient', { l11:data.value });
   	});
    $('.label-toggle-switchl12').on('switchChange', function(e, data) {
    socket.emit('fromclient', { l12:data.value });
    });
    $('#sl1').slider().on('slideStop', function(data) {
    socket.emit('fromclient', { p9:data.value });
    });
  
});