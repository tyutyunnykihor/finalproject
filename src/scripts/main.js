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

    var xmlhttp = new XMLHttpRequest();
    var url = "data/gallery.json";

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            loadGallery(myArr);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function loadGallery(arr) {
        if (!arr.photos) return;
        var out = "";
        var i;
        for(i = 0; i < arr.photos.length; i++) {
            out += '<img src="' + arr.photos[i].url_img + '">' +
                arr.photos[i].title + '<br>';
        }
        //document.getElementById("galleryOutput").innerHTML = out;
    }

});
