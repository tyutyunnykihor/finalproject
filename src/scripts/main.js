$(document).ready(function () {

    var DEFAULT_SHOW_NUMBER = 6;
    var MIN_LENGTH = 3;
    var MAX_LENGTH_INPUT = 20;
    var MAX_LENGTH_TEXTAREA = 120;

    var once = 0;

    var carouselOwl = $('.owl-carousel');

    carouselOwl.owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        navText: ["<span class='icon-circle'><i class='glyphicon glyphicon-chevron-left'></i></span>", "<span class='icon-circle'><i class='glyphicon glyphicon-chevron-right'></i></span>"],
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 3
            }
        },
        afterAction: function (el) {
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

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            loadGallery(myArr);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    //load images

    function loadGallery(arr) {
        if (!arr.photos) return;
        var out = "";
        var outBtns = '<li class="galleryLi activeBtn" data-category="all"><span class="galleryBtn">all</span></li>';
        var galleryBtnContainer = document.getElementById("galleryBtnContainer");
        var galleryItemContainer = document.getElementById("galleryItemContainer");
        var buttonShowMore = document.getElementById("buttonShowMore");


        var uploadPhotos = arr.photos.map(function (elem) {
            return elem.category
        });

        var uniqueNames = [];

        $.each(uploadPhotos, function (i, el) {
            if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });

        for (var i = 0; i < uniqueNames.length; i++) {
            outBtns += '<li class="galleryLi" data-category="' + uniqueNames[i] + '"><span class="galleryBtn"><span>' + uniqueNames[i] + '</span></span></li>';
        }

        galleryBtnContainer.innerHTML = outBtns;

        for (var i = 0; i < arr.photos.length; i++) {
            out += '<li class="galleryItem col-lg-4 ' + arr.photos[i].category + '"><div class="thumbnail"><div class="galleryImg" style="background-image:url(' + arr.photos[i].url_img + ');"></div><div class="caption"><h3>' + arr.photos[i].name + '</h3><p>' + arr.photos[i].title + '</p></div></div></li>';
        }

        galleryItemContainer.innerHTML = out;

        var btns = galleryBtnContainer.getElementsByClassName("galleryLi");

        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", function () {
                var current = document.getElementsByClassName("activeBtn");
                current[0].className = current[0].className.replace(" activeBtn", "");
                this.className += " activeBtn";
                selectCategoryImg(this.dataset.category);
            });
        }

        buttonShowMore.addEventListener('click', function () {
            showMore();
        });

        selectCategoryImg("all");

    }

    //select images category

    function selectCategoryImg(category) {

        var galleryItems = document.getElementsByClassName("galleryItem");
        var galleryItemShowed = [];
        var buttonShowMore = document.getElementById('buttonShowMore');

        if (category === "all") category = "";
        for (var i = 0; i < galleryItems.length; i++) {
            removeShowClass(galleryItems[i], "show");
            if (galleryItems[i].className.indexOf(category) > -1) AddShowClass(galleryItems[i], "show");
        }
        galleryItemShowed = document.getElementsByClassName('show');

        for (var i = 1; i < galleryItemShowed.length; i++) {
            if (i >= DEFAULT_SHOW_NUMBER) {
                galleryItemShowed[i].classList.add('hiddenItem');
            }
        }


        if (galleryItemShowed.length > DEFAULT_SHOW_NUMBER) {
            buttonShowMore.classList.remove('hidden');
        } else {
            for (var i = 1; i < galleryItemShowed.length; i++) {
                galleryItemShowed[i].classList.remove('hiddenItem');
            }
            buttonShowMore.classList.add('hidden');
        }

    }

    function showMore() {
        var buttonShowMore = $('#buttonShowMore');
        var hiddenItems = $('#galleryItemContainer').find('.hiddenItem');

        $.each(hiddenItems, function (i, el) {
            el.classList.remove('hiddenItem');
        });
        buttonShowMore.addClass('hidden');
    }

    function AddShowClass(element, name) {
        var i, arr1, arr2;
        arr1 = element.className.split(" ");
        arr2 = name.split(" ");
        for (i = 0; i < arr2.length; i++) {
            if (arr1.indexOf(arr2[i]) === -1) {
                element.className += " " + arr2[i];
            }
        }
    }

    function removeShowClass(element, name) {
        var i, arr1, arr2;
        arr1 = element.className.split(" ");
        arr2 = name.split(" ");
        for (i = 0; i < arr2.length; i++) {
            while (arr1.indexOf(arr2[i]) > -1) {
                arr1.splice(arr1.indexOf(arr2[i]), 1);
            }
        }
        element.className = arr1.join(" ");
    }

    //send form
    var questionForm = document.getElementById('questionForm');
    var sendFormBtn = document.getElementById('sendFormBtn');
    if (sendFormBtn) {
        sendFormBtn.addEventListener('click', function (event) {
            sendForm(event);
        });
    }

    function sendForm(event) {
        event.preventDefault();

        var sendObject = {},
            name = document.getElementById('name').value,
            email = document.getElementById('email').value,
            comment = document.getElementById('comment').value;

        sendObject.name = name;
        sendObject.email = email;
        sendObject.comment = comment;

        if (formValidation(email, name, comment)) {

            var xmlhttp = new XMLHttpRequest();
            var url = "/";

            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    alert('ok');
                } else if (this.readyState == 4 && this.status == 404) {
                    alert('404 error');
                }
            };
            xmlhttp.open("POST", url, true);
            xmlhttp.send(JSON.stringify(sendObject));
        }
    }


    function formValidation(email, name, comment) {
        var valid = true;
        var validateEmail = document.getElementById("validateEmail");
        var validateName = document.getElementById("validateName");
        var validateComment = document.getElementById("validateComment");
        validateEmail.classList.add('hidden');
        validateName.classList.add('hidden');
        validateComment.classList.add('hidden');

        if (!emailValidation(email)) {
            validateEmail.classList.remove('hidden');
            valid = false;
        }
        if (!nameValidation(name) || name.length < MIN_LENGTH || name.length > MAX_LENGTH_INPUT) {
            validateName.classList.remove('hidden');
            valid = false;
        }
        if (!commentValidation(comment)) {
            validateComment.classList.remove('hidden');

            valid = false;
        }

        if (!emailValidation(email) || !nameValidation(name) || !commentValidation(comment)) {
            valid = false;
        } else {
            valid = true;
        }

        return valid;

    }

    function emailValidation(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function nameValidation(name) {
        var re =  /^[A-Za-zА-Яа-яІіЇїЄєҐґ -.'ʼ]*[A-Za-zА-Яа-яІіЇїЄєҐґ -.'ʼ][A-Za-zА-Яа-яІіЇїЄєҐґ]*$/;
        return re.test(String(name));
    }
    function commentValidation(comment) {
        var valid = true;
        if (comment.length < MIN_LENGTH || comment.length > MAX_LENGTH_TEXTAREA) {
            valid = false;
        }
        return valid;
    }

    var isInViewport = function (elem) {
        var bounding = elem.getBoundingClientRect();
        return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };


    window.addEventListener('scroll', function (event) {
        var counter = document.getElementById('counter');
        if (counter) {
            if (once === 0 && isInViewport(counter)) {
                once = 1;
                startCalculate();

            }
        }

    }, false);

    function startCalculate() {
        $('.count').each(function () {
            $(this).prop('Counter', 0).animate({
                Counter: $(this).text()
            }, {
                duration: 2000,
                easing: "swing",
                step: function (now) {
                    $(this).text(Math.ceil(now));
                }
            });
        });
    }

});

function initMap() {
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}




