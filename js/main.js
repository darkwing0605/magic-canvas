let data = [{
	x: 100,
	y: 500,
	initialX: 100,
	initialY: 500,
	width: 50,
	height: 50,
	vy: -1,
	bg: 'love4',
	title: '那些年，我们还在一起',
	content: '或许每个人都会遇到这样一个人，对你许过无数个明天，却没有出现在你的明天里。你那些年的青春和爱，不过是教会了他如何去爱另一个人。',
}, {
	x: 200,
	y: 550,
	initialX: 200,
	initialY: 550,
	width: 100,
	height: 100,
	vy: -0.5,
	bg: 'leaf',
	title: '要有多坚强，才敢一直念念不忘',
	content: '不是所有的念念不忘，都必有回响。时过境迁，我的故事还属于你，你的故事却再也没有了我的名字。人们常说“因为喜欢，所以甘愿”，却常常忘了下一句：“一厢情愿，就得愿赌服输。”',
}, {
	x: 150,
	y: 500,
	initialX: 150,
	initialY: 500,
	width: 80,
	height: 80,
	vy: -2,
	bg: 'station',
	title: '有些人，一旦错过就不在',
	content: '错过，不是错了，是过了。怕只怕，当你错过之后，才明白自己的一生所爱。',
}, {
	x: 40,
	y: 600,
	initialX: 40,
	initialY: 600,
	width: 80,
	height: 80,
	vy: -2,
	bg: 'sky',
	title: '有幸你来，不负遇见',
	content: '你看，时间一晃多年，相爱相恋又分手的折磨与纠缠，到底还是化成了微微一笑的云淡风轻。',
}]
/*
 * 判断是否手机
 */
const isMobilePhone = () => {
	let ua = navigator.userAgent;
	let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
	let isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
	let isAndroid = ua.match(/(Android)\s+([\d.]+)/);
	let isMobile = isIphone || isAndroid;
	if (isMobile) {
		return true;
	} else {
		alert('请使用移动端访问');
		window.location.href="about:blank";
		window.close();
	}
}
/*
 * 通用函数
 * @param {String}
 * @return DOM节点
 */
const g = (ele) => {
	return document.querySelector(ele);
}
/*
 * 修改样式
 * @param selector {String} DOM节点
 * @param propertyObj {Object} {property: value}修改后的样式
 */
const changeClass = (selector, propertyObj) => {
	let objKey = Object.keys(propertyObj);
	for(let i = 0; i < objKey.length; i++) {
		let _property = objKey[i];
		selector.style[_property] = propertyObj[_property];
	}
}
/*
 * 获取随机值
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
const getRandom = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*
 * 获取随机正负值
 */
const getRandomNegative = () => {
	return Math.random() > 0.5 ? -1 : 1
}
/*
 * 主函数
 */
const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

const bgMusic = g('#bg-music');
const canvas = g('#canvas');
const logo = g('#logo');
const ctx = canvas.getContext('2d');
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const BUBBLE_MARGIN = 9;
let isRepeatArray = [];
const config = {
	flag: false
};
const bubbleImg = new Image();
bubbleImg.src = './images/bubble.png';
canvas.width = windowWidth;
canvas.height = windowHeight;
changeClass(canvas, {'display': 'block'});
const main = {
	music: function() {
		document.addEventListener('WeixinJSBridgeReady', () => {
			bgMusic.play();
		});

		document.addEventListener('touchstart', () => {
			bgMusic.play();
		});
	},
	/*
	 * 随机气泡大小和位置
	 */
	randomBubble: function(bubble) {
			bubble.width = getRandom(50, 100);
			bubble.height = bubble.width;
			bubble.x = getRandom(0, windowWidth - bubble.width);
			bubble.initialX = bubble.x;
			bubble.vy = getRandom(10, 20) * (-1);
	},
	/*
	 * 初始化气泡
	 */
	initBubble: function() {
		data.forEach((item) => {
			const img = new Image();
			const imgBg = new Image();
			img.src = `./images/background/${item.bg}.jpg`;
			imgBg.src = `./images/bubble-bg/${item.bg}.png`;

			item.img = imgBg;
			main.randomBubble(item)
		})
	},
	/*
	 * 渲染气泡
	 */
	renderBubble: function() {
		const margin = 2 * BUBBLE_MARGIN;
		data.forEach((item) => {
			if (item.img) {
				ctx.drawImage(item.img, item.x + BUBBLE_MARGIN, item.y + BUBBLE_MARGIN, item.width - margin, item.height - margin);
			}

			ctx.drawImage(bubbleImg, item.x, item.y, item.width, item.height);
			item.y += item.vy / 10;

			main.isOverflow(item)
		})
	},
	/*
	 * 气泡上浮动画
	 */
	bubbleAnimation: function() {
		ctx.clearRect(0, 0, windowWidth, windowHeight);

		main.renderBubble();
		requestAnimationFrame(main.bubbleAnimation)
	},
	/*
	 * 监听气泡是否超出视口
	 */
	isOverflow: function(bubble) {
		if (bubble.y < -bubble.height) {
			main.randomBubble(bubble);
			bubble.x = bubble.initialX;
			bubble.y = windowHeight + bubble.height;
		} else if (bubble.y < 0 && bubble.y - bubble.vy >= 0) {
			main.isRepeat(bubble);
			// main.renderStory(bubble);
		}
	},
	/*
	 * 检测重复，保证每个气泡都可以看得到
	 */
	isRepeat: function(bubble) {
		if (config.flag) {
			return;
		} else if (isRepeatArray.indexOf(bubble.bg) < 0) {
			isRepeatArray.push(bubble.bg);
			main.renderStory(bubble);
			if (isRepeatArray.length === data.length) {
				isRepeatArray = [];
			}
		}
	},
	/*
	 * 渲染故事
	 */
	renderStory: function(bubble) {
		if (config.flag) {
			return;
		}
		config.flag = true;

		// 隐藏logo
		changeClass(logo, {'display': 'none'});

		// 更换背景
		changeClass(canvas, {
			'background': `url(./images/background/${bubble.bg}.jpg) center top no-repeat`,
			'background-size': 'cover',
			'transition': 'background 1s',
			'opactiy': 1
		});

		// 打印故事
		const typeStory = new Typed('#story', {
			strings: [
				'',
				`<p class="story-title">${bubble.title}</p><p class="story-content">${bubble.content}</p>`
			],
			typeSpeed: 80,
			backSpeed: 30,
			showCursor: false,
			onComplete: () => {
				config.flag = false;
			}
		});
		main.additionalAnimation(bubble)
	},
	additionalAnimation: function(bubble) {
		if (bubble.bg === 'sky' && !starAnimationTimer) {
			g('#story').style.color = '#fff'
			star.randomStar();
			star.starAnimation();
		} else if (starAnimationTimer){
			g('#story').style.color = '#000'
			window.cancelAnimationFrame(starAnimationTimer);
			starCtx.clearRect(0, 0, windowWidth, windowHeight);
			starAnimationTimer = undefined;
		}
		if (bubble.bg === 'leaf' && !leafAnimationTimer) {
			leaf.randomLeaf();
			leaf.leafAnimation();
		} else if (leafAnimationTimer){
			window.cancelAnimationFrame(leafAnimationTimer);
			leafCtx.clearRect(0, 0, windowWidth, windowHeight);
			leafAnimationTimer = undefined;
		}

	}
}
/*
 * 附加动画
 */
const canvasStar = g('#canvas-star');
const starCtx = canvasStar.getContext('2d');
canvasStar.width = windowWidth;
canvasStar.height = windowHeight;
const starCenterX = windowWidth / 2;
const starCenterY = windowHeight / 2;
let starAnimationTimer;
let starItemList = [];

const star = {
	/*
	 * 随机星星
	 * @return {Array} _starItem [x坐标, y坐标, z, opacity]
	 */
	randomStar: function() {
		for(let i = 0; i < 152; i++) {
			let _starItem = [];
			_starItem.push(starCenterX + getRandom(0, 300) * getRandomNegative());
			_starItem.push(starCenterY + getRandom(0, 300) * getRandomNegative());
			_starItem.push(20);
			_starItem.push(getRandom(1, 10) / 10)
			starItemList[i] = _starItem;
		}
	},
	renderStar: function(starItem) {
		// (newX - centerX) / (starItem.x - centerX) = (40 / starItem.z) / 2;
		let newX = (((40 / starItem[2]) / 2) * (starItem[0] - starCenterX)) + starCenterX;
		let newY = (((40 / starItem[2]) / 2) * (starItem[1] - starCenterY)) + starCenterY;
		
		starCtx.globalCompositeOperation='destination-over';
		starCtx.beginPath();
		starCtx.arc(newX, newY, 20 / starItem[2], 0, 2 * Math.PI);
		starCtx.fillStyle = 'rgba(255,255,255,' + starItem[3] + ')'
		starCtx.closePath();
		starCtx.fill();

		starItem[2] -= getRandom(10, 20) / 100;

		if (newX < 0 || newX > windowWidth || newY < 0 || newY > windowHeight || starItem[2] === 0 || 100 / starItem[2] > starCenterX) {
			starItem[0] = starCenterX + getRandom(0, 300) * getRandomNegative();
			starItem[1] = starCenterY + getRandom(0, 300) * getRandomNegative();
			starItem[2] = 20;
			starItem[3] = getRandom(1, 10) / 10;
		}
	},
	starAnimation: function() {
		starCtx.clearRect(0, 0, windowWidth, windowHeight);
		for(let i = 0; i < starItemList.length; i++) {
			star.renderStar(starItemList[i]);
		}
		starAnimationTimer = requestAnimationFrame(star.starAnimation);
	},
};

const canvasLeaf = g('#canvas-leaf');
const leafCtx = canvasLeaf.getContext('2d');
canvasLeaf.width = windowWidth;
canvasLeaf.height = windowHeight;
let leafItemList = [];
let leafAnimationTimer;
const leafImg = new Image();
leafImg.src = './images/sy.png';
const leaf = {
	/*
	 * 随机树叶
	 * @return {Array} _leafItem [x坐标, y坐标, x速度, scale, timer]
	 */
	randomLeaf: function() {
		for(let i = 0; i < 50; i++) {
			let _leafItem = [];
			_leafItem.push(getRandom(windowWidth * .5, windowWidth * 2));
			_leafItem.push(getRandom(0, windowHeight * 1.5) * getRandomNegative());
			_leafItem.push(getRandom(10, 20) / 10);
			_leafItem.push(getRandom(1, 3) / 10);
			_leafItem.push(0);
			leafItemList[i] = _leafItem;
		}
	},
	renderLeaf: function(leafItem) {
		leafItem[4] += .05;
		let newX = leafItem[0] -= leafItem[2];
		let newY = 1 / 2 * 1.5 * leafItem[4] ** 2 + 34 * leafItem[3] + leafItem[1];
		let leafWidth = 94 * leafItem[3];
		let leafHeight = 34 * leafItem[3];

		leafCtx.drawImage(leafImg, newX, newY, leafWidth, leafHeight);
		leafWidth = leafWidth + getRandom(10, 20) / 100 * getRandomNegative();
		leafHeight = leafWidth / 94 * 34;

		if (newX < 0 - 94 * leafItem[3] || newY > windowHeight + 34 * leafItem[3]) {
			leafItem[0] = getRandom(0, windowWidth * 2);
			leafItem[1] = getRandom(0, windowHeight * .3) * getRandomNegative();
			leafItem[2] = getRandom(10, 20) / 10;
			leafItem[3] = getRandom(1, 3) / 10;
			leafItem[4] = 0;
		}
	},
	leafAnimation: function() {
		leafCtx.clearRect(0, 0, windowWidth, windowHeight);
		for(let i = 0; i < leafItemList.length; i++) {
			leaf.renderLeaf(leafItemList[i]);
		}
		leafAnimationTimer = requestAnimationFrame(leaf.leafAnimation);
	},
}
isMobilePhone();
main.initBubble();
main.music();

bubbleImg.onload = () => {
	main.bubbleAnimation();
}
