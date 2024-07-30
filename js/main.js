var iUp = (function () {
	var t = 0,
		d = 150,
		clean = function () {
			t = 0;
		},
		up = function (e) {
			setTimeout(function () {
				$(e).addClass("up")
			}, t);
			t += d;
		},
		down = function (e) {
			$(e).removeClass("up");
		},
		toggle = function (e) {
			setTimeout(function () {
				$(e).toggleClass("up")
			}, t);
			t += d;
		};
	return {
		clean: clean,
		up: up,
		down: down,
		toggle: toggle
	}
})();

$(document).ready(function () {

	// 获取一言数据
	fetch('https://v1.hitokoto.cn').then(function (res) {
		return res.json();
	}).then(function (e) {
		$('#description').html(e.hitokoto + "<br/> -「<strong>" + e.from + "</strong>」")
	}).catch(function (err) {
		console.error(err);
	})


	// var url = 'https://query.yahooapis.com/v1/public/yql' + 
	// '?q=' + encodeURIComponent('select * from json where url=@url') +
	// '&url=' + encodeURIComponent('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8') +
	// '&format=json&callback=?';

	/**
	 * 获取Bing壁纸
	 * 原先 YQL 已经无法提供服务了
	 * 改用 JsonBird：https://bird.ioliu.cn/
	 * 
	 */
// 设置API参数
var date = 'today'; // 可以是 'today', 'yesterday' 或 '20240730' 格式的日期
var lang = 'zh-cn'; // 语言代码，默认为 'zh-cn'
var mode = 'FHD'; // 分辨率模式，默认为 'FHD'

// 构建API URL
var apiUrl = `https://dailybing.com/api/v1/${date}/${lang}/${mode}`;

// 获取页面元素
var $panel =$('#panel');

// 尝试从sessionStorage获取图片URLs和索引
var imgUrls = JSON.parse(sessionStorage.getItem("imgUrls"));
var index = parseInt(sessionStorage.getItem("index"), 10);

// 检查是否需要重新获取图片URLs
if (!imgUrls || index === undefined) {
    imgUrls = new Array();
    index = 0;

    // 发送请求到API获取图片信息
    $.get(apiUrl, function (result) {
        // 假设result包含图片的URL，这里需要根据实际API返回结果调整
        if (result && result.imageUrl) {
            imgUrls.push(result.imageUrl); // 将获取到的图片URL添加到数组中
            var imgUrl = imgUrls[index]; // 获取当前索引的图片URL
            $panel.css("background", "url('" + imgUrl + "') center center no-repeat #666"); // 设置背景图片
            $panel.css("background-size", "cover"); // 设置背景图片大小为覆盖整个元素
            sessionStorage.setItem("imgUrls", JSON.stringify(imgUrls)); // 将图片URLs存储到sessionStorage
            sessionStorage.setItem("index", index.toString()); // 将索引存储到sessionStorage
        } else {
            console.error('无法获取图片URL');
        }
    }).fail(function () {
        console.error('API请求失败');
    });
} else {
    // 如果sessionStorage中有图片URLs和索引，则直接使用
    var imgUrl = imgUrls[index];
    $panel.css("background", "url('" + imgUrl + "') center center no-repeat #666");
    $panel.css("background-size", "cover");
}

	} else {
		if (index == 7)
			index = 0;
		else
			index++;
		var imgUrl = imgUrls[index];
		var url = "https://www.bing.com" + imgUrl;
		$panel.css("background", "url('" + url + "') center center no-repeat #666");
		$panel.css("background-size", "cover");
		sessionStorage.setItem("index", index);
	}

	$(".iUp").each(function (i, e) {
		iUp.up(e);
	});

	$(".js-avatar")[0].onload = function () {
		$(".js-avatar").addClass("show");
	}
});

$('.btn-mobile-menu__icon').click(function () {
	if ($('.navigation-wrapper').css('display') == "block") {
		$('.navigation-wrapper').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
			$('.navigation-wrapper').toggleClass('visible animated bounceOutUp');
			$('.navigation-wrapper').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
		});
		$('.navigation-wrapper').toggleClass('animated bounceInDown animated bounceOutUp');

	} else {
		$('.navigation-wrapper').toggleClass('visible animated bounceInDown');
	}
	$('.btn-mobile-menu__icon').toggleClass('social iconfont icon-list social iconfont icon-ngleup animated fadeIn');
});
