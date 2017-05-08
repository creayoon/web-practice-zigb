/*
problems
0. base element 여기서 잡으니 안잡혀서 html에서 dom element 잡아서 넘겨줌, 이유?
0. 위에 여백 css, safe-asset css... 깔끔하게 하려면?
0. keyframes animation 
1. image slider: zindex 100으로 초기화 시킨 후 움직임 이상함
2. modal창 띄운 후 뒤쪽 element이벤트 전부 다 막고 modal만 이벤트 처리하는 방법? 일단 scroll만 막음
3. 
*/


// image slider
var startX, changeX, imgWidth;

function touchStart(e) {
	startX = e.touches[0].clientX;
}

function touchMove(e) {
	var self = this;
	var moveX = e.touches[0].clientX;
	changeX = startX - moveX;
	imgWidth = e.target.clientWidth;

	if (changeX > 0) {
		e.target.parentNode.style.left = -changeX+ 'px';		
	}
}

function touchEnd(e) {
	// img autoslide : touch over & move more than 100px
	if(changeX >= 100) {
		var imgStyle = e.target.parentNode.style;
		// back했다가 animation되는 문제
		// e.target.parentNode.classList.add('slide');

		// 날라감
		// e.target.parentNode.style.left = -imgWidth+ 'px'; 

		// ok
		imgStyle.transition = '1s';
		imgStyle.transform = 'translate('+(-imgWidth)+'px, 0px)'

		setTimeout( function(){
			// basic sliding action
			imgStyle.zIndex = '10';
			imgStyle.left = '0px';
			imgStyle.transform = 'translate(0px, 0px)'	
			
			// if it's last image, z-index init 
			if (e.target.parentNode == wrapper.children[0]){
				for (var i=0; i < wrapper.children.length; i++) {
					wrapper.children[i].style.zIndex = '100';
					console.log(wrapper.children[i].style.zIndex);
				}
			}
		}, 1000);

	} else {
		e.target.parentNode.style.left = '0px';
	}
}


// modal
function modal() {
    // console.log(window.event);
    // window.event.stopPropagation();

    // toggle modal
    if (!imgModal.classList.contains('show-modal')) {
	    imgModal.style.visibility = 'visible';
	    imgModal.style.height = '100%';
	    imgModal.classList.add('show-modal');
	    body[0].classList.add('stop-scrolling');
    } else {
    	imgModal.style.visibility = 'hidden';
	    imgModal.style.height = '0px';
	    imgModal.classList.remove('show-modal');
	    body[0].classList.remove('stop-scrolling');
    }

}

// ajax
function ajax() {
	var xmlhttp = new XMLHttpRequest();

	// limits on file:/// protocol(local file path), use web server
	xmlhttp.open('GET', 'https://raw.githubusercontent.com/creayoon/Baltimore/baltimore/src/data/zigbang.json', true);
	xmlhttp.onreadystatechange = function() {
		// console.log(xmlhttp);

	    if (xmlhttp.readyState == 4) {
	        if(xmlhttp.status == 200) {
	            var obj = JSON.parse(xmlhttp.responseText);
	            var buildingInfo = obj.datas[0];
	            // console.log(buildingInfo);

	            // building img
	            var imgNode = document.createElement('img');
	            imgNode.classList.add('building-img');
	            imgNode.setAttribute('src', buildingInfo.img);

	            // building info
	            var infoNode = document.createElement('div');
	            infoNode.classList.add('building-info');
	            var blank = document.createTextNode('');
	            infoNode.appendChild(blank)

	            // building info detail
	            var nameNode = document.createElement('p');
	            var nameTextNode = document.createTextNode(buildingInfo.name);
	            nameNode.appendChild(nameTextNode);

	            var addNode = document.createElement('p');
	            var addTextNode = document.createTextNode(buildingInfo.address1 + buildingInfo.address2 + buildingInfo.address3);
	            addNode.appendChild(addTextNode);

	            var floor = document.createElement('p');
	            var floorTextNode = document.createTextNode(buildingInfo.floor)
	            floor.appendChild(floorTextNode);

	            var rooms = document.createElement('p');
	            var roomsTextNode = document.createTextNode(buildingInfo.rooms)
	            rooms.appendChild(roomsTextNode);

	            var established = document.createElement('p');
	            var establishedTextNode = document.createTextNode(buildingInfo.established)
	            established.appendChild(establishedTextNode);

	            // append 
				buildingContent.appendChild(imgNode);
				buildingContent.appendChild(infoNode);
				buildingContent.children[1].appendChild(nameNode);
				buildingContent.children[1].appendChild(addNode);
				buildingContent.children[1].appendChild(floor);
				buildingContent.children[1].appendChild(rooms);
				buildingContent.children[1].appendChild(established);
				
	            
	         }
	    }
	};
	xmlhttp.send(null);
}

// daum map
function daumMap() {
	console.log(window.daum);
	var options = { 
		center: new daum.maps.LatLng(33.450701, 126.570667), 
		level: 3
	};

	var map = new daum.maps.Map(mapContainer, options); 
}

// naver map
function naverMap() {
	var map = new naver.maps.Map('map');
	console.log(map)

      var myaddress = '불정로 6';// 도로명 주소나 지번 주소만 가능 (건물명 불가!!!!)
      naver.maps.Service.geocode({address: myaddress}, function(status, response) {
          if (status !== naver.maps.Service.Status.OK) {
              return alert(myaddress + '의 검색 결과가 없거나 기타 네트워크 에러');
          }
          var result = response.result;
          // 검색 결과 갯수: result.total
          // 첫번째 결과 결과 주소: result.items[0].address
          // 첫번째 검색 결과 좌표: result.items[0].point.y, result.items[0].point.x
          var myaddr = new naver.maps.Point(result.items[0].point.x, result.items[0].point.y);
          map.setCenter(myaddr); // 검색된 좌표로 지도 이동
          // 마커 표시
          var marker = new naver.maps.Marker({
            position: myaddr,
            map: map
          });
          // 마커 클릭 이벤트 처리
          naver.maps.Event.addListener(marker, "click", function(e) {
            if (infowindow.getMap()) {
                infowindow.close();
            } else {
                infowindow.open(map, marker);
            }
          });
          // 마크 클릭시 인포윈도우 오픈
          var infowindow = new naver.maps.InfoWindow({
              content: '<h4> [네이버 개발자센터]</h4><a href="https://developers.naver.com" target="_blank"><img src="https://developers.naver.com/inc/devcenter/images/nd_img.png"></a>'
          });
      });
}












// prototype ---------------------------------------
// function _ImageSlider(selector){
// 	this.init(selector);
// }

// _ImageSlider.prototype = {
// 	init:function(selector){
// 		// 변수 초기화
// 		this.index = 0;
// 		this.wrapper = selector;
// 		this.images = selector.children;
// 		this.imgLength = selector.children.length;

// 		// console.log(this.images, this.imgLength)

// 		// basic function call
// 		this.initImage();
// 		this.setupEvent();

// 	},

// 	initImage:function(){
		
// 	},

// 	setupEvent:function(){
// 		var self = this;
// 		// console.log(111)

// 		this.images.click = function(e) {
// 			console.log(222)
// 		}

// 		// this.images.click = function() {
// 		// 	console.log(222)
// 		// }

// 		// this.images.onmouseover = function() {
// 		// 	console.log(333)
// 		// }

// 	},		
// }

// window.ImageSlider = _ImageSlider;


// // modal
// function _Modal(){

// }

// _Modal.prototype = {
// 	init:function(selector) {

// 	}
// }

// window.Modal = _Modal;


