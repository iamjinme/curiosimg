$(document).ready(function() {
  function redirect() {
    var search = $("#search").val();
    if (search !== '') {
      window.location.href = "/api/search/" + search;
    }
  };
  $("#find").click(function() {
      redirect();
  });
  $(document).keypress(function(e) {
    if(e.which == 13) {
        redirect();
    }
  });  
});
