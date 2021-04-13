
/**
 * 绘制图片拖动模块的难点
 *  
 *  1.就是如何在canvas画布上面准确的截取某一部分的图画   完成
 *  2.就是如何让画布上面的图画跟着下面的拖动条一起移动    完成
 *  3.就是如何判断最终的移动位置是否正确
 *  
 *  鼠标放上时 拖动图标颜色变化                            hover
 *  鼠标拖动时 slidemask颜色变化                          active
 *  鼠标拖动失败 拖动图标和slidermask的颜色会变成失败色     fail
 *  鼠标拖动成功 拖动图标和slidermask的颜色会变成成功色     success
 *  ？拖动过程不是很平滑 
 */
(function (window) {
    /**
     * 
     * @param { callback } onFile       失败回调 
     * @param { callback } onSuccess    成功回调
     * @param { string }   el           存放canvas元素的容器
     */
    function DragImage(opts) {
        this.correctImage = false;
        this.height = 155;
        this.width = 310;
        this.el = opts.el;
        this.onSuccess = opts.onsuccess
        this.onFail = opts.onfail
        this.l = 42;
        this.r = 9;
        this.PI = Math.PI;
        this.L = this.l + this.r * 2 + 3;
        this.openContent = '向右滑动填充拼图'
        // 配置滑块的大小和位置
    }
    function getRoundNumber(start, end) {
        /**
         * Math.round() 返回四舍五入后的整数
         * Math.random() 返回0-1之间的随机数
         */
        return Math.round(Math.random() * (end - start) + start);
    }
    function createImage(onload) {
        var image = document.createElement('img')
        image.crossOrigin = "Anonymous"
        image.onload = onload
        image.src = getRoundImage()
        return image
    }
    function getRoundImage() {
        return "./lib/image/drag_" + getRoundNumber ( 1, 18 ) + '.jpg'
    }
    function createElement(tarName, className) {
        var ele = document.createElement(tarName)
        ele.className = className
        return ele
    }
    function addClass(tar, className) {
        tar.classList.add(className)
    }
    function removeClasss(tar, className) {
        tar.classList.remove(className)
    }
    function createCanvas(height, width) {
        var canvas = document.createElement('canvas')
        canvas.height = height;
        canvas.width = width;
        return canvas
    }
    /**
     * @description 绘制拼图的缺损部分
     * @param { object } ctx    画笔 
     * @param { number } x      x轴的距离
     * @param { number } y      y轴的距离 
     * @param { string } option 填充格式
     *  
     */
    function draw(ctx, x, y, l, r, PI, option) {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
        ctx.lineTo(x + l, y)
        ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
        ctx.lineTo(x + l, y + l)
        ctx.lineTo(x, y + l)
        ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
        ctx.lineTo(x, y)
        ctx.lineWidth = 2
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.stroke()
        ctx[option]()
        ctx.globalCompositeOperation = 'overlay'
    }
    function sum(x, y) {
        return x + y;
    }
    function square(x, y) {
        return x * y;
    }
    DragImage.prototype = {

        init: function () {
            //对构造函数中的方法进行初始化
            this.initDom()
            this.initImage()
            this.bindEvents()
        },
        initDom: function () {

            var canvas = createCanvas(this.height, this.width)
            var block = canvas.cloneNode(true)
            var slider = createElement('div', 'slider')
            var sliderIcon = createElement('span', 'sliderIcon')
            var refreshIcon = createElement('div', 'refreshIcon')
            var text = createElement('span', 'sliderText')
            var sliderContainer = createElement('div', 'sliderContainer')
            var sliderMask = createElement('div', 'sliderMask')
            text.innerHTML = this.openContent
            block.className = 'block'

            this.el.appendChild(canvas)
            this.el.appendChild(block)
            this.el.appendChild(sliderContainer)
            this.el.appendChild(refreshIcon)
            sliderContainer.appendChild(text)
            sliderContainer.appendChild(sliderMask)
            sliderMask.appendChild(slider)
            slider.appendChild(sliderIcon)
            Object.assign(this, {
                canvas,
                slider,
                block,
                refreshIcon,
                text,
                sliderMask,
                sliderContainer,
                canCtx: canvas.getContext('2d'),
                bloCtx: block.getContext('2d')
            })
        },
        initImage: function () {
            var self = this;

            var image = createImage(function () {
                self.draw()
                self.canCtx.drawImage(image, 0, 0, self.width, self.height)
                self.bloCtx.drawImage(image, 0, 0, self.width, self.height)
                var y = self.y - self.r * 2 - 1
                var imageData = self.bloCtx.getImageData(self.x - 3, y, self.L, self.L)
                self.block.width = self.L;
                self.bloCtx.putImageData(imageData, 0, y)
            })
            self.image = image
        },
        bindEvents: function () {
            var self = this;
            self.el.onselectstart = function(){
                return false
            }
            self.refreshIcon.onclick = function () {
                self.reset()
            }
            var originX, originY, isMouseDown = false, trail = [];
            // 鼠标放到拖放块上面时的初始x y的距离
            var handleStart = function (e) {
                originX = e.clientX || e.touches[0].clientX
                originY = e.clientY || e.touches[0].clientY
                isMouseDown = true
            }
            /**
             * @description 判断鼠标移动的距离
             * @param { number } move_x 鼠标移动的x轴距离 
             * @param { number } move_y 鼠标移动的y轴距离
             * @returns 
             */
            var judgeDistance = function (move_x, move_y) {
                if (move_x < 0 || (move_x + 38) >= self.width) return false
                console.log(move_x)
                self.block.style.left = move_x + 'px'
                self.slider.style.left = move_x + 'px'
                var blockLeft = (self.width - 40 -20) / (self.width - 40) * move_x;
                self.block.style.left = blockLeft + 'px' 
                addClass(self.sliderContainer, 'sliderContainer_active')
                self.sliderMask.style.width = move_x + 'px'
            }
            // 鼠标开始拖动时的x y 的移动距离
            var handleMove = function (e) { 
                if (!isMouseDown) return;
                var client_x = e.clientX || e.touches[0].clientX
                var client_y = e.clientY || e.touches[0].clientY
                var move_x = client_x - originX
                var move_y = client_y - originY
                judgeDistance(move_x, move_y)
                trail.push(move_y)
            }

            var handleOver = function (e) {
                if (!isMouseDown) return false
                isMouseDown = false;
                var client_x = e.clientX || e.changedTouches[0].clientX
                if (client_x == originX) return false
                removeClasss(self.sliderContainer, 'sliderContainer_active')
                self.trail = trail
                var spliced, verified;
                spliced = self.verify().spliced
                verified = self.verify().verified
                if (spliced) {
                    if (verified) {
                      addClass(self.sliderContainer, 'sliderContainer_success')
                      typeof self.onSuccess === 'function' && self.onSuccess()
                    } else {
                      addClass(self.sliderContainer, 'sliderContainer_fail')
                      typeof self.onFail === 'function' && self.onFail()
                    }
                  } else {
                    addClass(self.sliderContainer, 'sliderContainer_fail')
                    self.text.innerHTML = '滑块位置拖动不正确'
                    setTimeout(function(){
                        typeof self.onFail === 'function' && self.onFail()
                    }, 500)
                  }
            }
            self.slider.addEventListener('mousedown', handleStart)
            document.addEventListener('mouseover', handleMove)
            document.addEventListener('mouseup', handleOver)
            self.slider.addEventListener('touchstart', handleStart)
            document.addEventListener('touchmove', handleMove)
            document.addEventListener('touchend', handleOver)
        },
        draw: function () {
            var _L = this.L + 10;
            this.x = getRoundNumber(_L, this.width - _L)
            this.y = getRoundNumber(10 + this.r * 2, this.height - _L)
            draw(this.canCtx, this.x, this.y, this.l, this.r, this.PI, 'fill')
            draw(this.bloCtx, this.x, this.y, this.l, this.r, this.PI, 'clip')
        },
        reset: function () {
            this.sliderContainer.className = 'sliderContainer'
            this.block.style.left = 0
            this.slider.style.left = 0
            this.sliderMask.style.width = 0
            this.clean()
            this.image.src = getRoundImage()
        },
        clean: function () {
            this.canCtx.clearRect(0, 0, this.width, this.height)
            this.bloCtx.clearRect(0, 0, this.width, this.height)
            this.block.width = this.width
        },
        verify: function () {
            var arr = this.trail // 赋值
            // 从左到右依次将数组中的元素在回调函数中执行一次，并把上次回调函数中的值放到一个暂存器中
            // 传给下次回调函数，并返回最后一次回调函数的返回值
            var average = arr.reduce(sum) / arr.length //计算y轴移动的平均值 
            // map返回的是将数组中的每个元素在回调函数中执行了一遍后的结果后组成的新数组
            var deviations = arr.map(function(x){
                return x - average
            })
            /**
             * Math是一个内置对象，它不是一个函数对象，拥有一些常用的数学属性和数学计算公式
             */
            var stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length)  //返回平方根
            var left = parseInt(this.block.style.left)
            return {
                spliced: Math.abs(left - this.x) < 10,  // 返回的是函数的绝对值
                // 如果stddev为0的话，证明y轴上下没有波动，可能不是认为操作
                verified: stddev !== 0,   

            }
        }
    }
    window.drawImage = {
        init: function (opts) {
            return new DragImage(opts).init()
        }
    }
})(window)
