$( document ).ready(function() {
    /*console.log( "ready!" );*/
    $("#live-map-tab-item").click(function (event){
        event.preventDefault();
        $(".container-fluid .tab-visible").addClass("tab-hidden");
        $(".container-fluid .tab-visible").removeClass("tab-visible");
        $("#live-map-tab").removeClass("tab-hidden");
        $("#live-map-tab").addClass("tab-visible");
        
    });
    
    $("#login").click(function (event){
        event.preventDefault();
        $(".container-fluid .tab-visible").addClass("tab-hidden");
        $(".container-fluid .tab-visible").removeClass("tab-visible");
        $("#logindiv").removeClass("tab-hidden");
        $("#logindiv").addClass("tab-visible");
        
    });

    $("#signup").click(function (event){
        event.preventDefault();
        $(".container-fluid .tab-visible").addClass("tab-hidden");
        $(".container-fluid .tab-visible").removeClass("tab-visible");
        $("#signupdiv").removeClass("tab-hidden");
        $("#signupdiv").addClass("tab-visible");
        
    });
    
   $("#logout").click(function (event){
        event.preventDefault();
        $(".container-fluid .tab-visible").addClass("tab-hidden");
        $(".container-fluid .tab-visible").removeClass("tab-visible");
        $("#logoutdiv").removeClass("tab-hidden");
        $("#logoutdiv").addClass("tab-visible");
        
    });
    
    $("#my-roads-tab-item").click(function (event){
        event.preventDefault();
        $(".container-fluid .tab-visible").addClass("tab-hidden");
        $(".container-fluid .tab-visible").removeClass("tab-visible");
        $("#roads-tab").removeClass("tab-hidden");
        $("#roads-tab").addClass("tab-visible");
        
    });
    
  
    $("#traffic-feed-tab-item").click(function (event){
        event.preventDefault();
        $(".container-fluid .tab-visible").addClass("tab-hidden");
        $(".container-fluid .tab-visible").removeClass("tab-visible");
        $("#feed-tab").removeClass("tab-hidden");
        $("#feed-tab").addClass("tab-visible");
        
    });
    
    $("#update-traffic-tab-item").click(function (event){
        event.preventDefault();
        $(".container-fluid .tab-visible").addClass("tab-hidden");
        $(".container-fluid .tab-visible").removeClass("tab-visible");
        $("#updates-tab").removeClass("tab-hidden");
        $("#updates-tab").addClass("tab-visible");
        
    });
    
    $("#support-tab-item").click(function (event){
        event.preventDefault();
        $(".container-fluid .tab-visible").addClass("tab-hidden");
        $(".container-fluid .tab-visible").removeClass("tab-visible");
        $("#support-tab").removeClass("tab-hidden");
        $("#support-tab").addClass("tab-visible");
        
    });
    $("#statistics-tab-item").click(function (event){
        event.preventDefault();
        $(".container-fluid .tab-visible").addClass("tab-hidden");
        $(".container-fluid .tab-visible").removeClass("tab-visible");
        $("#statistics-tab").removeClass("tab-hidden");
        $("#statistics-tab").addClass("tab-visible");
        
    });
});