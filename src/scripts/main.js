$(document).ready(function() {
    var owl = $('.owl-carousel');

    $('.owl-carousel').owlCarousel({
        loop:true,
        margin:10,
        nav:true,
        navText: ["<span class='icon-circle'><i class='glyphicon glyphicon-chevron-left'></i></span>","<span class='icon-circle'><i class='glyphicon glyphicon-chevron-right'></i></span>"],
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },
            1000:{
                items:3
            }
        },
        afterAction: function(el){
            //remove class active
            this
                .$owlItems
                .removeClass('active')

            //add class active
            this
                .$owlItems //owl internal $ object containing items
                .eq(this.currentItem + 1)
                .addClass('active')
        }
    });

});
