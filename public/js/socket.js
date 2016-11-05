$(function(){
  var socket=io.connect();
  var $messageForm=$('#messageForm');
  var $message= $('#message');
  var $chat=$('#chat');
  var $userForm=$('#userForm');
  var $messageArea=$('#messageArea');
  var $userFormArea=$('#userFormArea');
  var $users=$('#users');
  var $username=$('#username');


  $messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send message',$message.val());
    $message.val('');
  });

  socket.on('new message',function(data){
    if(data.msg!==''){
        $chat.append( '<div class="well"><strong>'+data.user+': </strong>'+data.msg+'</div>');
    }
  });

  $userForm.submit(function(e){
    e.preventDefault();
    socket.emit('new user',$username.val(),function(data){
      if(data){
        $userFormArea.hide();
        $messageArea.show();
      }
    });
    $username.val('');
  });

  socket.on('get users',function(data){
    var html='';
    for(var i=0;i<data.length;i++){
      html+='<li class="list-group-item">'+data[i]+'</li>';
    }
    $users.html(html);
  });
});
