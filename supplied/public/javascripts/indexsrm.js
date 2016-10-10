//            滚动图自动轮播
srmObj.starcarousel = function() {
    $(".carousel").carousel({interval: 5000});
};

//            禁用轮播
srmObj.stopcarousel = function() {
    $(".carousel").carousel("pause");
};

//            点击禁用轮播
$("a[data-toggle='modal'],button[data-toggle='modal']").on("click", function() {
    srmObj.stopcarousel();
});

//滚动图自动轮播
srmObj.starcarousel();

//                banner img图居中显示
function centerImg() {
    var screenWidth = document.body.offsetWidth;
    var carouselImg = $(".carousel-inner").find(".originimg");
    var imgWidth = carouselImg.width();
    carouselImg.css({"margin-left": "-" + (imgWidth - screenWidth) / 2 + "px"});
}

centerImg();