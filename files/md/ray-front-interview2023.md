## 前端

### 1. JavaScript

#### 1.1 垃圾回收机制

##### 1.1.1 垃圾的产生

当我们写代码时创建一个基本类型、对象、函数等，都是需要占用内存的，**JavaScript基本数据类型存储在栈内存中，引用数据类型存储在堆内存中，但是引用数据类型会在栈内存中存储一个实际对象的引用**。
比如说我们创建了一个`person`对象，然后将`person`对象重新赋值：

```javascript
var person = {
    name: "橘猫吃不胖",
    age: 2
}
person = [1, 2, 3];
console.log(person); // [ 1, 2, 3 ]
```

那么原本堆内存给`person`对象开辟了一个空间来存放，栈内存中存放了该引用的地址，但是在下一步中，`person`对象成为了一个数组，也就是说引用地址从原来的对象变成了数组，原来的引用关系就没有了，那么这时原来的对象在堆内存中就会成为一个垃圾。
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231031095902135.png" alt="image-20231031095902135" style="zoom:33%;" />

##### 1.1.2 垃圾回收

JavaScript中主要的内存管理概念是可达性。
那什么是可达性呢，比如说定义一个对象：

```javascript
let person = {
    name: "橘猫吃不胖",
    age: 2
}
console.log(person.name, person.age); // 橘猫吃不胖 2
```

person引用了这个对象，通过person.name可以获取到“橘猫吃不胖”的值，通过person.age可以获取到2，那么这时就可以认为“橘猫吃不胖”和2是可达的。

```javascript
person = null;
console.log(person.name, person.age); // TypeError: Cannot read properties of null (reading 'name')
```

如果将person设置为null，那么这两个值就没法获得了，它们就是不可达的，这时JavaScript垃圾回收机制就会自动从内存中将其清除。那么JavaScript的垃圾回收就是定期找出这些不可达的对象，然后将其释放。那么找出这些不可达的对象有两种常用的策略：
标记清除法
引用计数法

###### 1.1.2.1 标记清除法

标记清除法分为标记和清除两个阶段，标记阶段需要从根节点遍历内存中的所有对象，并为可达的对象做上标记，清除阶段则把没有标记的对象（非可达对象）销毁。
标记清除法的优点就是实现简单。
它的缺点有两个，首先是内存碎片化。这是因为清理掉垃圾之后，未被清除的对象内存位置是不变的，而被清除掉的内存穿插在未被清除的对象中，导致了内存碎片化。
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231031100308642.png" alt="image-20231031100308642" style="zoom:33%;" />

第二个缺点是**内存分配速度慢**。由于空闲内存不是一整块，假设新对象需要的内存是`size`，那么需要对空闲内存进行一次单向遍历，找出大于等于`size`的内存才能为其分配。
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231031100406626.png" alt="image-20231031100406626" style="zoom:33%;" />

***标记清除算法改进—标记整理算法***

标记清除算法的缺点主要在于内存清理之后剩余的内存位置不变而导致内存碎片化，因此可以使用标记整理算法改进。标记整理算法的标记阶段与标记清除算法相同，都是从根节点遍历内存中的所有对象，为可达的对象打上一个标记。但是在标记结束后，标记整理算法将这些可达的对象移向内存的一端，然后清理掉边界的内存。
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231031100550520.png" alt="image-20231031100550520" style="zoom:33%;" />

###### 1.1.2.2 引用计数法

引用计数法主要记录对象有没有被其他对象引用，如果没有被引用，它将被垃圾回收机制回收。它的策略是跟踪记录每个变量值被使用的次数，当变量值引用次数为0时，垃圾回收机制就会把它清理掉。

示例代码如下：
```javascript
let person = { name: "橘猫吃不胖" }; // { name: "橘猫吃不胖" } 引用次数为1
let person1 = person; // { name: "橘猫吃不胖" } 引用次数为2
person = null; // { name: "橘猫吃不胖" } 的引用次数为1
person1 = null; // { name: "橘猫吃不胖" } 的引用次数为0
```

引用计数法的优点是可以实现立即进行垃圾回收。当引用计数在引用值为0时，立即进行垃圾回收，这样可以达到立刻垃圾回收的效果。它的缺点也有两个，首先它需要一个计数器，这个计数器可能要占据很大的位置，因为我们无法知道被引用数量的多少。第二个缺点是无法解决当出现循环引用时无法回收的问题。例如a引用了b，b也引用了a，两个对象相互引用，引用计数不为0，因此无法进行内存清理，如下所示：
```javascript
let a = { name: "橘猫吃不胖" };
let b = { age: 2 };
a.age = b;
b.name = a;
```

##### 1.1.3 V8对垃圾回收机制的优化-分代式垃圾回收机制

目前大多数浏览器都是基于**标记清除算法**，V8进行了一些优化加工处理，采用分代式垃圾回收机制。

###### 1.1.3.1 新生代与老生代

原本的垃圾回收机制在每次回收时都要检查内存中所有的对象，这样的话，一些大、老、存活时间长的对象与新、小、存活时间短的对象检查频率相同，但是前者并不需要频繁进行清理，因此采用分代式垃圾回收机制。

V8中将堆内存分为新生代和老生代两区域，采用不同的垃圾回收策略进行回收。新生代的对象为存活时间较短的对象，通常只支持1～8M的容量，老生代的对象为存活时间较长或常驻内存的对象，容量通常比较大，V8整个堆内存的大小就等于新生代加上老生代的内存。
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231031101719257.png" alt="image-20231031101719257" style="zoom:33%;" />

###### 1.1.3.2 新生代的垃圾回收

新生代垃圾回收策略中，将堆内存一分为二，一个是处于使用状态的使用区，一个是处于闲置状态的空闲区。
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231031101838028.png" alt="image-20231031101838028" style="zoom:33%;" />

**新加入的对象都会存放到使用区**，当使用区快满时，就需要执行一次垃圾清理操作，即新生代垃圾回收机制会对使用区中的活动对象（不需要被清理的对象）做标记，标记完成之后将这些活动对象复制到空闲区并进行排序（避免内存碎片化），然后将使用区清空，原来的空闲区变为使用区，原来的使用区变为空闲区。
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231031101952403.png" alt="image-20231031101952403" style="zoom:33%;" />

当一个对象经过多次复制后依然存活，它将会被认为是生命周期较长的对象，会被移动到老生代的内存中，或者一个对象被复制到空闲区时，空闲区占用空间超过了25%，那么该对象也会进入老生代内存中。

新生代回收策略——并行回收
JavaScript是单线程的语言，当执行垃圾回收时，就会阻塞JavaScript脚本的执行，垃圾回收结束后再继续JavaScript脚本执行，这种情况叫做全停顿（Stop-The-World）。

如果执行一次垃圾回收需要100ms，那么脚本执行就得暂停100ms，如果执行垃圾回收的时间过长，那么就会造成页面卡顿，带来不好的用户体验。对于这样的情况，可以采用并行回收的策略。

并行回收指的是在主线程进行垃圾回收时，同时开启多个辅助线程一起执行垃圾回收。比如说一项任务一个人需要30天才能完成，那么如果安排两个人甚至多个人，可能10来天甚至更短的时间就完成了。实现并行回收可以大大降低垃圾回收的暂停时间。

新生代对象空间就采用并行策略，在执行垃圾回收的过程中，会启动了多个线程来负责新生代中的垃圾清理操作，这些线程同时将对象空间中的数据移动到空闲区域，这个过程中由于数据地址会发生改变，所以还需要同步更新引用这些对象的指针，此即并行回收。

![image-20231031102127002](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231031102127002.png)

###### 1.1.3.3 老生代的垃圾回收

老生代的垃圾回收操作主要就是标记清除算法的步骤了，在标记阶段标记所有的可达对象，清除阶段清除掉未被标记的对象。又由于该算法会出现内存碎片的问题，因此会使用标记整理算法来优化这个过程。

***老生代回收策略——增量标记与惰性清理***
①增量标记
增量就是将一次标记的过程，分成了许多次，每执行完一次就让应用逻辑执行一会儿，这样交替多次后完成垃圾回收。但是这会随之而来新的问题，首先是如何暂停每次标记去执行JavaScript代码，还有如果标记好的对象在执行js中改变了状态成为了可达或者不可达对象怎么办，V8对这两个问题对应的解决方案分别是三色标记法与写屏障。
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231031102405440.png" alt="image-20231031102405440" style="zoom:33%;" />

a.三色标记法
三色标记法使用三种颜色白、灰、黑来标记对象的状态。白色表示初始状态，黑色表示已检查状态，灰色表示待检查状态。

它的过程为：
1、将所有的对象设置为白色，然后从root对象出发，将所有可以访问的对象标记为灰色，并用一个数组缓存起来；
2、遍历该数组，每次都把要遍历的对象标记为黑色并移出，并且把他的相邻节点都涂成灰色，并放入队列，直到队列为空
3、继续检查是否有灰色对象，如果有继续放入队列然后循环，直到所有的可访问对象都变成黑色

采用三色标记法后，程序在恢复执行时可以直接判断当前内存中有没有灰色节点，如果有灰色节点，那么从灰色节点开始继续执行，如果没有，直接进入垃圾清理阶段。

b.写屏障
写屏障可以解决第二个问题，如果执行任务程序时内存中标记好的对象引用关系被修改了，比如说黑色对象引用了白色对象，那么它就会将白色对象改成灰色对象，这样就可以保证下一次标记时可以正常进行。

②惰性清理
增量标记完成后，就开始清除垃圾。如果当前的可用内存可以支持快速的执行代码，就没必要立即清理内存，而且清理时没必要一次性清理完，可以按需清理。
优点：大大减少了主线程停顿的时间，让用户与浏览器交互的过程变得更加流畅
缺点：并没有减少主线程的总暂停的时间，甚至会略微增加

***老生代回收策略——并发回收***

并发回收指的是主线程在执行JavaScript的过程中，辅助线程能够在后台完成执行垃圾回收的操作，辅助线程在执行垃圾回收的时候，主线程也可以自由执行
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231031102656572.png" alt="image-20231031102656572" style="zoom:33%;" />

#### 1.2 防抖和节流，应用场景

防抖和节流都是防止某一时间频繁触发，但是原理却不一样。
防抖是将多次执行变为只执行一次，节流是将多次执行变为每隔一段时间执行。

防抖(debounce)：
search搜索联想，用户在不断输入值时，用防抖来节约请求资源。
window触发resize的时候，不断的调整浏览器窗口大小会不断的触发这个事件，用防抖来让其只触发一次

```javascript
// 定义防抖函数
// fn: 点击按钮要执行的函数
// delay: 延迟时间
function debounce(fn, delay) {
    // 设置定时器标识（写在return函数外面，方便下面内部函数获取）
    let timer;
    // 返回函数，不然调用debounce会立即执行此函数
	return function() {
        // fn指定this
        let context = this;
        // fn参数
        let args = arguments;
        // 先清除定时器
        clearTimeout(timer);
        // 设置定时器
        timer = setTimeout(() => {
        	// 调用函数
        	fn.apply(context, args);
        }, delay);
    }
}
// 给按钮添加点击监听事件，点击时，执行debounce函数
btn.addEventListener("click", debounce(方法函数, 1000))
```

节流(throttle)：
鼠标不断点击触发，mousedown(单位时间内只触发一次)
监听滚动事件，比如是否滑到底部自动加载更多，用throttle来判断

```javascript
function throttle(fn, delay) {
	let timer = null;
  	return function() {
    	let context = this;
    	let args = arguments;
    	if (!timer) {
      		timer = setTimeout(function() {
                fn.apply(context, args);
                timer = null;
      		}, delay);
     	}
  	}
}
// 给按钮添加点击监听事件，点击时，执行debounce函数
btn.addEventListener("click", throttle(方法函数, 1000))
```

#### 1.3 闭包

闭包就是能够读取其他函数内部变量的函数。
由于在javascript中，只有函数内部的子函数才能读取局部变量，所以说，闭包可以简单理解成***定义在一个函数内部的函数***。
所以，在本质上，闭包是将函数内部和函数外部连接起来的桥梁。

闭包特征
①函数嵌套函数
②函数内部可以引用函数外部的参数和变量
③参数和变量不会被垃圾回收机制回收

闭包的优点
1）保护函数内的变量安全 ，实现封装，防止变量流入其他环境发生命名冲突
2）在内存中维持一个变量，可以做缓存（但使用多了同时也是一项缺点，消耗内存）
3）匿名自执行函数可以减少内存消耗
4）方便调用上下文的局部变量。

闭包的注意点（缺点）
(1)被引用的私有变量不能被销毁，增大了内存消耗，造成内存泄漏，解决方法是可以在使用完变量后手动为它赋值为null；
(2)闭包会在父函数外部，改变父函数内部变量的值。所以，如果你把父函数当作对象（object）使用，把闭包当作它的公用方法（Public Method），把内部变量当作它的私有属性（private value），这时一定要小心，不要随便改变父函数内部变量的值；
(3)由于闭包涉及跨域访问，所以会导致性能损失，我们可以通过把跨作用域变量存储在局部变量中，然后直接访问局部变量，来减轻对执行速度的影响

闭包的工作原理
        因为闭包只有在被调用时才执行操作，所以它可以被用来定义控制结构。多个函数可以使用同一个环境，这使得他们可以通过改变那个环境相互交流。

使用场景
（1）采用函数引用方式的setTimeout调用。
（2）将函数关联到对象的实例方法。
（3）封装相关的功能集。

#### 1.4 继承的几种方式

##### 1.4.1 原型链继承

原型链继承是指将父类实例作为子类的原型。这种方式下，子类实例可以共享父类实例的属性和方法，但是无法向父类构造函数传递参数。
```javascript
 function Parent() {
	this.name = 'parent';
 }

 Parent.prototype.sayHello = function() {
	console.log('hello from parent');
 }

 function Child() {}

 Child.prototype = new Parent();

 var child = new Child();
 child.sayHello(); // hello from parent
```

##### 1.4.2 借用构造函数继承

借用构造函数继承是指在子类构造函数中调用父类构造函数，并使用 call 或 apply 方法将父类的 this 指向子类实例。这种方式的缺点是无法继承父类原型上的方法。
```javascript
 function Parent(name) {
 	this.name = name;
 }

 Parent.prototype.say = function() {
	 console.log('父亲说：你要听话。')
 }

 function Child(name, age) {
 	Parent.call(this, name);
 	this.age = age;
 }

 const child = new Child('小红', 18);
 console.log(child.name); // 小红
 console.log(child.age); // 18
 child.say() // 报错 child.say is not a function
```

##### 1.4.3 组合继承

组合继承是指将原型链继承和借用构造函数继承结合起来。这种方式可以继承父类实例和原型上的属性和方法，但是会调用两次父类构造函数，且父类原型上的属性和方法会被继承两次。
```javascript
 function Parent(name) {
	 this.name = name;
 }

 Parent.prototype.sayHello = function() {
	 console.log('hello from parent');
 }

 function Child(name, age) {
	 Parent.call(this, name);
	 this.age = age;
 }

 Child.prototype = new Parent();
 Child.prototype.constructor = Child;

 const child = new Child('小红', 18);
 console.log(child.name); // child
 console.log(child.age); // 18
 child.sayHello(); // hello from parent
```

##### 1.4.4 原型式继承-实例继承

原型式继承是指创建一个空对象，并将父类实例作为该空对象的原型。这种方式的缺点与原型链继承相同。无法向父类构造函数传递参数。
```javascript
 function createObject(obj) {
	 function F() {}
	 F.prototype = obj;
	 return new F();
 }

 const parent = {
 	 name: 'parent',
 	 sayHello: function() {
     	 console.log('hello from parent');
     }
 };

 const child = createObject(parent);
 console.log(child.name); // parent
 child.sayHello(); // hello from parent
```

##### 1.4.5 寄生式继承

寄生式继承是指创建一个新对象，并在该对象上增加一些父类的属性和方法，然后返回该对象。这种方式的缺点与原型式继承相同。

```javascript
 function createObject(obj) {
	 const o = Object.create(obj);
	 o.sayHello = function() {
	 	 console.log('hello from child');
	 };
	 return o;
 }

 const parent = {
	 name: 'parent'
 }

 const child = createObject(parent);
 console.log(child.name); // parent
 child.sayHello(); // hello from child
```

##### 1.4.6 寄生组合式继承

寄生组合式继承是指使用“借用构造函数”继承父类实例的属性和方法，并将子类原型指向一个父类实例的副本。这种方式可以避免调用两次父类构造函数，且不会继承父类原型上的属性和方法。
```javascript
 function Parent(name) {
 	 this.name = name;
 }

 Parent.prototype.sayHello = function() {
	 console.log('hello from parent');
 };

 function Child(name, age) {
	 Parent.call(this, name);
	 this.age = age;
 }

 Child.prototype = Object.create(Parent.prototype);
 Child.prototype.constructor = Child;

 const child = new Child('小红', 18);
 console.log(child.name); // 小红
 console.log(child.age); // 18
 child.sayHello(); // hello from parent
```

##### 1.4.7 es6继承extends

ES6 中，可以使用 class 和 extends 关键字来实现继承。即定一个父类（也称为基类）和一个子类（也称为派生类），并通过 extends 关键字让子类继承父类的属性和方法。
```javascript
 class Parent {
	 constructor(name) {
		 this.name = name;
     }
     sleep() {
		 console.log(`${this.name} 在睡觉`);
	 }
 }

 class Child extends Parent {
	 constructor(name) {
 		 super(name);
     }
     
     // 子类定义了一个新方法
     play() {
     		console.log('玩耍');
     }

     // 子类重写父类的 sleep 方法
     sleep() {
          super.sleep();
          console.log('睡觉');
	 }
 } 

 const child = new Child('小红');
 console.log(child.name); // 小红
 child.play(); // 玩耍
 child.sleep(); //  依次输出 “小红在睡觉” 和 “睡觉”
```

**需要注意的是：子类中的构造函数必须调用 super 方法，以便初始化父类的属性。同时，父类中定义在构造函数中的属性和方法，并不会被自动继承到子类中，需要通过 super 关键字来获取这些属性和方法。**

#### 1.5 深拷贝和浅拷贝

基本数据类型 的数据赋值后，更改赋值后的变量，两者互不影响；
```javascript
let a = 100;
let b = a;
a = 200;

console.log(a); // 200
console.log(b); // 100
```

引用数据类型 的数据赋值后，将存放在栈内存中的地址赋值给接收的变量，更改赋值后的变量，会影响到原来的数据
```javascript
// 复杂数据类型：Array、Object
let obj1 = {
    name:"小李",
    age:18
	}

let obj2 = obj1
obj1.age = 25;

console.log( obj1 ); 	// {name:"小李", age:25}
console.log( obj2 ); 	// {name:"小李", age:25}
```

##### 1.5.1 浅拷贝

**定义：**
创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。
如果属性是**基本类型**，拷贝的就是基本类型的值。
如果属性是**引用类型**，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。

**缺陷：** 浅拷贝只能实现一层的拷贝，无法进行深层次的拷贝

实现方法

1.Object.assign()

ES6中拷贝对象的方法，接受的第一个参数是拷贝的目标，剩下的参数是拷贝的源对象（可以是多个）

**语法：**`Object.assign(target, ...sources)`
注意：第一个target需要传空实体{}

2.concat()

**语法：**`concat()` 合并两个或多个数组，返回一个新数组。原数组不变

3.扩展运算符

如果对象中的属性都是基本数据类型的话,使用扩展运算符更加方便
```javascript
let obj1 = {
	name: "小李",
	age: 18
}
let obj2 = {...obj1}

obj1.name = '小张';
obj1.age = '25';
console.log(obj1, obj2);


let arr = [1, 2, 3]
let newArr = [...arr]
arr[0] = 999
console.log(arr, newArr)
```

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/20210313094522678.png)

##### 1.5.2 深拷贝

不管原数据中值是什么类型的数据，拷贝后的新数据跟原数据是相互独立，没有关联的

###### 1.5.2.1 利用json数据和json字符串之间的转换
JSON.stringify() 将对象转换成JSON字符串
JSON.parse() 反序列化将JSON字符串变成一个新的对象
对于日常的开发需求(对象和数组)，使用这种方法是最简单和快捷的
缺点： 无法实现对对象中 方法 的拷贝，会显示为undefined

###### 1.5.2.2 $.extend()
**直通车:** https://www.jquery123.com/jQuery.extend/.
语法： `jQuery.extend([deep], target, object1, [objectN])
deep默认为false

```javascript
// 注意要引入jQuery的CDN才能使用该方法
let obj1 = {
	name: "小李",
	age: 18,
	father: {
		age: 40
	},
	fn: function () {
		return 123
	}
}

let obj2 = $.extend(true, {}, obj1)

obj1.father.age = 50;

console.log(obj1,obj2);
```

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/20210312170933195.png)

###### 1.5.2.3 递归

```javascript
function deepClone(obj) {
	// 定义一个对象，用来确定当前的参数是数组还是对象
	let objClone = Array.isArray(obj) ? [] : {};
	// 判断obj是否存在，且类型是对象。（typeof [] 也是 object）
	if (obj && typeof obj === "object") {
		// 遍历参数的键
		for (key in obj) {
			// hasOwnProperty() 方法不会检测对象的原型链，只会检测当前对象本身存在该属性时才返回 true，常与for...in使用
			// 判断对象是否存在该属性
			if (obj.hasOwnProperty(key)) {
				// 值是对象就递归
				if (obj[key] && typeof obj[key] === "object") {
					objClone[key] = deepClone(obj[key]);
				} else {
					// 基本数据类型  直接赋值
					objClone[key] = obj[key];
				}
			}
		}
	}
	return objClone;
}
let a = {
	name: "小李",
	age: 18,
	father: {
		name: "大李",
	},
	fn: function () {
		return 123
	}
}
let b = deepClone(a)
a.father.name = "小李他爸"

console.log(a, b);
```

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/20210312171143574.png)

#### 1.6 数组的常用方法

##### 1.6.1 数组的增删

1.unshift()在数组前添加新加元素，返回值是数组的长度， 原数组改变：

```javascript
var arr = [1, 2]
var len = arr.unshift(0)
console.log(len) // 3
console.log(arr)  // [0, 1, 2]
```

2.shift() 删除数组第一个元素，返回值是删除的元素， 原数组改变：

```javascript
var arr = [1,2,3]
var del_item = a.shift()
console.log(del_item ) // 1
console.log(arr) // [2,3]
```

3.push()在数组后添加新加元素，返回值是数组的长度， 原数组改变：

```javascript
var arr = [1, 2]
var len = arr.push(3)
console.log(len) // 3
console.log(arr)  // [1, 2, 3]
```

4.pop() 删除数组最后一个元素，返回值是删除的元素， 原数组改变：

```javascript
var arr = [1, 2, 3]
var del_item = arr.pop()
console.log(del_item) // 3 
console.log(arr) // [1, 2]
```

##### 1.6.2 数组的查找

1.indexOf() 不会改变原数组，返回找到的下标，否则返回-1
indexOf(参数一，参数二) 参数一：查找的元素   参数二： 从哪个下标开始查找

```javascript
var a = [1,2,4,3,4,5]
console.log(a.indexOf(4))  // 2
```

2.lastIndexOf() 不会改变原数组，返回某个子字符串在字符串中最后出现的位置，否则返回-1
lastIndexOf(参数一，参数二) 参数一：查找的元素   参数二： 从哪个下标开始查找

```javascript
var a = [1,2,4,3,4,5]
console.log(a.lastIndexOf(4,3)) // 4
```

##### 1.6.3 合并数组

concat() 拼接方法用来合并两个或多个数组合并两个或多个数组，返回新数组，不会改变原数组

##### 1.6.4 slice()数组切片

slice() 切片 slice(startIndex,endIndex) 返回从startIndex开始(包括)，到endIndex(不包括)之间的原属组成的数组返回新数组，不改变原数组
```javascript
var a = [1,2,3]
var b = a.slice(0, 1)  
var c = a.slice()
 
console.log(b) // [1]
console.log(c) // [1,2,3]
 
// 负数表示从后往前数
var d = a.slice(-1,-2)   
console.log(d) // []   从左向右截取，所以说为[]
 
var e = a.slice(-1)  
console.log(e)  // [3]
```

##### 1.6.5 splice()方法实现增删

splice(开始位置， 删除的个数，元素)万能方法，可以实现增删改：改变数组本身
```javascript
let arr = [1, 2, 3, 4, 5];
let arr1 = arr.splice(2, 0, 'haha')
console.log(arr1)//[1, 2, 'haha', 3, 4, 5]新增一个元素
let arr2 = arr.splice(2, 3)
console.log(arr2)//[1, 2] 删除三个元素
let arr3 = arr.splice(2, 1, 'haha')
console.log(arr3)//[1, 2, 'haha', 4, 5] 替换一个元素
```

##### 1.6.6 数组转字符串

1.toString()此方法将数组转化为字符串

```javascript
let arr = [1, 2, 3, 4, 5];
let str = arr.toString()  //1,2,3,4,5
```

2.join() 方法用来将数组转换为字符串，不改变原数组，返回转换后的字符串

```javascript
var a = [1,2,3,4,5]
console.log(a.join(','))  // 1,2,3,4,5
console.log(a)  // [1,2,3,4,5]
```

##### 1.6.7 数组的逆置

reverse() 方法用于颠倒数组中元素的顺序。返回的是颠倒后的数组，会改变原数组。
```javascript
var a  = [1,3,2,7,6]
console.log(a.reverse())  // [6,7,2,3,1]
console.log(a)  // [6,7,2,3,1]
```

##### 1.6.8 数组过滤

filter() 方法返回数组中满足条件的元素组成的新数组，原数组不变
```javascript
filter()的参数是一个方法
var a = [1,2,3,4,11]
// 第一个参数为一个方法，有三个参数，it:当前值 index:当前值下标 array:这个数组对象
var b = a.filter(function(it, index, array){
    return it < 10
})
 
console.log(b) // [1,2,3,4]
console.log(a) // [1,2,3,4,11]
```

##### 1.6.9 格式化数组

map() 方法来根据需求格式化原数组，返回格式化后的数组。原数组不变
```javascript
var a = [1,2,3,4,5]
// 参数同filter方法
var b = a.map(function(it,index,array){
    return it + 1
})
 
console.log(b) // [2,3,4,5,6]
console.log(a) // [1,2,3,4,5]
```

##### 1.6.10 判断数组元素

1.every() 对数组的每一项进行判断，全部为True, 则为True, 反之有一项为false 则为false

```javascript
var a = [1,2,3,4,5]
 
var b = a.every(function(it, index, array){
       return it < 6
})
 
var c = a.every(function(it, index, array){
       return it < 3
})
console.log(b)  // true 
console.log(c)  // false 
```

2.some()对数组的每一项都进行判断，有一项为true, 则返回为true

```javascript
var a = [1,2,3,4,5]
 
var b = a.some(function(it, index, array){
       return it > 4
})
 
var c = a.some(function(it, index, array){
       return it > 5
})
console.log(b)  // true 
console.log(c)  // false 
```

##### 1.6.11 数组遍历

forEach() 数组遍历 遍历整个数组，中途不能中断
```javascript
var arr = ['a','b','c']
var copy = []
arr.forEach(function(it){
     copy.push(it)   
})
console.log(copy)
```

##### 1.6.12 isArray()方法 用来判断一个元素是否为数组

```javascript
Array.isArray([])  // true
Array.isArray({})  // false
```

##### 1.6.13 slice和splice区别

***语法***
array.slice(startingIndex, endingIndex)
array.splice(startingIndex, length, ...items)

1.slice两个参数，splice三个参数；
2.第一个参数彼此相同，表示删除元素的起始索引，但第二个参数不同。slice和 splice的第二个参数分别是结束索引和子项数；
3.splice更改原始数组，而slice不更改。

***实现浅拷贝***
const clone = (arr) => arr.slice(0)

#### 1.7 Promise：all、race、allSettled 的理解和使用场景

##### 1.7.1 Pomise.all 的使用

​		Promise.all 可以将多个Promise实例包装成一个新的Promise实例。同时，成功和失败的返回值是不同的，成功的时候返回的是一个**结果数组**，而失败的时候则返回**最先被 reject 失败状态的值**。代码示例如下：
```javascript
let p1 = new Promise((resolve, reject) => {
  resolve('成功了')
})
let p2 = new Promise((resolve, reject) => {
  resolve('success')
})
let p3 = Promse.reject('失败')

Promise.all([p1, p2]).then((result) => {
  console.log(result)               //['成功了', 'success']
}).catch((error) => {
  console.log(error)
})

Promise.all([p1,p3,p2]).then((result) => {
  console.log(result)
}).catch((error) => {
  console.log(error)      // 失败了，打出 '失败'
})
```

​        Promse.all 在处理多个异步处理时非常有用，比如说一个页面上需要等两个或多个ajax的数据回来以后才正常显示，在此之前只显示loading图标。
　　需要特别注意的是，Promise.all 获得的成功结果的数组里面的数据顺序和Promise.all接收到的数组顺序是一致的，即p1的结果在前，即便p1的结果获取的比p2要晚。这带来了一个绝大的好处：在前端开发请求数据的过程中，偶尔会遇到发送多个请求并根据请求顺序获取和使用数据的场景，使用Promise.all毫无疑问可以解决这个问题。

##### 1.7.2 Promise.race 的使用

​		我们先看 MDN 的定义：Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝。
```javascript
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2]).then((value) => {
  console.log(value);
  // Both resolve, but promise2 is faster
});
// expected output: "two"
```

​		Both resolve, but promise2 is faster ，从这里可以看出端倪。顾名思义，Promse.race 就是赛跑的意思，意思就是说，Promise.race([p1, p2, p3])里面哪个结果获得的快，就返回那个结果，不管结果本身是成功状态还是失败状态。
　　我们看一下使用 Promise.race –  setTimeout 的示例

```javascript
var p1 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 500, "one");
});
var p2 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, "two");
});
Promise.race([p1, p2]).then(function(value) {  // 成功回调
  console.log(value); // "two"
  // 两个都完成，但 p2 更快
});

var p3 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, "three");
});
var p4 = new Promise(function(resolve, reject) {
    setTimeout(reject, 500, "four");
});
Promise.race([p3, p4]).then(function(value) {  // 成功回调
  console.log(value); // "three"
  // p3 更快，所以它完成了
}, function(reason) {   // 失败回调未被调用
  // 未被调用
});

var p5 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 500, "five");
});
var p6 = new Promise(function(resolve, reject) {
    setTimeout(reject, 100, "six");
});
Promise.race([p5, p6]).then(function(value) {   // 成功回调未被调用
  // 未被调用
}, function(reason) {   // 失败回调
  console.log(reason); // "six"
  // p6 更快，所以它失败了
});
```

​		race 服务比较重要，比如多台服务，想要稳定返回，并且还要快，让他们去竞赛，谁快就用谁。race 的使用场景就是，多台服务器部署了同样的服务端代码，假如我要获取一个商品列表接口，我可以在 race 中写上所有服务器中的查询商品列表的接口地址，哪个服务器响应快，就从哪个服务器拿数据。

##### 1.7.3 Promise.allSettled 的使用

　	MDN 介绍：Promise.allSettled()方法返回一个在所有给定的promise都已经fulfilled或rejected后的promise，并带有一个对象数组，每个对象表示对应的promise结果。
		当您有多个彼此不依赖的异步任务成功完成时，或者您总是想知道每个promise的结果时，通常使用它。
		相比之下，Promise.all() 更适合彼此相互依赖或者在其中任何一个reject时立即结束。
		看完似乎懂了，但还是有点晦涩的。看示例：

```javascript
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
const promises = [promise1, promise2];

Promise.allSettled(promises).
  then((results) => results.forEach((result) => console.log(result.status)));
// expected output:
// "fulfilled"
// "rejected"
```

​		语法：*Promise*.allSettled(*iterable*);
​		参数：`iterable - `一个可迭代的对象，例如`Array`，其中每个成员都是`Promise`。
​		**返回值**：一旦所指定的 promises 集合中每一个 promise 已经完成，无论是成功的达成或被拒绝，未决议的 `Promise`将被异步完成。那时，所返回的 promise 的处理器将传入一个数组作为输入，该数组包含原始 promises 集中每个 promise 的结果。
​		**对于每个结果对象，都有一个 `status` 字符串。如果它的值为 `fulfilled`，则结果对象上存在一个 `value` 。如果值为 `rejected`，则存在一个 `reason` 。value（或 reason ）反映了每个 promise 决议（或拒绝）的值**。
​		看到这里了解了：它与 Promise.all 比较类似，差别在于对于失败的处理情况不同。Promise.all 是只要有 1 个失败，那么就 reject；而 Promise.allSettled 是不管 Promise List 里的是失败还是成功，都会返回数组，数组里面反映每个 Promise 的信息。
​		下面我们再看一下其产生背景和应用：
​		ES6引入的Promise极大地提升了我们在写 js 应用的编码体验，我们可以很方便得使用Promise进行异步流程控制，但是有一种情况处理起来其实很是不方便, 这就是Promise.allSettled提案的存在理由。
​		举例说明：比如我们用户在页面上面同时填了3干个独立的表单，这三个表单分三个接口提交到后端，三个接口独立，没有顺序依赖，这个时候我们需要等到请求全部完成后给与用户提示表单提交的情况。
​		分析：在多个promise 同时进行时，我们很快会想到使用 Promise.all 来进行包装，但是由于 Promise.all 的短路特性，三个提交中若前面任意一个提交失败，则后面的表单也不会进行提交了，这就与我们需求不符合。
​		**Promise.allSettled 跟 Promise.all 类似，其参数接受一个 Promise 的数组，返回一个新的 Promise，唯一的不同在于：其不会进行短路，也就是说当 Promise 全部处理完成后，我们可以拿到每个 Promise 的状态，而不管其是否处理成功。**

```javascript
const promises = [ fetch('index.html'), fetch('https://does-not-exist/') ];
const results = await Promise.allSettled(promises);
const successfulPromises = results.filter(p => p.status === 'fulfilled');
const errors = results
  .filter(p => p.status === 'rejected')
  .map(p => p.reason).join(',');
if(errors){
  // 如果存在错误
  message.error(errors);
}
```

#### 1.8 微任务和宏任务

​		宏任务和微任务是在事件循环中执行的两种不同类型的任务。
​		宏任务是相对较大的任务，通常包括定时器任务（setTimeout、setInterval）、网络请求、用户交互事件（点击、滚动等）。宏任务会被添加到事件队列中，在每个事件循环中执行一次。
​		微任务是相对较小的任务，通常包括Promise回调、DOM变动观察器。微任务会在当前宏任务执行完毕后立即执行，而不会添加到事件队列中。微任务的执行时机是在当前宏任务的末尾，在下一个宏任务之前。
​		因此，微任务比宏任务具有更高的优先级，可以在用户交互之前或渲染之前得到及时处理，可以用于执行一些需要优先处理的任务，如更新DOM、处理异步操作的结果等。
​		总结起来，宏任务是事件循环中的较大任务，微任务是较小的任务，他们的执行顺序不同，微任务比宏任务的优先级更高。

***宏任务有哪些***

宏任务包括但不限于以下几种常见的任务：
1、定时器任务： 如setTimeout、setInterval
2、I/O任务：例如网络请求、文件读写等需要进行I/O操作的任务
3、用户交互任务：例如点击事件、输入事件等与用户交互的相关任务
4、渲染任务：当浏览器需要重绘或重新布局时触发的任务
5、请求动画帧任务：通过requestAnimationFrame()方法设置的任务，用于在每一帧进行绘画或动画操作
这些任务都是比较耗时的操作，在事件循环中被视为宏任务，需要等待一定时间或特定的触发条件才会执行

***微任务有哪些***

1、Promise回调：Promise对象的resolve或reject方法的回调函数
2、MutationObserver回调：当DOM发生变化时触发的回调函数
3、Promise的then()回调：Promise对象的then()方法中的回调函数
4、async/await函数中的后续操作：在async函数中使用await等待的操作完成后，紧接着的代码块中的任务
这些任务通常是较小且轻量级的操作，执行时间较短，适合在当前宏任务执行完毕后立即执行。由于微任务的执行时机在每个宏任务执行的过程中，因此可以保证在用户交互之前或渲染之前得到及时处理

```javascript
const test = new Promise((resolve, reject) => {
  console.log('new Promise')
  resolve('success')
})
test.then((val) => {
  console.log(val)
})
console.log('finish')
// 输出顺序为：
// new Promise
// finish
// success
```

```javascript
const test = new Promise((resolve, reject) => {
  console.log(1)
  console.log(2)
})
test.then(() => {
  console.log(3)
})
console.log(4)
// 输出结果为
// 1
// 2
// 4
// 3不会输出，因为promise.then是微任务，会在所有的宏任务执行完成后才会执行，同时需要promise内部的状态发生变化，因为这里内部没有发生变化，所以不输出3
```

```javascript
const promise1 = new Promise((resolve, reject) => {
  console.log('promise1')
  resolve('resolvel')
})
const promise2 = promise1.then(res => {
  console.log(res)
})
console.log('1', promise1)
console.log('2', promise2)
// 输出结果为
// 1、promise1
// 将promise1.then放入微任务
// 2、'1' Promise {'resolve'}，这里打印的是状态
// 2、'2' Promise {'pending'}，这里打印的是状态
// 3、resolve
```

```javascript
const promise = new Promise((resolve, reject) => {
  console.log(1)
  setTimeout(() => {
    console.log('timerStart')
    resolve('success')
    console.log('timerEnd')
  }, 0)
  console.log(2)
})
promise.then((res) => {
  console.log(res)
})
console.log(4)
// 1
// 2
// 4
// 开始
// 结束
// 成功
```

```javascript
console.log('start')
const fn = () => {
  return new Promise((resolve, reject) => {
    console.log(1)
    resolve(2)
  })
}
console.log(3)
fn().then(res => {
  console.log(res)
})
console.log('end')
// start
// 3
// 1
// end
// 2
```

#### 1.9 js判断数据类型的几种方法

##### 1.9.1 typeof

-   只能识别基础类型和引用类型

注意：`null`、 `NaN`、 `document.all` 的判断

```javascript
console.log(typeof 123); // "number"
console.log(typeof "hello"); // "string"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof null); // "object"
console.log(typeof {}); // "object"
console.log(typeof []); // "object"
console.log(typeof function(){}); // "function"
console.log(typeof null); // "object"
console.log(typeof NaN); // "number"
console.log(typeof document.all); // "undefined"
```

##### 1.9.2 constructor

-   `constructor` 指向创建该实例对象的构造函数

注意 `null` 和 `undefined` 没有 `constructor`，以及 `constructor` 可以被改写，不太可靠

```javascript
const arr = [1, 2, 3];
console.log(arr.constructor === Array) // true

const obj = {name: "云牧", age: 18};
console.log(obj.constructor === Object) // true


String.prototype.constructor = function fn() {
  return {};
}

// constructor 可以被改写
console.log("云牧".constructor) // [Function: fn]
```

##### 1.9.3 instanceof

-   语法：`obj instanceof Type`
-   功能：判断 `obj` 是不是 `Type` 类的实例，只可用来判断引用数据
-   实现思路： `Type` 的原型对象是否是 `obj` 的原型链上的某个对象
-   注意：右操作数必须是函数或者 class

```javascript
const arr = [1, 2, 3]
console.log(arr instanceof Array) // true
console.log(arr instanceof Object) // true

const obj = { name: "云牧", age: 18 }
console.log(obj instanceof Object) // true
console.log(obj instanceof Array) // false
```

手写instanceof

```javascript
function myInstanceof(Fn, obj) {
  // 获取该函数显示原型
  const prototype = Fn.prototype;
  // 获取obj的隐式原型
  let proto = obj.__proto__;
  // 遍历原型链
  while (proto) {
    // 检测原型是否相等
    if (proto === prototype) {
      return true;
    }
    // 如果不等于则继续往深处查找
    proto = proto.__proto__;
  }
  return false;
}
```

##### 1.9.4 isxxx

-   isPrototypeof

-   -   用于判断一个对象是否为另一个对象的原型
    -   `prototypeObj.isPrototypeOf(object)`，如果 prototypeObj 是 object 的原型对象，isPrototypeOf 方法返回 true，否则返回 false
    -   功能基本等同于 `instanceof`
    -   注意：isPrototypeOf 方法只能用于判断对象类型，不能用于判断基本数据类型。如果 prototypeObj 不是一个对象，isPrototypeOf 方法会抛出 TypeError 异常

-   getPrototypeOf 返回一个对象的原型，只能用于判断对象类型

```javascript
const obj = { name: "云牧", age: 18 }
const arr = [1, 2, 3]

const proto1 = Object.getPrototypeOf(obj)
console.log(proto1.isPrototypeOf(obj)) // true

const proto2 = Object.getPrototypeOf(arr)
console.log(proto2.isPrototypeOf(arr)) // true

console.log(Object.isPrototypeOf({})) // false
console.log(Object.prototype.isPrototypeOf({})) // true  期望左操作数是一个原型，{} 原型链能找到 Object.prototype

console.log(Object.getPrototypeOf(obj) === Object.prototype) // true
console.log(Object.getPrototypeOf(arr) === Array.prototype) // true
```

-   Array.isArray 方法可以判断一个对象是否为数组
-   Number.isNaN 可以判断一个值是否为 NaN
-   Number.isFinite 可以判断一个值是否为有限数

```javascript
console.log(Array.isArray([1, 2, 3])); // true
console.log(Array.isArray({})); // false
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN(123)); // false
console.log(Number.isNaN("hello")); // false
console.log(Number.isFinite(123)); // true
console.log(Number.isFinite("hello")); // false
console.log(Number.isFinite(Infinity)); // false
```

##### 1.9.5 Object.prototype.toString

-   利用函数动态 this 的特性

```javascript
Object.prototype.toString.call(123); // "[object Number]"
Object.prototype.toString.call("hello"); // "[object String]"
Object.prototype.toString.call(true); // "[object Boolean]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call({}); // "[object Object]"
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call(function(){}); // "[object Function]"
// 注意的是，Object.prototype.toString.call 方法返回的字符串格式为 "[object 类型]"

// 封装
function typeOf(data) {
  return Object.prototype.toString.call(data).slice(8, -1);
}

// 测试
console.log(typeOf(1)); // Number
console.log(typeOf("1")); // String
console.log(typeOf(true)); // Boolean
console.log(typeOf(null)); // Null
console.log(typeOf(undefined)); // Undefined
console.log(typeOf(Symbol(1))); // Symbol
console.log(typeOf({})); // Object
console.log(typeOf([])); // Array
console.log(typeOf(function () {})); // Function
console.log(typeOf(new Date())); // Date
console.log(typeOf(new RegExp())); // RegExp
```

##### 1.9.6 鸭子类型检测

-   检查自身属性的类型或者执行结果的类型
-   通常作为候选方案
-   例子：`kindof` 与 `p-is-promise`

p-is-promise：
```javascript
const isObject = value =>
  value !== null && (typeof value === "object" || typeof value === "function");

export default function isPromise(value) {
  return (
    value instanceof Promise ||
    (isObject(value) && typeof value.then === "function" && typeof value.catch === "function")
  );
}
```

kindof：
```javascript
function kindof(obj) {
  var type;
  if (obj === undefined) return "undefined";
  if (obj === null) return "null";

  switch ((type = typeof obj)) {
    case "object":
      switch (Object.prototype.toString.call(obj)) {
        case "[object RegExp]":
          return "regexp";
        case "[object Date]":
          return "date";
        case "[object Array]":
          return "array";
      }

    default:
      return type;
  }
}
```

##### 1.9.7 Symbol.toStringTag

-   原理：`Object.prototype.toString` 会读取该值
-   适用场景：需自定义类型
-   注意事项：兼容性

```javascript
class MyArray {
  get [Symbol.toStringTag]() {
    return "MyArray";
  }
}

const arr = new MyArray();
console.log(Object.prototype.toString.call(arr)); // [object MyArray]
```

##### 1.9.8 等比较

-   原理：与某个固定值进行比较
-   适用场景：`undefined`、 `window`、 `document`、 `null` 等

`underscore.js（工具函数库）`：

```javascript
_.isNull = function(obj) {
  return obj === null;
};

_.isUndefined = function(obj) {
  return obj === void 0;
};

_.isBoolean = function(obj) {
  return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
};

_.isString = function(obj) {
  return toString.call(obj) === '[object String]';
};

_.isNumber = function(obj) {
  return toString.call(obj) === '[object Number]';
};

_.isArray = nativeIsArray || function(obj) {
  return toString.call(obj) === '[object Array]';
};

_.isObject = function(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};

_.isFunction = function(obj) {
  return typeof obj === 'function' || false;
};
```

`void 0` 始终返回 `undefined`，`void` 后面接任意值都是返回 `undefined`， 这是为了兼容 `IE`，因为在 `IE` 中 `undefined` 值可以被改写

##### 1.9.9总结

| 方法                | 基础数据类型 | 引用类型 | 注意事项                      |
| ------------------- | ------------ | -------- | ----------------------------- |
| typeof              | √            | ×        | NaN、object、document.all     |
| constructor         | √ 部分       | √        | 可以被改写                    |
| instanceof          | ×            | √        | 多窗口，右边构造函数或者class |
| isPrototypeof       | ×            | √        | 小心 null 和 undefined        |
| toString            | √            | √        | 小心内置原型                  |
| 鸭子类型            | -            | √        | 不得已兼容                    |
| Symbol.toString Tag | ×            | √        | 识别自定义对象                |
| 等比较              | √            | √        | 特殊对象                      |

##### 1.9.10 ES6 增强的 NaN

NaN 和 Number.NaN 特点

1.  `typeof` 判断类型是数字
2.  自己不等于自己

isNaN

-   如果非数字，隐式转换传入结果如果是 `NaN`，就返回 `true`，反之返回 `false`

```javascript
console.log(isNaN(NaN)) // true
console.log(isNaN({})) // true
```

Number.isNaN

-   判断一个值是否是数字，并且值是否等于 `NaN`

```javascript
console.log(Number.isNaN(NaN)) // true
console.log(Number.isNaN({})) // false
```

综合垫片（如果不支持 `Number.isNaN` 的话）

```javascript
if (!("isNaN" in Number)) {
  Number.isNaN = function (val) {
    return typeof val === "number" && isNaN(val)
  };
}
```

indexOf 和 includes

-   `indexOf` 不可查找 `NaN`，`includes` 则可以

```javascript
const arr = [NaN]

console.log(arr.indexOf(NaN)) // -1
console.log(arr.includes(NaN)) // true
```

#### 1.10 es6新特性

1、let 和 const
let 表示申明变量。const 表示申明常量
常量定义了就不能改了。对象除外，因为对象指向的地址没变。
const在申明是必须被赋值。
两者都为块级作用域。

2、模板字符串

3、解构
解构赋值是对赋值运算符的扩展。它是一种针对数组或者对象进行模式匹配，然后对其中的变量进行赋值。

```javascript
let [a,b,c] = [1,2,3];
console.log(a,b,c);    //1,2,3
 
let [a,b,c] = [1,,3];
console.log(a,b,c);    //1,undefined,3
 
let [a,,b] = [1,2,3];
console.log(a,b);//1,3
 
let [a,..b] = [1,2,3];    //...是剩余运算符，表示赋值运算符右边除第一个值外剩余的都赋值给b
console.log(a,b);//1,[2,3]

// 事实上所有可枚举（iterable）的对象都可以使用解构赋值，例如数组，字符串对象，以及ES6新增的Map和Set类型。
let arr = 'hello';
let [a,b,c,d,e] = arr;
console.log(a,b,c,d,e);  //'h','e','l','l','o'
　　对象的解构赋值和数组类似，不过左边的变量名需要使用对象的属性名，并且用大括号{}而非中括号[]：

let obj = {name:'ren',age:12,sex:'male'};
let {name,age,sex} = obj;
console.log(name,age,sex);  //'ren' 12 'male'
let {name:myName,age:myAge,sex:mySex} = obj;  //自定义变量名
console.log(myName,myAge,mySex);  //'ren' 12 'male'
```

4、函数的默认值

```java
function add(a=1,b=2){
    return a + b;
}
add();//3
add(2);//4
add(3,4);//7

// 和参数默认值一起，ES6还带来了不定参。它的功能和使用arguments差不多
function add(...num){
    return num.reduce(function(result,value){
        return result + value;
    });
}
add(1,2,3,4);//10
```

5、Spread / Rest 操作符，三个点…

6、箭头函数
参数 => 函数体

7、for of
for of遍历的是键值对中的值
for in遍历的是键值对中的键

8、class类，原型链的语法糖表现形式

9、导入导出
导入improt
导出export default

10、promise和Generator
Promise 用于更优雅地处理异步请求。

11、async/await
比promise更好的解决了回调地狱

12、Symbol，新的基本类型
创建symbol数据类型的值时，需要给Symbol函数传递一个字符串，并且有一点特殊的是：不能使用new关键字调用它。另外，每个symbol类型值都是独一无二的，即使传递的是相同的字符串。

13、Set集合，类似map
存储任何类型的唯一值，即集合中所保存的元素是不重复的。类数组结构。
let arrNew = new Set(待去重的数组)

#### 1.11 原型链

#### 1.12 webpack

##### 1.12.1 什么是webpack?

webpack 是前端的一个项目构建工具，它是基于 Node.js 开发出来的一个前端工具；

##### 1.12.2 webpack 可以干什么

-   可以处理 js 之间互相依赖的关系
-   可以处理 js 的兼容问题

##### 1.12.3 安装方式

全局安装：(推荐)
```bash
npm i webpack -g
```

项目根目录安装
```bash
npm i webpack --save-dev
```

##### 1.12.4 简单使用

方法一：**通过命令打包文件（不推荐）**

```bash
webpack 要打包的文件路径 打包输出的文件路径
```

方法二：**通过 `webpack.config.js` 配置文件来打包文件**

因为 webpack 是基于 node 开发的打包工具，所以在 `webpack.config.js` 可以使用 node
```js
let path = require('path');
module.exports = {
    entry: path.join(__dirname,'./src/main.js'),//入口文件
    output: {                                    
        path: path.join(__dirname,'./dist'),    //输出文件的路径
        filename: 'bundle.js'                     //指定输出的文件名
    }
}
```

在 `webpack.config.js` 所在的文件夹中使用[命令行工具](https://cloud.tencent.com/product/cli?from_column=20065&from=20065)，输入 `webpack` 就可以实现打包了

##### 1.12.5 webpack 如何运行？

1.  首先，webpack 发现，我们并没有通过命令的形式，给它指定入口和出口
2.  webpack 就会去项目的根目录中，查找一个叫做 `webpack.config.js` 的配置文件
3.  找到配置文件后，webpack 就会解析执行这个配置文件，当解析执行完配置文件后，就得到了配置文件中，导出的配置对象
4.  当 webpack 拿到配置对象后，就拿到了配置对象中，指定的入口和出口，然后进行打包构建
5.  如果 webpack 发现既没有 webpack 命令 ，也没有配置文件，他就会报错

##### 1.12.6 使用 webpack-dev-server 自动打包

##### 1.12.7 安装 webpack-dev-server

```bash
npm i webpack-dev-server -D
```

###### 1.12.7.1 使用 webpack-dev-server

webpack-dev-server 使用方法和 webpack 一样

但是如果在项目中安装 webpack-dev-server，是无法把它当做脚本命令；想在 powershell 终端中直接运行，必须安装到全局 `-g` 的工具，才能在终端中正常执行.

###### 1.12.7.2 在本地如何运行 webpack-dev-server 呢？

在 `package.json` 配置你脚本命令

```js
{
  "name": "learn",
  "version": "1.0.0",
  "description": "",
  "main": "webpack.config.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server" // 配置一个名为 dev 的脚本指令
  },    
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {},
  "devDependencies": {
    "jquery": "^3.2.1",
    "webpack": "^3.8.1",
    "webpack-dev-server": "^2.9.3"
  }
}
```

我们直接在本地的命令行下输入 `dev` 他就会执行 `webpack-dev-server` ，它其实会开启一个本地的服务器
![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/6ye2rbc2ix.png)

**注意**:

-   `webpack-dev-server` 这个工具是依赖于 webpack 的，要想使用这个工具，就必须安装 webpack
-   `webpack-dev-server` 打包的文件会直接存放在内存中

##### 添加参数

第一种方法：

```js
{
  "name": "learn",
  "version": "1.0.0",
  "description": "",
  "main": "webpack.config.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server --open --port 3000 --contentBase src --hot"    // 添加参数
  },    
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {},
  "devDependencies": {
    "jquery": "^3.2.1",
    "webpack": "^3.8.1",
    "webpack-dev-server": "^2.9.3"
  }
}
```

我们直接在本地的命令行下输入 `dev` 他就会执行 `webpack-dev-server--open--port3000--contentBase src--hot` ，它其实会开启一个本地的服务器

-   `--open` 表示：保存时重新打包，并打开浏览器
-   `--port端口号` 表示：开启本地服务器的访问端口号
-   `--contentBase路径` 表示：指定根路经
-   `--hot` 表示：更新打包文件（不是重新创建打包文件），可以实现网页无刷新直接浏览效果， `热更新`

第二种方法：（比较麻烦）

在 `webpack.config.js` 文件中进行配置

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname,'./src/main.js'),//入口文件
    output: {
        path: path.join(__dirname,'/dist'),
        filename: 'bundle.js' //指定输出的名称
    },
    devServer: {
        open: true,
        port: 3000,
        contentBase: 'src',
        hot: true
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]
}
```

与第一种方式不一样，使用 webpack 的热更新必须还要加上两步

1.  引用 webpack 模块

2.  配置插件
    ```js
    // 在devServer 平级中写入以下东西
       plugins:[
               new webpack.HotModuleReplacementPlugin()
       ]
    ```

    `plugins` ：是专门放 `webpack插件` 的地方

##### 1.12.8 使用 html-webpack-plugin 插件

这是一个webpack插件，可以简化HTML文件的创建，并且可以将你指定的打包的文件自动插入到页面中去

###### 1.12.8.1 安装

```bash
npm i --save-dev html-webpack-plugin
```

###### 1.12.8.2 使用

1.  现在 `webpack.config.js` 导入要使用的插件

2.  配置
    ```js
    const path = require('path');
    const webpack = require('webpack');
    const htmlWebPackPlugin = require('html-webpack-plugin') // 引用你要使用的插件
    module.exports = {
        entry: path.join(__dirname,'./src/main.js'),//入口文件
        output: {
            path: path.join(__dirname,'/dist'),
            filename: 'bundle.js' //指定输出的名称
        },
        devServer: {
            open: true,
            port: 3000,
            contentBase: 'src',
            hot: true
        },
        plugins:[
            new webpack.HotModuleReplacementPlugin(),
            new htmlWebPackPlugin({
                template:path.join(__dirname,'./src/index.html'), // 配置你要在内存中生成的模板文件
                filename:'index.html' // 指定内存中的文件名
            })
        ]
    }
    ```

##### 1.12.9 处理css样式表

`webpack` 默认只会处理 js 文件，所以在处理其他文件时我们需要安装一些第三方的 `loader` 加载器

如果我们想要打包处理 css 文件，我们需要安装 `style-loader` 、 `css-loader` 这两个插件

###### 1.12.9.1 安装

```bash
npm i style-loader css-loader -D
```

###### 1.12.9.2 使用

1.  在 `webpack.config.js` 先导入 `style-loader` 、 `css-loader`

2.  在 `webpack.config.js` 配置文件中新增一个配置节点，叫做 `module` ，它是一个对象，在这个 `module` 对象上，有一个 `rules` 属性，它是一个数组，这个数组中存放了所有第三方文件的匹配和处理规则
    ```js
    const path = require('path');
    const webpack = require('webpack');
    const htmlWebPackPlugin = require('html-webpack-plugin')
    
    console.log(htmlWebPackPlugin);
    module.exports = {
        entry: path.join(__dirname,'./src/main.js'),//入口文件
        output: {
            path: path.join(__dirname,'/dist'),
            filename: 'bundle.js' //指定输出的名称
        },
        plugins:[
            new htmlWebPackPlugin({
                template:path.join(__dirname,'./src/index.html'),
                filename:'index.html'
            })
        ],
        module: {   // 这个节点，用于配置所有第三方模块加载器
            rules:[ // 所有第三方模块 匹配规则
                {
                    test: /\.css$/,     // 匹配以.css文件结尾的文件
                    use: ['style.loader','css-loader'] // 指定要处理的.css文件的加载器
                }
            ]
        }
    }
    ```

`注意:` webpack 处理第三方文件类型的过程

1.  发现这个要处理的文件不是 JS 文件，然后就去配置文件，查找有没有对应的第三方 loader 规则
2.  如果能找到对应的规则，就会调用对应的 loader 处理，这种文件类型
3.  在调用 loader 的使用，是从后往前调用的
4.  当最后一个 loader 调用文件，会把处理的结果，直接交给 webpack 进行打包合并，最终输出到 bundle.js 中去

##### 1.12.10 处理 less 文件

###### 1.12.10.1 安装

```bash
npm i less -D
npm i less-loader -D
```

###### 1.12.10.2 使用

```js
const path = require('path');
const webpack = require('webpack');
const htmlWebPackPlugin = require('html-webpack-plugin')


console.log(htmlWebPackPlugin);
module.exports = {
    entry: path.join(__dirname,'./src/main.js'),//入口文件
    output: {
        path: path.join(__dirname,'/dist'),
        filename: 'bundle.js' //指定输出的名称
    },
    plugins:[
        new htmlWebPackPlugin({
            template:path.join(__dirname,'./src/index.html'),
            filename:'index.html'
        })
    ],
    module: {   // 这个节点，用于配置所有第三方模块加载器
        rules:[ // 所有第三方模块 匹配规则
            {
                test: /\.css$/,     // 匹配以.css文件结尾的文件
                use: ['style-loader','css-loader'] // 指定要处理的.css文件的加载器
            },
            {
                test: /\.less$/,
                use: ['style-loader','css-loader','less-loader']
            }
        ]
    }
}
```

因为 `less` 编译过来其实也是一种 css 样式，所以我们需要向这样使用 `use:['style-loader','css-loader','less-loader']`

##### 1.12.11 处理 scss 文件

###### 1.12.11.1 安装

```bash
npm i sass -D
npm i sass-loader -D
```

###### 1.12.11.2 使用

```js
const path = require('path');
const webpack = require('webpack');
const htmlWebPackPlugin = require('html-webpack-plugin')


console.log(htmlWebPackPlugin);
module.exports = {
    entry: path.join(__dirname,'./src/main.js'),//入口文件
    output: {
        path: path.join(__dirname,'/dist'),
        filename: 'bundle.js' //指定输出的名称
    },
    plugins:[
        new htmlWebPackPlugin({
            template:path.join(__dirname,'./src/index.html'),
            filename:'index.html'
        })
    ],
    module: {   // 这个节点，用于配置所有第三方模块加载器
        rules:[ // 所有第三方模块 匹配规则
            {
                test: /\.css$/,     // 匹配以.css文件结尾的文件
                use: ['style-loader','css-loader'] // 指定要处理的.css文件的加载器
            },
            {
                test: /\.less$/,
                use: ['style-loader','css-loader','less-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader','css-loader','sass-loader']
            }
        ]
    }
}
```

##### 1.12.12 处理 css 文件中的 url 地址

在默认情况下， webpack 是无法处理 css 文件中的 url 地址，不管是图片还是字体库，只要是 url 地址，就处理不了

因此我们需要 `url-loader`、 `file-loader` ，因为 `url-loader` 依赖 `file-loader`

###### 1.12.12.1 安装

```bash
npm i url-loader file-loader -D
```

###### 1.12.12.2 使用

```js
const path = require('path');
const webpack = require('webpack');
const htmlWebPackPlugin = require('html-webpack-plugin')


console.log(htmlWebPackPlugin);
module.exports = {
    entry: path.join(__dirname,'./src/main.js'),//入口文件
    output: {
        path: path.join(__dirname,'/dist'),
        filename: 'bundle.js' //指定输出的名称
    },
    plugins:[
        new htmlWebPackPlugin({
            template:path.join(__dirname,'./src/index.html'),
            filename:'index.html'
        })
    ],
    module: {   // 这个节点，用于配置所有第三方模块加载器
        rules:[ // 所有第三方模块 匹配规则
            {
                test: /\.css$/,     // 匹配以.css文件结尾的文件
                use: ['style-loader','css-loader'] // 指定要处理的.css文件的加载器
            },
            {
                test: /\.less$/,
                use: ['style-loader','css-loader','less-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader','css-loader','sass-loader']
            },
            {
                test: /\.(jpg|png|gif|bmg|jpeg)$/,
                use: 'url-loader'
            }
        ]
    }
}
```

url-loader` 默认会将图片设置为 `base64` 进行传递，如果不想设置为 `base64` 就需要我们将 `use:'url-loader'` 设置为 `use:'url-loader?limit=7631&name=[name].[ext]'

-   在 `url-loader` 设置参数，就像我们浏览器中的url地址一样
-   我们使用 `limit` 进行设置， `limit` 后面的值必须设置成小于图片的大小（单位是：字节 byte），这样图片就会以 url 的形式进行传输，否则图片就会被转为 base64格式的字符串进行传值
-   而后面的 `name` 参数是对客户端浏览器中的文件名进行设置，会将浏览器中图片文件名设置成路径中一样的文件名，因为经过上面的步骤只会将图片的路径设置成hash值

##### 1.12.13 处理字体图片的url路径

在 `webpack.config.js` 中进行设置

```js
const path = require('path');
const webpack = require('webpack');
const htmlWebPackPlugin = require('html-webpack-plugin')


module.exports = {
    entry: path.join(__dirname,'./src/main.js'),//入口文件
    output: {
        path: path.join(__dirname,'/dist'),
        filename: 'bundle.js' //指定输出的名称
    },
    plugins:[
        new htmlWebPackPlugin({
            template:path.join(__dirname,'./src/index.html'),
            filename:'index.html'
        })
    ],
    module: {   // 这个节点，用于配置所有第三方模块加载器
        rules:[ // 所有第三方模块 匹配规则
            {
                test: /\.css$/,     // 匹配以.css文件结尾的文件
                use: ['style-loader','css-loader'] // 指定要处理的.css文件的加载器
            },
            {
                test: /\.less$/,
                use: ['style-loader','css-loader','less-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader','css-loader','sass-loader']
            },
            {
                test: /\.(jpg|png|gif|bmp|jpeg)$/,
                use: 'url-loader'
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)$/,
                use:'url-loader'
            }
        ]
    }
}
```

将网页中要使用到字体图片后缀名 `ttf`、 `eot`、 `svg`、 `woff`、 `woff2` 进行配置

##### 1.12.14 处理 ES6 的高级语法

在 `webpack` 中，默认只能处理一部分 ES6 的语法，一些更高级的 ES6 语法 语法或者 ES7 语法，webpack 是处理不了的；这时候，就需要借助于第三方的 loader ，来帮助 webpack 处理这些高级的语法，而第三方的 loader 把高级语法转为低级语法之后，会把结果交给 webpack 去打包到我们要打包的文件中

而我们通过 Babel，可以帮我们将高级的语法转换为低级的语法

在 `webpack` 中，必须装两套包，才能实现将高级语法转为为低级语法的功能

1.  第一套

-   `babel-core` 、 `babel-loader` 、 `babel-plugin-transform-runtime`

1.  第二套

-   `babel-preset-env` 、 `babel-preset-stage-0`

###### 1.12.14.1 安装

```bash
npm i babel-core babel-loader babel-plugin-transform-runtime -D
npm i babel-preset-env babel-preset-stage-0 -D
```

###### 1.12.14.2 使用

打开 `webpack.config.js` 文件，在其中配置处理 ES6 的高级语法

```js
const path = require('path');
const webpack = require('webpack');
const htmlWebPackPlugin = require('html-webpack-plugin')


module.exports = {
    entry: path.join(__dirname,'./src/main.js'),//入口文件
    output: {
        path: path.join(__dirname,'/dist'),
        filename: 'bundle.js' //指定输出的名称
    },
    plugins:[
        new htmlWebPackPlugin({
            template:path.join(__dirname,'./src/index.html'),
            filename:'index.html'
        })
    ],
    module: {   // 这个节点，用于配置所有第三方模块加载器
        rules:[ // 所有第三方模块 匹配规则
            {
                test: /\.css$/,     // 匹配以.css文件结尾的文件
                use: ['style-loader','css-loader'] // 指定要处理的.css文件的加载器
            },
            {
                test: /\.less$/,
                use: ['style-loader','css-loader','less-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader','css-loader','sass-loader']
            },
            {
                test: /\.(jpg|png|gif|bmp|jpeg)$/,
                use: 'url-loader'
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)$/,
                use:'url-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/ //这是配置 Babel 来转换 ES 的语法
            }
        ]
    }
}
```

注意：

-   在配置 babel 的 loader 规则的时候，必须把 `node_modules` 目录，通过 `exclude` 选项排除掉，原因有两个：
-   如果不排除 `node_modules` ，则会把 `node_modules` 中所有的第三方 JS 文件都打包编译，这样会非常消耗CPU，同时，打包速度非常慢；
-   如果不加上，最终，Babel 把 所用 `node_modules` 中的 JS 转换完毕了，但是项目依然是无法正常运行的

而后，我们必须还要在项目的根目录中，新建一个叫做 `.babelrc` 的 `Babel` 配置文件，这个配置文件，属于 **JSON** 格式，所以，在写 `.babelrc` 配置的时候，必须符合 JSON 语法规范；不能写注释，字符串必须用双引号，而该文件中写如下内容：

```js
{
    "presets": ["env","stage-0"],
    "plugins": ["transform-runtime"]
}
```

##### 1.12.15 在 webpack 中使用网页中的Vue

在 webpack 中，使用 `importVuefromvue` 导入的 Vue 构造函数功能不完整，只提供了 runtime-only 的方式，并没有提供网页中那样的使用方法；

###### 1.12.15.1 安装

```bash
npm i vue -D
```

###### 1.12.15.2 使用

首先在 `main.js` 中引用 vue， `importVuefrom'vue'`

而后打开 `webpack.config.js` 在其中加入一个 `resolve` 同级的对象，其中加入一个 `alias` 对象，写入 `'vue$':'vue/dist/vue.min.js'` ，它检查到这句话，就会将我们 vue 指向的文件为：`vue.min.js` ，而不是它默认的指向文件 `vue.runtime.common.js`

```js
const path = require('path');
const webpack = require('webpack');
const htmlWebPackPlugin = require('html-webpack-plugin')


module.exports = {
    entry: path.join(__dirname,'./src/main.js'),//入口文件
    output: {
        path: path.join(__dirname,'/dist'),
        filename: 'bundle.js' //指定输出的名称
    },
    plugins:[
        new htmlWebPackPlugin({
            template:path.join(__dirname,'./src/index.html'),
            filename:'index.html'
        })
    ],
    module: {   // 这个节点，用于配置所有第三方模块加载器
        rules:[ // 所有第三方模块 匹配规则
            {
                test: /\.css$/,     // 匹配以.css文件结尾的文件
                use: ['style-loader','css-loader'] // 指定要处理的.css文件的加载器
            },
            {
                test: /\.less$/,
                use: ['style-loader','css-loader','less-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader','css-loader','sass-loader']
            },
            {
                test: /\.(jpg|png|gif|bmp|jpeg)$/,
                use: 'url-loader'
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)$/,
                use:'url-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve:{
        alias:{ // 设置 vue 导入包中的 文件
            'vue$': 'vue/dist/vue.min.js'
        }
    }
}
```

##### 1.12.16 如何使用 vue.runtime.common.js

在 src 目录中创建一个后缀名为 `.vue` 的文件 ，其实它就是一个组件
![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/1v92dozq0l.png)

在此写入：
```vue
<template>

</template>

<script>

</script>

<style>

</style>
```

其中 `template` 写HTML， `script` 写 JS， `style` 写 CSS 。这三部分组成了一个组件，以后我们使用组件的话直接在主文件中引用该文件就可以了。

但是如果运行还是会报错的，我们还必须安装 vue-laoder

注意：

使用 `vue.runtime.common.js` 要把刚刚在 `webpack.config.js` 中配置的 `resolve` 对象给删除掉才行

##### 1.12.16 在 webpack 中配置 vue-loader

###### 1.12.16.1 安装

```bash
npm i vue-loader vue-template-compiler -D
```

###### 1.12.16.2 使用

```js
const path = require('path');
const webpack = require('webpack');
const htmlWebPackPlugin = require('html-webpack-plugin')


module.exports = {
    entry: path.join(__dirname,'./src/main.js'),//入口文件
    output: {
        path: path.join(__dirname,'/dist'),
        filename: 'bundle.js' //指定输出的名称
    },
    plugins:[
        new htmlWebPackPlugin({
            template:path.join(__dirname,'./src/index.html'),
            filename:'index.html'
        })
    ],
    module: {   // 这个节点，用于配置所有第三方模块加载器
        rules:[ // 所有第三方模块 匹配规则
            {
                test: /\.css$/,     // 匹配以.css文件结尾的文件
                use: ['style-loader','css-loader'] // 指定要处理的.css文件的加载器
            },
            {
                test: /\.less$/,
                use: ['style-loader','css-loader','less-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader','css-loader','sass-loader']
            },
            {
                test: /\.(jpg|png|gif|bmp|jpeg)$/,
                use: 'url-loader'
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)$/,
                use:'url-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {   
                // 处理 .vue 文件的loader
                test: /\.vue$/,
                use: 'vue-loader'
            }
        ]
    }
}
```

而后，我们运行的还是会报错的，这里必须使用 render 来渲染组件
```js
/**
 * 学习在 webpack 中使用 vue
*/
// 注意 : 在 webpack 中，使用 import Vue from `vue` 导入的 Vue 构造函数
// ，功能不完整，只提供了 runtime-only 的方式，并没有提供 网页中那样的使用方法；
import Vue from 'vue';
import login from './login.vue';

let app = new Vue({
    el: '#app',
    data: {
        msg: '123',
    },
    render:h=> h(login)
})
```

如果想将组件中的数据导出，必须使用 `exportdefault` 进行导出
```js
<template>
    <h1>我们使用了{{ msg }}</h1>
</template>

<script>
export default {
    data: function(){
        return {
            msg:'nihao'
        }
    }
}
</script>

<style>

</style>
```

注意：

`exportdefault` 是 ES6 中的语法

-   使用 `exportdefalut` 向外暴露成员，可以使用 `import` 来接受数据
-   一个模块中 `exportdefalut` 只允许向外暴露1次
-   一个模块中 `exportdefalut` 和 `export` 可以向外暴露成员

`export` 也是可以向外暴露成员

-   它导出的成员只能还是用 {} 的形式来接收，这种形式，叫做 【按需导出】
-   它可以向外暴露多个成员，同时这些成员，在使用 import 的时候，不需要，则可以不再 {} 中定义
-   它导出的成员，必须严格按照导出时候的名称，来使用 {} 按需接收，但可以使用 as 来起别名

##### 1.12.17 如何在 webpack 使用 vue-router

###### 1.12.17.1 安装

```bash
npm i vue-router -D
```

###### 1.12.17.2 使用

打开 `main.js` 并且导入 `vue-router`，并且使用 `Vue.use(VueRouter)` 手动挂载 `vue-router`
```js
import Vue from 'vue';
import app from './app.vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

let vm = new Vue({
    el: '#app',
    render: c => c(app),
})
```

而后配置路由
```js
import Vue from 'vue';
import app from './app.vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import account from './main/Account.vue';
import goodslist from './main/GoodsList.vue';


let router = new VueRouter({
    routes: [
        {
            path: '/account',
            component:account
        },
        {
            path: '/goodslist',
            component: goodslist,
        }
    ]
})


let vm = new Vue({
    el: '#app',
    render: c => c(app),
    router
})
```

这里使用 `vue-router` 比较麻烦这里配个截图和代码，我不知道怎么解释他们之间的关系，不过要记住每个 `.vue` 文件就是一个组件
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231227152525327.png" alt="image-20231227152525327" style="zoom:50%;" />

下面是 `main.js` 的代码
```js
import Vue from 'vue';
import app from './app.vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import account from './main/Account.vue';
import goodslist from './main/GoodsList.vue';
import login from './subcom/login.vue';
import register from './subcom/register.vue';

let router = new VueRouter({
    routes: [
        {
            path: '/account',
            component:account,
            children: [
                {
                    path: 'login',
                    component: login,
                },
                {
                    path: 'register',
                    component: register,
                }
            ]
        },
        {
            path: '/goodslist',
            component: goodslist,
        }
    ]
})


let vm = new Vue({
    el: '#app',
    render: c => c(app),
    router
})
```

下面是组件的代码

account.vue
```vue
<template>
    <div>
        <h1>这是 Account 组件</h1>
        <router-link to='/account/login'>登录</router-link>
        <router-link to='/account/register'>注册</router-link>
        <router-view></router-view>
    </div>
</template>
<script>
export default {


}
</script>
<style>

</style>
```

goodslist.vue
```vue
<template>
    <div>
        <h1>这是 GoodsList 组件</h1>
    </div>
</template>
<script>
export default {


}
</script>
<style>

</style>
```

`login.vue` 和 `register.vue` 我就没写内容了，仅仅把它看成子路由就可以了

##### 1.12.18 给子组件加上私有的样式

一般我们在子组件使用样式时，会将所有的样式都改变例如：
```vue
<template>
    <div>
        <h1>这是 Account 组件</h1>
        <router-link to='/account/login'>登录</router-link>
        <router-link to='/account/register'>注册</router-link>
        <router-view></router-view>
    </div>
</template>
<script>
export default {


}
</script>
<style>
    div {
        color: pink;
    }
</style>
```

当我们点击 account 这个组件是就会触发它自己设置的颜色，从而将整个页面的div中的文字颜色变成粉红色。

而我们仅仅需要给style元素加一个 `scoped` 属性就会将自己的颜色变成私有的
```vue
<template>
    <div>
        <h1>这是 Account 组件</h1>
        <router-link to='/account/login'>登录</router-link>
        <router-link to='/account/register'>注册</router-link>
        <router-view></router-view>
    </div>
</template>
<script>
export default {


}
</script>
<style scoped>
    div {
        color: pink;
    }
</style>
```

`.vue` 文件只支持普通的样式，如果想要启用 `scss` 或 `less` ，就需要为 style 标签设置 `lang` 属性

```vue
<template>
    <div>
        <h1>这是 Account 组件</h1>
        <router-link to='/account/login'>登录</router-link>
        <router-link to='/account/register'>注册</router-link>
        <router-view></router-view>
    </div>
</template>
<script>
export default {


}
</script>
<style scoped lang='less'>
    div {
        color: pink;
        a {
            color: aqua;
        }
    }
</style>
```

#### 1.13 MVVM

MVVM架构思想的实现步骤如下：

-   模型（Model）：负责处理数据的读写操作，包括从服务器获取数据、存储数据等。
-   视图（View）：负责渲染用户界面，包括HTML、CSS和JavaScript等，但不包括业务逻辑。
-   视图模型（ViewModel）：连接视图和模型的桥梁，负责从模型中获取数据，并将其转换为视图可以使用的格式，同时也负责将视图中的用户交互事件转换为模型可以理解的操作。视图模型中不包含任何与视图相关的代码，从而实现了解耦。

在MVVM架构中，视图模型扮演了非常重要的角色。它不仅仅是将模型的数据绑定到视图上，还可以实现一些业务逻辑，例如数据的验证、数据的格式化等。视图模型还可以通过命令模式来实现用户交互事件的处理，从而将视图和模型完全解耦。

![image-20231228140357858](https://gitee.com/KingsRay/gitee-image-host/raw/master/image/image-20231228140357858.png)

MVVM 模式的工作原理
在 MVVM 模式下，ViewModel 负责从数据模型中读取数据，并将这些数据展示到视图中。同时，ViewModel 会监听视图中的操作，并在数据模型中更新相应的数据。在 Vue 中，Vue 组件作为 ViewModel 和视图之间的桥梁，负责实现 ViewModel 的功能。

当用户通过输入框修改数据时，Vue 组件实例会监听到输入框的变化，然后通过双向绑定将数据更新到数据模型中。当数据模型中的数据发生变化时，Vue 组件实例会监听到数据变化，并自动更新视图中展示的内容。

*优点*

**（1）低耦合**。视图（View）可以独立于Model变化和修改，一个ViewModel可以绑定到不同的"View"上，当View变化的时候Model可以不变，当Model变化的时候View也可以不变。

**（2）可重用性**。你可以把一些视图逻辑放在一个ViewModel里面，让很多view重用这段视图逻辑。

**（3）独立开发**。开发人员可以专注于业务逻辑和数据的开发（ViewModel），设计人员可以专注于页面设计。

**（4）可测试**。界面素来是比较难于测试的，测试可以针对ViewModel来写。

1、MVVM相比较于MVP，将Presenter变成ViewModel，ViewModel可以理解成是View的数据模型和Presenter的合体
2、MVVM中的数据可以实现双向绑定，即View层数据变化则ViewModel中的数据也随之变化，反之ViewModel中的数据变化，则View层数据也随之变化`
注：MVC指的是Model-View-Controller，分别代表着模型层、视图层、控制器。

#### 1.14 http请求

浏览器发起请求-> 解析域名得到ip进行TCP连接 ->浏览器发送HTTP请求和头信息发送->服务器对浏览器进行应答，响应头信息和浏览器所需的内容-> 关闭TCP连接或保持-> 浏览器得到数据数据进行操作。

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/v2-4a9996d1f96058dc50a49caa8ddb5b90_b.jpg)

#### 1.15 如何实现跨域

##### 1.15.1 什么是跨域？

###### 1.15.1.1 什么是同源策略及其限制内容？

同源策略是一种约定，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到XSS、CSRF等攻击。所谓同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个ip地址，也非同源。

![image-20240102155040850](https://gitee.com/KingsRay/gitee-image-host/raw/master/image/image-20240102155040850.png)

**同源策略限制内容有：**

-   Cookie、LocalStorage、IndexedDB 等存储性内容
-   DOM 节点
-   AJAX 请求发送后，结果被浏览器拦截了

但是有三个标签是允许跨域加载资源：

-   `<img src=XXX>`
-   `<link href=XXX>`
-   `<script src=XXX>`

###### 1.15.1.2 常见跨域场景

**当协议、子域名、主域名、端口号中任意一个不相同时，都算作不同域**。不同域之间相互请求资源，就算作“跨域”。常见跨域场景如下图所示：

![img](https://gitee.com/KingsRay/gitee-image-host/raw/master/image/1638b3579dde630e~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75-20240102155247560.awebp)



特别说明两点：

**第一：如果是协议和端口造成的跨域问题“前台”是无能为力的。**

**第二：在跨域问题上，仅仅是通过“URL的首部”来识别而不会根据域名对应的IP地址是否相同来判断。“URL的首部”可以理解为“协议, 域名和端口必须匹配”**。

这里你或许有个疑问：**请求跨域了，那么请求到底发出去没有？**

**跨域并不是请求发不出去，请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了**。你可能会疑问明明通过表单的方式可以发起跨域请求，为什么 Ajax 就不会?因为归根结底，跨域是为了阻止用户读取到另一个域名下的内容，Ajax 可以获取响应，浏览器认为这不安全，所以拦截了响应。但是表单并不会获取新的内容，所以可以发起跨域请求。同时也说明了跨域并不能完全阻止 CSRF，因为请求毕竟是发出去了。

##### 1.15.2 跨域解决方案

###### 1.15.2.1 jsonp

1) JSONP原理

**利用 `<script>` 标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP请求一定需要对方的服务器做支持才可以。**

2) JSONP和AJAX对比

JSONP和AJAX相同，都是客户端向服务器端发送请求，从服务器端获取数据的方式。但AJAX属于同源策略，JSONP属于非同源策略（跨域请求）

3) JSONP优缺点

JSONP优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。**缺点是仅支持get方法具有局限性,不安全可能会遭受XSS攻击。**

4) JSONP的实现流程

-   声明一个回调函数，其函数名(如show)当做参数值，要传递给跨域请求数据的服务器，函数形参为要获取目标数据(服务器返回的data)。
-   创建一个`<script>`标签，把那个跨域的API数据接口地址，赋值给script的src,还要在这个地址中向服务器传递该函数名（可以通过问号传参:?callback=show）。
-   服务器接收到请求后，需要进行特殊的处理：把传递进来的函数名和它需要给你的数据拼接成一个字符串,例如：传递进去的函数名是show，它准备好的数据是`show('我不爱你')`。
-   最后服务器把准备的数据通过HTTP协议返回给客户端，客户端再调用执行之前声明的回调函数（show），对返回的数据进行操作。

在开发中可能会遇到多个 JSONP 请求的回调函数名是相同的，这时候就需要自己封装一个 JSONP函数。

```javascript
// index.html
function jsonp({ url, params, callback }) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script')
    window[callback] = function(data) {
      resolve(data)
      document.body.removeChild(script)
    }
    params = { ...params, callback } // wd=b&callback=show
    let arrs = []
    for (let key in params) {
      arrs.push(`${key}=${params[key]}`)
    }
    script.src = `${url}?${arrs.join('&')}`
    document.body.appendChild(script)
  })
}
jsonp({
  url: 'http://localhost:3000/say',
  params: { wd: 'Iloveyou' },
  callback: 'show'
}).then(data => {
  console.log(data)
})
```

上面这段代码相当于向`http://localhost:3000/say?wd=Iloveyou&callback=show`这个地址请求数据，然后后台返回`show('我不爱你')`，最后会运行show()这个函数，打印出'我不爱你'

```javascript
// server.js
let express = require('express')
let app = express()
app.get('/say', function(req, res) {
  let { wd, callback } = req.query
  console.log(wd) // Iloveyou
  console.log(callback) // show
  res.end(`${callback}('我不爱你')`)
})
app.listen(3000)
```

5) jQuery的jsonp形式

**JSONP都是GET和异步请求的，不存在其他的请求方式和同步请求，且jQuery默认就会给JSONP的请求清除缓存。**

```javascript
$.ajax({
url:"http://crossdomain.com/jsonServerResponse",
dataType:"jsonp",
type:"get",//可以省略
jsonpCallback:"show",//->自定义传递给服务器的函数名，而不是使用jQuery自动生成的，可省略
jsonp:"callback",//->把传递函数名的那个形参callback，可省略
success:function (data){
console.log(data);}
});
```

###### 1.15.2.2 cors

**CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现**。

浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。

服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。

虽然设置 CORS 和前端没什么关系，但是通过这种方式解决跨域问题的话，会在发送请求时出现两种情况，分别为**简单请求**和**复杂请求**。

1) 简单请求

只要同时满足以下两大条件，就属于简单请求

条件1：使用下列方法之一：

-   GET
-   HEAD
-   POST

条件2：Content-Type 的值仅限于下列三者之一：

-   text/plain
-   multipart/form-data
-   application/x-www-form-urlencoded

请求中的任意 XMLHttpRequestUpload 对象均没有注册任何事件监听器； XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload 属性访问。

2) 复杂请求

不符合以上条件的请求就肯定是复杂请求了。 复杂请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求,该请求是 option 方法的，通过该请求来知道服务端是否允许跨域请求。

我们用`PUT`向后台请求时，属于复杂请求，后台需做如下配置：

```javascript
// 允许哪个方法访问我
res.setHeader('Access-Control-Allow-Methods', 'PUT')
// 预检的存活时间
res.setHeader('Access-Control-Max-Age', 6)
// OPTIONS请求不做任何处理
if (req.method === 'OPTIONS') {
  res.end() 
}
// 定义后台返回的内容
app.put('/getData', function(req, res) {
  console.log(req.headers)
  res.end('我不爱你')
})
```

接下来我们看下一个完整复杂请求的例子，并且介绍下CORS请求相关的字段

```javascript
// index.html
let xhr = new XMLHttpRequest()
document.cookie = 'name=xiamen' // cookie不能跨域
xhr.withCredentials = true // 前端设置是否带cookie
xhr.open('PUT', 'http://localhost:4000/getData', true)
xhr.setRequestHeader('name', 'xiamen')
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      console.log(xhr.response)
      //得到响应头，后台需设置Access-Control-Expose-Headers
      console.log(xhr.getResponseHeader('name'))
    }
  }
}
xhr.send()



//server1.js
let express = require('express');
let app = express();
app.use(express.static(__dirname));
app.listen(3000);


//server2.js
let express = require('express')
let app = express()
let whitList = ['http://localhost:3000'] //设置白名单
app.use(function(req, res, next) {
  let origin = req.headers.origin
  if (whitList.includes(origin)) {
    // 设置哪个源可以访问我
    res.setHeader('Access-Control-Allow-Origin', origin)
    // 允许携带哪个头访问我
    res.setHeader('Access-Control-Allow-Headers', 'name')
    // 允许哪个方法访问我
    res.setHeader('Access-Control-Allow-Methods', 'PUT')
    // 允许携带cookie
    res.setHeader('Access-Control-Allow-Credentials', true)
    // 预检的存活时间
    res.setHeader('Access-Control-Max-Age', 6)
    // 允许返回的头
    res.setHeader('Access-Control-Expose-Headers', 'name')
    if (req.method === 'OPTIONS') {
      res.end() // OPTIONS请求不做任何处理
    }
  }
  next()
})
app.put('/getData', function(req, res) {
  console.log(req.headers)
  res.setHeader('name', 'jw') //返回一个响应头，后台需设置
  res.end('我不爱你')
})
app.get('/getData', function(req, res) {
  console.log(req.headers)
  res.end('我不爱你')
})
app.use(express.static(__dirname))
app.listen(4000)
```

上述代码由`http://localhost:3000/index.html`向`http://localhost:4000/`跨域请求，正如我们上面所说的，后端是实现 CORS 通信的关键。

###### 1.15.2.3 postMessage

postMessage是HTML5 XMLHttpRequest Level 2中的API，且是为数不多可以跨域操作的window属性之一，它可用于解决以下方面的问题：

-   页面和其打开的新窗口的数据传递
-   多窗口之间消息传递
-   页面与嵌套的iframe消息传递
-   上面三个场景的跨域数据传递

**postMessage()方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递**。

>   otherWindow.postMessage(message, targetOrigin, [transfer]);

-   message: 将要发送到其他 window的数据。
-   targetOrigin:通过窗口的origin属性来指定哪些窗口能接收到消息事件，其值可以是字符串"*"（表示无限制）或者一个URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配targetOrigin提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。
-   transfer(可选)：是一串和message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

接下来我们看个例子： `http://localhost:3000/a.html`页面向`http://localhost:4000/b.html`传递“我爱你”,然后后者传回"我不爱你"。

```html
// a.html
  <iframe src="http://localhost:4000/b.html" frameborder="0" id="frame" onload="load()"></iframe> //等它加载完触发一个事件
  //内嵌在http://localhost:3000/a.html
    <script>
      function load() {
        let frame = document.getElementById('frame')
        frame.contentWindow.postMessage('我爱你', 'http://localhost:4000') //发送数据
        window.onmessage = function(e) { //接受返回数据
          console.log(e.data) //我不爱你
        }
      }
    </script>



// b.html
  window.onmessage = function(e) {
    console.log(e.data) //我爱你
    e.source.postMessage('我不爱你', e.origin)
 }
```

###### 1.15.2.4 websocket

Websocket是HTML5的一个持久化的协议，它实现了浏览器与服务器的全双工通信，同时也是跨域的一种解决方案。WebSocket和HTTP都是应用层协议，都基于 TCP 协议。但是 **WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据**。同时，WebSocket 在建立连接时需要借助 HTTP 协议，连接建立好了之后 client 与 server 之间的双向通信就与 HTTP 无关了。

原生WebSocket API使用起来不太方便，我们使用`Socket.io`，它很好地封装了webSocket接口，提供了更简单、灵活的接口，也对不支持webSocket的浏览器提供了向下兼容。

我们先来看个例子：本地文件socket.html向`localhost:3000`发生数据和接受数据

```javascript
// socket.html
<script>
    let socket = new WebSocket('ws://localhost:3000');
    socket.onopen = function () {
      socket.send('我爱你');//向服务器发送数据
    }
    socket.onmessage = function (e) {
      console.log(e.data);//接收服务器返回的数据
    }
</script>



// server.js
let express = require('express');
let app = express();
let WebSocket = require('ws');//记得安装ws
let wss = new WebSocket.Server({port:3000});
wss.on('connection',function(ws) {
  ws.on('message', function (data) {
    console.log(data);
    ws.send('我不爱你')
  });
})
```

###### 1.15.2.5 Node中间件代理(两次跨域)

实现原理：**同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。** 代理服务器，需要做以下几个步骤：

-   接受客户端请求 。

-   将请求 转发给服务器。

-   拿到服务器 响应 数据。

-   将 响应 转发给客户端。

    ![img](https://gitee.com/KingsRay/gitee-image-host/raw/master/image/1685c5bed77e7788~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75-20240102155308467.awebp)

我们先来看个例子：本地文件index.html文件，通过代理服务器`http://localhost:3000`向目标服务器`http://localhost:4000`请求数据。

```javascript
// index.html(http://127.0.0.1:5500)
 <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
    <script>
      $.ajax({
        url: 'http://localhost:3000',
        type: 'post',
        data: { name: 'xiamen', password: '123456' },
        contentType: 'application/json;charset=utf-8',
        success: function(result) {
          console.log(result) // {"title":"fontend","password":"123456"}
        },
        error: function(msg) {
          console.log(msg)
        }
      })
     </script>
```

```javascript
// server1.js 代理服务器(http://localhost:3000)
const http = require('http')
// 第一步：接受客户端请求
const server = http.createServer((request, response) => {
  // 代理服务器，直接和浏览器直接交互，需要设置CORS 的首部字段
  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  })
  // 第二步：将请求转发给服务器
  const proxyRequest = http
    .request(
      {
        host: '127.0.0.1',
        port: 4000,
        url: '/',
        method: request.method,
        headers: request.headers
      },
      serverResponse => {
        // 第三步：收到服务器的响应
        var body = ''
        serverResponse.on('data', chunk => {
          body += chunk
        })
        serverResponse.on('end', () => {
          console.log('The data is ' + body)
          // 第四步：将响应结果转发给浏览器
          response.end(body)
        })
      }
    )
    .end()
})
server.listen(3000, () => {
  console.log('The proxyServer is running at http://localhost:3000')
})
```

```javascript
// server2.js(http://localhost:4000)
const http = require('http')
const data = { title: 'fontend', password: '123456' }
const server = http.createServer((request, response) => {
  if (request.url === '/') {
    response.end(JSON.stringify(data))
  }
})
server.listen(4000, () => {
  console.log('The server is running at http://localhost:4000')
})
```

上述代码经过两次跨域，值得注意的是浏览器向代理服务器发送请求，也遵循同源策略，最后在index.html文件打印出`{"title":"fontend","password":"123456"}`

###### 1.15.2.6 nginx反向代理

实现原理类似于Node中间件代理，需要你搭建一个中转nginx服务器，用于转发请求。

使用nginx反向代理实现跨域，是最简单的跨域方式。只需要修改nginx的配置即可解决跨域问题，支持所有浏览器，支持session，不需要修改任何代码，并且不会影响服务器性能。

实现思路：通过nginx配置一个代理服务器（域名与domain1相同，端口不同）做跳板机，反向代理访问domain2接口，并且可以顺便修改cookie中domain信息，方便当前域cookie写入，实现跨域登录。

先下载[nginx](https://link.juejin.cn?target=http%3A%2F%2Fnginx.org%2Fen%2Fdownload.html)，然后将nginx目录下的nginx.conf修改如下:

```nginx
// proxy服务器
server {
    listen       81;
    server_name  www.domain1.com;
    location / {
        proxy_pass   http://www.domain2.com:8080;  #反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
        index  index.html index.htm;

        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}
```

最后通过命令行`nginx -s reload`启动nginx

```javascript
// index.html
var xhr = new XMLHttpRequest();
// 前端开关：浏览器是否读写cookie
xhr.withCredentials = true;
// 访问nginx中的代理服务器
xhr.open('get', 'http://www.domain1.com:81/?user=admin', true);
xhr.send();
```

```javascript
// server.js
var http = require('http');
var server = http.createServer();
var qs = require('querystring');
server.on('request', function(req, res) {
    var params = qs.parse(req.url.substring(2));
    // 向前台写cookie
    res.writeHead(200, {
        'Set-Cookie': 'l=a123456;Path=/;Domain=www.domain2.com;HttpOnly'   // HttpOnly:脚本无法读取
    });
    res.write(JSON.stringify(params));
    res.end();
});
server.listen('8080');
console.log('Server is running at port 8080...');
```

###### 1.5.15.2.7 window.name + iframe

window.name属性的独特之处：name值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。

其中a.html和b.html是同域的，都是`http://localhost:3000`;而c.html是`http://localhost:4000`

```html
// a.html(http://localhost:3000/b.html)
  <iframe src="http://localhost:4000/c.html" frameborder="0" onload="load()" id="iframe"></iframe>
  <script>
    let first = true
    // onload事件会触发2次，第1次加载跨域页，并留存数据于window.name
    function load() {
      if(first){
      // 第1次onload(跨域页)成功后，切换到同域代理页面
        let iframe = document.getElementById('iframe');
        iframe.src = 'http://localhost:3000/b.html';
        first = false;
      }else{
      // 第2次onload(同域b.html页)成功后，读取同域window.name中数据
        console.log(iframe.contentWindow.name);
      }
    }
  </script>
```

b.html为中间代理页，与a.html同域，内容为空。

```html
 // c.html(http://localhost:4000/c.html)
  <script>
    window.name = '我不爱你'  
  </script>
```

总结：通过iframe的src属性由外域转向本地域，跨域数据即由iframe的window.name从外域传递到本地域。这个就巧妙地绕过了浏览器的跨域访问限制，但同时它又是安全操作

###### 1.15.2.8 location.hash +  iframe

实现原理： a.html欲与c.html跨域相互通信，通过中间页b.html来实现。 三个页面，不同域之间利用iframe的location.hash传值，相同域之间直接js访问来通信。

具体实现步骤：一开始a.html给c.html传一个hash值，然后c.html收到hash值后，再把hash值传递给b.html，最后b.html将结果放到a.html的hash值中。 同样的，a.html和b.html是同域的，都是`http://localhost:3000`;而c.html是`http://localhost:4000`

```html
// a.html
  <iframe src="http://localhost:4000/c.html#iloveyou"></iframe>
  <script>
    window.onhashchange = function () { //检测hash的变化
      console.log(location.hash);
    }
  </script>


// b.html
  <script>
    window.parent.parent.location.hash = location.hash 
    //b.html将结果放到a.html的hash值中，b.html可通过parent.parent访问a.html页面
  </script>



 // c.html
 console.log(location.hash);
  let iframe = document.createElement('iframe');
  iframe.src = 'http://localhost:3000/b.html#idontloveyou';
  document.body.appendChild(iframe);
```

###### 1.15.2.9 document.domain + iframe

**该方式只能用于二级域名相同的情况下，比如 `a.test.com` 和 `b.test.com` 适用于该方式**。 只需要给页面添加 `document.domain ='test.com'` 表示二级域名都相同就可以实现跨域。

实现原理：两个页面都通过js强制设置document.domain为基础主域，就实现了同域。

我们看个例子：页面`a.zf1.cn:3000/a.html`获取页面`b.zf1.cn:3000/b.html`中a的值

```html
// a.html
<body>
 helloa
  <iframe src="http://b.zf1.cn:3000/b.html" frameborder="0" onload="load()" id="frame"></iframe>
  <script>
    document.domain = 'zf1.cn'
    function load() {
      console.log(frame.contentWindow.a);
    }
  </script>
</body>



// b.html
<body>
   hellob
   <script>
     document.domain = 'zf1.cn'
     var a = 100;
   </script>
</body>
```

##### 1.15.3 总结

-   CORS支持所有类型的HTTP请求，是跨域HTTP请求的根本解决方案
-   JSONP只支持GET请求，JSONP的优势在于支持老式浏览器，以及可以向不支持CORS的网站请求数据。
-   不管是Node中间件代理还是nginx反向代理，主要是通过同源策略对服务器不加限制。
-   日常工作中，用得比较多的跨域方案是cors和nginx反向代理



### 2. Vue

#### 2.1 Vue中的的通信方式

##### 2.1.1 props / $emit

父组件通过 props 向子组件传递数据，子组件通过 $emit 和父组件通信
1）父组件向子组件传值（props的用法）
**props的特点：**
props只能是父组件向子组件进行传值，props使得父子组件之间形成一个单向的下行绑定。子组件的数据会随着父组件的更新而响应式更新。
props可以显示定义一个或一个以上的数据，对于接收的数据，可以是各种数据类型，同样也可以是传递一个函数。
props属性名规则：若在props中使用驼峰形式，模板中标签需要使用短横线的形式来书写。
用法：

```javascript
// 父组件
<template>
    <div id="father">
        <son :msg="msgData" :fn="myFunction"></son>
    </div>
</template>

<script>
import son from "./son.vue";
export default {
    name: father,
    data() {
        msgData: "父组件数据";
    },
    methods: {
        myFunction() {
            console.log("vue");
        }
    },
    components: {
        son
    }
};
</script>
```

```javascript
// 子组件
<template>
    <div id="son">
        <p>{{msg}}</p>
        <button @click="fn">按钮</button>
    </div>
</template>
<script>
export default {
    name: "son",
    props: ["msg", "fn"]
};
</script>
```

2）子组件向父组件传递数据（$emit的用法）

**$emit的特点：**
$emit 绑定一个自定义事件，当这个事件被执行的时候就会将参数传递给父组件，而父组件通过v-on监听并接收参数
用法：

```javascript
// 父组件
<template>
  <div class="section">
    <com-article :articles="articleList" @onEmitIndex="onEmitIndex"></com-article>
    <p>{{currentIndex}}</p>
  </div>
</template>

<script>
import comArticle from './test/article.vue'
export default {
  name: 'comArticle',
  components: { comArticle },
  data() {
    return {
      currentIndex: -1,
      articleList: ['红楼梦', '西游记', '三国演义']
    }
  },
  methods: {
    onEmitIndex(idx) {
      this.currentIndex = idx
    }
  }
}
</script>
```

```javascript
//子组件
<template>
  <div>
    <div v-for="(item, index) in articles" :key="index" @click="emitIndex(index)">{{item}}</div>
  </div>
</template>

<script>
export default {
  props: ['articles'],
  methods: {
    emitIndex(index) {
      this.$emit('onEmitIndex', index) // 触发父组件的方法，并传递参数index
    }
  }
}
</script>
```

##### 2.1.2 ref / $refs

这种方式也是实现父子组件之间的通信
ref：这个属性用在子组件上，它的用用就指向了子组件的实例，可以通过实例来访问组件的数据和方法
用法：

```javascript
// 子组件
export default {
  data () {
    return {
      name: 'JavaScript'
    }
  },
  methods: {
    sayHello () {
      console.log('hello')
    }
  }
}
```

```javascript
// 父组件
<template>
  <child ref="child"></component-a>
</template>
<script>
  import child from './child.vue'
  export default {
    components: { child },
    mounted () {
      console.log(this.$refs.child.name);  // JavaScript
      this.$refs.child.sayHello();  // hello
    }
  }
</script>
```

##### 2.1.3 eventBus事件总线（$emit / $on）

eventBus事件总线适用于父子组件、非父子组件等之间的通信，使用步骤如下：
1）创建事件中心管理组件之间的通信

```javascript
// event-bus.js

import Vue from 'vue'
export const EventBus = new Vue()
```

2）发送事件 假设有两个兄弟组件firstCom和secondCom：
firstCom和secondCom的父组件：

```javascript
<template>
  <div>
    <first-com></first-com>
    <second-com></second-com>
  </div>
</template>

<script>
import firstCom from './firstCom.vue'
import secondCom from './secondCom.vue'
export default {
  components: { firstCom, secondCom }
}
</script>
```

在firstCom组件中发送事件：
```javascript
<template>
  <div>
    <button @click="add">加法</button>    
  </div>
</template>

<script>
import {EventBus} from './event-bus.js' // 引入事件中心

export default {
  data(){
    return{
      num:0
    }
  },
  methods:{
    add(){
      EventBus.$emit('addition', {
        num:this.num++
      })
    }
  }
}
</script>
```

3）在secondCom组件中接收事件：

```javascript
<template>
  <div>求和: {{count}}</div>
</template>

<script>
import { EventBus } from './event-bus.js'
export default {
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    EventBus.$on('addition', param => {
      this.count = this.count + param.num;
    })
  }
}
</script>
```

在上述代码中，这就相当于将num值存贮在了事件总线中，在其他组件中可以直接访问。事件总线就相当于一个桥梁，不用组件通过它来通信。虽然看起来比较简单，但是这种方法也有不变之处，如果项目过大，使用这种方式进行通信，后期维护起来会很困难。

##### 2.1.4 依赖注入（provide / inject）

这种方式就是vue中依赖注入，该方法用于 父子组件之间 的通信。当然这里所说的父子不一定是真正的父子，也可以是祖孙组件，在层数很深的情况下，可以使用这种方式来进行传值。就不用一层一层的传递数据了。
provide和inject是vue提供的两个钩子，和data、methods是同级的。并且provide的书写形式和data一样。
1）provide 钩子用来发送数据或方法
2）inject钩子用来接收数据或方法
用法：

```javascript
// 父组件
provide() { 
    return {     
        num: this.num  
    };
}
```

```javascript
// 子组件
inject: ['num']
```

还有另一种写法，这种写法可以访问父组件中的所有属性：
```javascript
provide() {
 return {
    app: this
  };
}
data() {
 return {
    num: 1
  };
}

inject: ['app']
console.log(this.app.num)
```

**注意**： 依赖注入所提供的属性是**非响应式的**。

##### 2.1.5 $parent / $children

-   使用$parent可以让组件访问父组件的实例（访问的是上一级父组件的属性和方法）。
-   使用 $children 可以让组件访问子组件的实例，但是， $children 并不能保证顺序，并且访问的数据也不是响应式的。

用法：
```javascript
// 子组件
<template>
  <div>
    <span>{{message}}</span>
    <p>获取父组件的值为:  {{parentVal}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Vue'
    }
  },
  computed:{
    parentVal(){
      return this.$parent.msg;
    }
  }
}
</script>
```

```javascript
// 父组件
<template>
  <div class="hello_world">
    <div>{{msg}}</div>
    <child></child>
    <button @click="change">点击改变子组件值</button>
  </div>
</template>

<script>
import child from './child.vue'
export default {
  components: { child },
  data() {
    return {
      msg: 'Welcome'
    }
  },
  methods: {
    change() {
      // 获取到子组件
      this.$children[0].message = 'JavaScript'
    }
  }
}
</script>
```

在上面的代码中，子组件获取到了父组件的parentVal值，父组件改变了子组件中message的值。

注意：
1）通过 $parent 访问到的是上一级父组件的实例，可以使用 $root 来访问根组件的实例
2）在组件中使用$children拿到的是所有的子组件的实例，它是一个数组，并且是无序的
3）在根组件 #app 上拿 $parent 得到的是 new Vue()的实例，在这实例上再拿 $parent 得到的是undefined，而在最底层的子组件拿 $children 是个空数组
4）$children 的值是数组，而 $parent是个对象

##### 2.1.6 $attrs / $listeners

​		考虑一种场景，如果A是B组件的父组件，B是C组件的父组件。如果想要组件A给C组件传递数据，这种隔代传数据的情况该使用哪种方式呢？
​		如果是用props/ $emit 来一级一级的传递，确实可以完成，但是比较复杂；如果使用事件总线，在多人开发或者项目较大的时候，维护起来很麻烦；如果使用vuex，如果仅仅是传递数据，那可能有点浪费了。
​		针对上述情况，vue引入了 $attrs / $listeners，实组件之间的跨代通信。
​		1）$attrs：继承所有的父组件属性（除了props传递的属性、class 和 style），一般用在子组件的子元素上
​		2）$listeners：该属性是一个对象，里面包含了作用在这个组件上的所有监听器，可以配合 v-on=" $listeners " 将所有的事件监听器指向这个组件的某个特定的子元素。（相当于子组件继承父组件的事件）
​		再说一下 inheritAttrs
​		1）默认值为true，继承所有的父组件属性除props之外的所有属性。
​		2）只继承class属性。

用法：
```javascript
// A组件（APP.vue）
<template>
    <div id="app">
        //此处监听了两个事件，可以在B组件或者C组件中直接触发 
        <child1 :p-child1="child1" :p-child2="child2" @test1="onTest1" @test2="onTest2"></child1>
    </div>
</template>
<script>
import Child1 from './Child1.vue';
export default {
    components: { Child1 },
    methods: {
        onTest1() {
            console.log('test1 running');
        },
        onTest2() {
            console.log('test2 running');
        }
    }
};
</script>
```

```javascript
// B组件（Child1.vue）
<template>
    <div class="child-1">
        <p>props: {{pChild1}}</p>
        <p>$attrs: {{$attrs}}</p>
        <child2 v-bind="$attrs" v-on="$listeners"></child2>
    </div>
</template>
<script>
import Child2 from './Child2.vue';
export default {
    props: ['pChild1'],
    components: { Child2 },
    inheritAttrs: false,
    mounted() {
        this.$emit('test1'); // 触发APP.vue中的test1方法
    }
};
</script>
```

```javascript
// C组件 (Child2.vue)
<template>
    <div class="child-2">
        <p>props: {{pChild2}}</p>
        <p>$attrs: {{$attrs}}</p>
    </div>
</template>
<script>
export default {
    props: ['pChild2'],
    inheritAttrs: false,
    mounted() {
        this.$emit('test2');// 触发APP.vue中的test2方法
    }
};
</script>
```

在上述代码中：

-   C组件中能直接触发test的原因在于 B组件调用C组件时 使用 v-on 绑定了$listeners 属性
-   在B组件中通过v-bind 绑定$attrs属性，C组件可以直接获取到A组件中传递下来的props（除了B组件中props声明的）

##### 2.1.7 总结
根据以上对这6种组件间的通信方法，可以将不同组件间的通信分为4种类型：父子组件间通信、跨代组件间通信、兄弟组件间通信、任意组件间通信
1、父子组件间通信
		a）子组件通过 props 属性来接受父组件的数据，然后父组件在子组件上注册监听事件，子组件通过 emit 触发事件来向父组件发送数据。
		b）通过 ref 属性给子组件设置一个名字。父组件通过 $refs 组件名来获得子组件，子组件通过 $parent 获得父组件，这样也可以实现通信。
		c）使用 provide/inject，在父组件中通过 provide提供变量，在子组件中通过 inject 来将变量注入到组件中。不论子组件有多深，只要调用了 inject 那么就可以注入 provide中的数据。
2、跨代组件间通信
		a）跨代组件间通信其实就是多层的父子组件通信，同样可以使用上述父子组件间通信的方法，只不过需要多层通信会比较麻烦。
		b）使用上述的6种方法的$attrs / $listeners方法。
3、兄弟组件间通信
		a）通过 $parent + $refs 以父组件为中间人来获取到兄弟组件，也可以进行通信。
4、任意组件间通信
		a）使用 eventBus，其实就是创建一个事件中心，相当于中转站，可以用它来传递事件和接收事件。它的本质是通过创建一个空的 Vue 实例来作为消息传递的对象，通信的组件引入这个实例，通信的组件通过在这个实例上监听和触发事件，来实现消息的传递。
		如果业务逻辑复杂，很多组件之间需要同时处理一些公共的数据，这个时候采用上面这一些方法可能不利于项目的维护。这个时候可以使用 vuex ，vuex 的思想就是将这一些公共的数据抽离出来，将它作为一个全局的变量来管理，然后其他组件就可以对这个公共数据进行读写操作，这样达到了解耦的目的。

#### 2.2 v-show和v-if指令

##### 2.2.1 Vue的渲染逻辑

-   将模板template解析成AST；
-    再将AST转化为Render函数；
-   通过Watcher监听数据的变化；
-   当数据发生变化时，Render函数执行生成虚拟VNode节点，该节点包含创建DOM节点所需信息；
-   通过patch方法，对比新旧VNode对象，通过DOM diff算法，添加、修改、删除真实DOM节点。

​		Vue中指令都是带有v-的特殊属性，这些指令主要是用来控制DOM元素的行为，例如最简单的显示、隐藏。本文将讲解Vue中非常常用的两个条件指令—— v-show 和 v-if 。

##### 2.2.2 v-show指令

1）原理
		v-show指令是根据条件显示DOM元素的指令，可以用来动态控制DOM元素的显示和隐藏。v-show后面跟的是判断条件，不管初始条件是什么，元素总是会被渲染。
语法：v-show="判断变量"
		当v-show值为false时，绑定DOM的 display:none 当v-show值为true时，绑定DOM会 移除display:none ，此时并不是把display变为block，而是保持元素style的原始性，也就是说，不管初始条件是什么，元素总是会被渲染。

2）实现
从实现效果可以看出DOM元素始终是存在的，v-show只是利用元素的display属性控制着元素的显示隐藏。

实现效果：
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/e59cf48629394ba38429eea81d1390d6.gif" alt="img" style="zoom: 67%;" />

```html
<body>
    <div id="app">
        <div v-show="flag" style="text-align: center;">
            v-show只是用来控制display的属性值
        </div>
    </div>
 
    <script>
        var vm = new Vue({
            el:'#app',
            data: {
                flag: true
            }
        })
    </script>
</body>
```

##### 2.2.3 v-if指令

1）原理
看到 v-if ，我们可以想到if…else条件判断语句，没错，Vue中还提供了 v-else 指令和 v-else-if 指令，学会v-if指令其他两个指令也就会了。
这样我们再来理解 v-if 指令，就是根据表达式值的真假来销毁或者重建一个我们绑定的DOM元素。

2）实现
从实现效果可以看出flag值为false时DOM元素被删除。
实现效果：
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/99b34cfa15c1485fae9e72d0721d319c.gif" alt="img" style="zoom: 67%;" />

```html
<body>
    <div id="app">
        <div v-if="flag" style="text-align: center;">
            v-if指令显示文本
        </div>
    </div>
 
    <script>
        var vm = new Vue({
            el:'#app',
            data: {
                flag: true
            }
        })
    </script>
</body>
```

##### 2.2.4 v-show和v-if指令的区别

既然 v-show 和 v-if 这两个指令都可以控制DOM元素的行为，那么它们有什么区别呢？

1.   控制手段不同
     我们从上面两个实现图可以看出，通过浏览器控制台改变表达式真值时，虽然页面效果都一样，但是DOM元素隐藏时大不相同：
     -   v-show指令设置隐藏是给绑定的DOM元素添加CSS样式：display:none，但是DOM元素仍然存在；
     -   v-if指令设置隐藏是将DOM元素整个删除，此时DOM元素不再存在。

2.   编译过程不同
      v-if  切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；而 v-show 只是简单的基于CSS切换，不管初始条件是什么，元素总是会被渲染。

3.   编译条件不同
     -   v-show 由false变为true时不会触发组建的生命周期；
     -   v-if 由false变为true时，触发组件的beforeCreate、create、beforeMount、mounter钩子，由true变为false时，触发组件的beforeDestory、destoryed方法。v-if 是真正的条件渲染，它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建；v-if 也是惰性的，如果初始渲染时条件为假，则什么也不做——直到为真时才开始渲染条件块。
4.   性能消耗不同
      v-show 由更高的初始渲染消耗， v-if 有更高的切换消耗。

##### 2.2.5 v-show和v-if使用场景

如果需要非常频繁地切换，则使用v-show较好；
如果在运行时条件很少改变，则使用v-if较好。

#### 2.3 v-for中为什么要用key

​		做一个唯一标识， Diff 算法就可以正确的识别此节点。作用主要是为了高效的更新虚拟 DOM。

+   vue中列表循环需加:key=“唯一标识” 唯一标识尽量是item里面id等，因为vue组件高度复用增加Key可以标识组件的唯一性，为了更好地区别各个组件 key的作用主要是为了高效的更新虚拟DOM。

+   key主要用来做dom diff算法用的，diff算法是同级比较，比较当前标签上的key还有它当前的标签名，如果key和标签名都一样时只是做了一个移动的操作，不会重新创建元素和删除元素。

+   没有key的时候默认使用的是“就地复用”策略。如果数据项的顺序被改变，Vue不是移动Dom元素来匹配数据项的改变，而是简单复用原来位置的每个元素。如果删除第一个元素，在进行比较时发现标签一样值不一样时，就会复用之前的位置，将新值直接放到该位置，以此类推，最后多出一个就会把最后一个删除掉。

+   尽量不要使用索引值index作key值，一定要用唯一标识的值，如id等。因为若用数组索引index为key，当向数组中指定位置插入一个新元素后，因为这时候会重新更新index索引，对应着后面的虚拟DOM的key值全部更新了，这个时候还是会做不必要的更新，就像没有加key一样，因此index虽然能够解决key不冲突的问题，但是并不能解决复用的情况。如果是静态数据，用索引号index做key值是没有问题的。

+   标签名一样，key一样这时候就会就地复用，如果标签名不一样，key一样不会复用。

![image-20231111102431785](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231111102431785.png)

​		在无key的情况下，我们可以看到是修改了四次dom，在有key的情况下，只需移动删除，不需要去修改dom，所以我们在使用v-for写上key，防止一会修改数据的时候，出现bug。

#### 2.4 computed和watch的使用场景

##### 2.4.1 计算属性computed 

定义 : 
		computed 是计算属性，它会根据你所依赖的数据动态显示新的计算结果，并且 computed 的值有缓存，只有当计算值变化才会返回内容。

-   支持缓存，只有依赖数据发生改变，才会重新进行计算
-   不支持异步，当computed内有异步操作时无效，无法监听数据的变化
-   computed 属性值会默认走缓存，计算属性如果依赖不变的话，它就会变成缓存，computed 的值就不会重新计算 ( 计算属性是基于它们的响应式依赖进行缓存的，也就是基于data中声明过或者父组件传递的props中的数据通过计算得到的值 )
-   是一个多对一或者一对一, 如果一个属性是由其他属性计算而来的，这个属性依赖其他属性，，一般用computed
-   如果computed属性属性值是函数，那么默认会走get方法；函数的返回值就是属性的属性值；在computed中的，属性都有一个get和一个set方法，当数据变化时，调用set方法。

注意：
computed计算属性的结果值，可以修改吗？可以的，需要通过get/set写法
当前组件v-model绑定的值是computed来的，那么可以修改吗？可以的，需要通过get/set写法

##### 2.4.2 侦听属性watch

定义 : 
		一个对象，key是 data 对应的数据，值是对应的回调函数。值也可以是方法名，或者包含选项的对象，当 data 的数据发生变化时，就会发生一个回调，他有两个参数，一个 val （修改后的 data 数据），一个 oldVal（原来的 data 数据）
Vue 实例将会在实例化时调用$watch()，遍历 watch 对象的每一个属性

-   不支持缓存，数据变，直接会触发相应的操作；
-   watch支持异步；
-   监听的函数接收两个参数，第一个参数是最新的值；第二个参数是输入之前的值；
-   一对多当一个属性发生变化时，需要执行对应的操作；
-   监听数据必须是data中声明过或者父组件传递过来的props中的数据，当数据变化时，触发其他操作，函数有两个参数，
    　　immediate：组件加载立即触发回调函数执行，
    　　deep: 深度监听，为了发现对象内部值的变化，复杂类型的数据时使用，例如数组中的对象内容的改变，注意监听数组的变动不需要这么做。注意：deep无法监听到数组的变动和对象的新增，参考vue数组变异,只有以响应式的方式触发才会被监听到。
    注意
    不应该使用箭头函数来定义 watcher 函数，因为箭头函数没有 this，它的 this 会继承它的父级函数，但是它的父级函数是 window，导致箭头函数的 this 指向 window，而不是 Vue 实例
-   deep 控制是否要看这个对象里面的属性变化
-   immediate 控制是否在第一次渲染是执行这个函数

watch
监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。无缓存性 页面重新渲染时 值不变化 也会执行
所以一般来说需要依赖别的属性来动态获得值的时候可以使用 computed，对于监听到值的变化需要做一些逻辑的情况可以使用 watch。

##### 2.4.3 使用场景

-   computed: 当一个属性受多个属性影响的时候就需要用到computed 
    最典型的栗子： 购物车商品结算的时候 
-   watch: 当一条数据影响多条数据的时候就需要用watch
    栗子：搜索数据

总结
如果一个数据需要经过复杂计算就用 computed 
如果一个数据需要被监听并且对数据做一些操作就用 watch (不建议 一直监听会浪费性能)

#### 2.5 query和params

**区别**
1、query用path编写传参地址，而params用name编写传参地址；
2、query刷新页面时参数不会消失，而params刷新页面时参数会消失；
3、query传的参数会显示在url地址栏中，而params传参不会显示在地址栏中。

***vue中query和params的区别是什么***

query语法：

```
this.$router.push({path:“地址”,query:{id:“123”}}); //这是传递参数
this.$route.query.id； //这是接受参数
```

params语法：

```
this.$router.push({name:“地址”,params:{id:“123”}}); //这是传递参数
this.$route.params.id; //这是接受参数
```

区别：
1.首先就是写法得不同，query 得写法是 用 path 来编写传参地址，而 params 得写法是用 name 来编写传参地址，你可以看一下编写路由时候得相关属性，你也可以输出一下 路由对象信息 看一下
2.接收方法不同， 一个用 query 来接收， 一个用 params 接收 ，总结就是谁发得 谁去接收
3.query 在刷新页面得时候参数不会消失，而 params 刷新页面得时候会参数消失，可以考虑本地存储解决
4.query 传得参数都是显示在url 地址栏当中，而 params 传参不会显示在地址栏

#### 2.6 $route和$router的区别

$router是用来操作路由的，$route是用来获取路由信息的。

##### 2.6.1 $router是VueRouter的一个实例

他包含了所有的路由，包括路由的跳转方法，钩子函数等，也包含一些子对象（例如history）
常用的跳转连接的方法：

```javascript
// 常规方法
this.$router.push("/login");
// 使用对象的形式 不带参数
this.$router.push({ path:"/login" });
// 使用对象的形式，参数为地址栏上的参数
this.$router.push({ path:"/login",query:{username:"jack"} }); 
使用对象的形式 ，参数为params 不会显示在地址栏
this.$router.push({ name:'user' , params: {id:123} });
```

本质是向history栈中添加一个路由，在我们看来是切换路由，但本质是在添加一个history记录

##### 2.6.2 $route是一个跳转的路由对象（路由信息对象）

每一个路由都会有一个$route对象，是一个局部的对象

1.$route.path
字符串，等于当前路由对象的路径，会被解析为绝对路径，如 “/home/news” 。

2.$route.params
对象，包含路由中的动态片段和全匹配片段的键值对。

3.$route.query对象，包含路由中查询参数的键值对。例如，对于 /home/news/detail/01?favorite=yes ，会得到route.query.favorite == ‘yes‘ 。

4.$route.router
路由规则所属的路由器（以及其所属的组件）。

5.$route.matched
数组，包含当前匹配的路径中所包含的所有片段所对应的配置参数对象。

6.$route.name
当前路径的名字，如果没有使用具名路径，则名字为空。

```html
<div>
	<p>当前路径：{{$route.path}}</p>
	<p>当前参数：{{$route.params | json}}</p>
	<p>路由名称：{{$route.name}}</p>
	<p>路由查询参数：{{$route.query | json}}</p>
	<p>路由匹配项：{{$route.matched | json}}</p>
</div>
```

#### 2.7  vue-router的导航钩子

vue-router有三种导航钩子

-   全局的
-   单个路由独享的
-   组件级的

##### 2.7.1 全局导航钩子

全局导航钩子主要有两种钩子：前置守卫（router.beforeEach）、后置钩子（router.afterEach），

注册一个全局前置守卫：

```javascript
const router = new VueRouter({ ... });
router.beforeEach((to, from, next) => {
  // do someting
});
```

这三个参数 to 、from 、next 分别的作用：

1.to: Route，代表要进入的目标，它是一个路由对象

2.from: Route，代表当前正要离开的路由，同样也是一个路由对象

3.next: Function，这是一个必须需要调用的方法，而具体的执行效果则依赖 next 方法调用的参数

注意：next 方法必须要调用，否则钩子函数无法 resolved

对于全局后置钩子：

```javascript
router.afterEach((to, from) => {
  // do someting
});
```

不同于前置守卫，后置钩子并没有 next 函数，也不会改变导航本身

##### 2.7.2 路由独享的钩子

顾名思义，即单个路由独享的导航钩子，它是在路由配置上直接进行定义的：

```javascript
const router = new VueRouter({
  routes: [
	{
        path: '/file',
        component: File,
        beforeEnter: (to, from ,next) => {
            // do someting
        }
    }
  ]
});
```

至于他的参数的使用，和全局前置守卫是一样的

##### 2.7.3 组件内的导航钩子

组件内的导航钩子主要有这三种：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave。他们是直接在路由组件内部直接进行定义的
我们看一下他的具体用法：

```javascript
const File = {
	template: `<div>This is file</div>`,
    beforeRouteEnter(to, from, next) {
        // do someting
        // 在渲染该组件的对应路由被 confirm 前调用
    },
    beforeRouteUpdate(to, from, next) {
        // do someting
        // 在当前路由改变，但是依然渲染该组件是调用
  	},
    beforeRouteLeave(to, from ,next) {
        // do someting
        // 导航离开该组件的对应路由时被调用
    }
}
```

需要注意是：

beforeRouteEnter 不能获取组件实例 this，因为当守卫执行前，组件实例被没有被创建出来，剩下两个钩子则可以正常获取组件实例 this

但是并不意味着在 beforeRouteEnter 中无法访问组件实例，我们可以通过给 next 传入一个回调来访问组件实例。在导航被确认是，会执行这个回调，这时就可以访问组件实例了，如：

```javascript
beforeRouteEnter(to, from, next) {
  next (vm => {
  	// 这里通过 vm 来访问组件实例解决了没有 this 的问题
  })
}
```

注意，仅仅是 beforRouteEnter 支持给 next 传递回调，其他两个并不支持。因为归根结底，支持回调是为了解决 this 问题，而其他两个钩子的 this 可以正确访问到组件实例，所有没有必要使用回调

##### 2.7.4 最后是完整的导航解析流程：

1、导航被触发

2、在失活的A组件里调用离开守卫

3、调用全局的 beforeEach 守卫

4、在重用的组件里调用 beforeRouteUpdate 守卫

5、在路由配置里调用B组件 beforEnter

```javascript
const router = new VueRouter({
  routes: [
	{
        path: '/b',
        component: B,
        beforeEnter: (to, from ,next) => {
            // do someting
        }
    }
  ]
});
```

6、解析异步路由组件

7、在被激活的组件里调用 beforeRouteEnter

8、调用全局的 beforeResolve守卫(2.5+)，router.beforeResolve

9、导航被确认

10、调用全局的 afterEach 钩子，router.afterEach

11、触发 DOM 更新

12、在创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数

#### 2.8 vue实例生命周期

​		Vue实例的生命周期就是Vue实例从创建到销毁的全过程。在这个过程中，经历了创建、初始化数据、编译模板、挂载Dom(beforeCreate(){}、created(){}、beforeMount(){}、mounted(){})、渲染→更新→渲染(beforeUpdate(){}、updated(){})、卸载(beforeDestroy(){}、destroyed(){})等阶段。
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/vue%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.png" alt="vue生命周期" style="zoom: 50%;" />

##### 2.8.1 生命周期函数三个阶段

-   实例化期和加载期
    创建期间的生命周期函数：
    1)   beforeCreate表示实例完全被创建出来之前，会执行beforeCreate函数，这时data 和 methods 中的 数据都还没有没初始化，**如果调用data和methods的数据的话，会报错**。
    2)   created实例已经在内存中创建OK，此时 data 和 methods 已经创建OK，此时还没有开始 编译模板。
    3)   beforeMount此时已经完成了模板的编译，但是还没有从内存挂载到页面中。
         **注意：在 beforeMount 执行的时候，页面中的元素，还没有被真正替换过来，只是之前写的一些模板（比如插值表达式）还只是字符串的形式。**
    4)   mounted 此时，已经将编译好的模板，挂载到了页面指定的容器中显示。

-   更新期
    运行期间的生命周期函数：
    1.   beforeUpdate data数据更新之后，但是还未渲染到页面时执行的函数。**这时data数据已经更新，但是页面的数据还是旧的。**
    2.   updated updated 事件执行的时候，页面和 data 数据已经保持同步了，都是最新的。

-   卸载期
    销毁期间的生命周期函数：
    1.   beforeDestroy实例销毁之前调用。在这一步，实例上的data，methods等仍然完全可用。
    2.   destroyed Vue实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。

```javascript
export let User = {
    data(){
        return {
            username: "zhuiszhu",
            count : 0
        }
    },
    template : `
        <div>
            <h3 id="test">{{username}}</h3>
            <p>用户中心页页面内容</p>
            <p>{{count}}</p>
            <button @click="add">+</button>
        </div>
    `,
    methods : {
        add(){
            this.count ++
        }
    },
    // 声明周期函数
    beforeCreate(){
        console.log(this.username)
    },
    created(){
        console.log(this.username)
    },
    beforeMount(){
        let dom = document.getElementById("test")
        // console.log(dom)
    },
    mounted(){
        let dom = document.getElementById("test")
        // console.log(dom)
    },
    beforeUpdate(){
        // console.log("组件即将发生更新")
    },
    updated(){
        // console.log("组件已经发生更新")
    },
    beforeDestroy(){
        // console.log("组件即将被卸载")
    },
    destroyed(){
        // console.log("组件已经被卸载")
    }
}
```

#### 2.9 vuex的五个核心属性

VueX五个核心属性分别是 state、getter，mutations、actions、module

-   state: 定义vuex的数据地方

-   actions:定义异步延迟的方法

-   mutations: 唯一可以修改state数据的方法

-   getters:从现有state数据计算出新的数据， 类似于vue组件中的计算属性，对state数据进行计算（会被缓存）

-   modules:模块化管理store（仓库），每个模块拥有自己的 state、mutation、action、getter

<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2818032-20230215110412812-2122664000.png" alt="img" style="zoom: 50%;" />

##### 2.9.1 state存放公共数据

状态state用于存储所有组件的数据。
```javascript
state: {
    // 定义vuex中的数据
    cartNum: 10,
},
```

总结：

1.  state中的数据是自定义的，但是state属性名是固定的
2.  获取数据可以通过 $store.state
3.  可以使用计算属性优化模板中获取数据的方式
4.  计算属性不可以使用箭头函数（箭头函数本身是没有this的，实际上用的是父级函数中的this）

##### 2.9.2 getters计算属性，对state里的变量进行过滤

getters:从现有state数据计算出新的数据
```javascript
//在组件中调用
$store.getters.fee
// 相当于state的计算属性（基于State处理成另外一份数据）
// getters的主要应用场景：模板中需要的数据和State中的数据不完全一样
// 需要基于state中的数据进行加工处理，形成一份新的的数据，给模板使用
getters: {
    // 从现有数据计算新的数据 每个商品佣金是0.5元
    // fee佣金会跟随cartNum变化而变化
    fee:function(state){
        return state.cartNum*0.5;
    }
},
```

在调用时，使用$store.getters.方法名，如$store.getters.powerCounter即可
```javascript
// 使用getters
caleList () {
    // 注意：获取getters的值，不需要加括号（当属性使用）
    return this.$store.getters.getPartList
},
```

总结：

1.  getters相当于在State和组件之间添加一个环节（对state中的数据进行加工处理后再提供给组件）
2.  getters不要修改state中的数据
3.  getters类似之前的计算属性（基于state中的数据进行计算）

##### 2.9.3 mutations唯一可以改变state数据的工具，相当于vue里的methods

mutations:定义修改数据的方法

 

目标：Vuex规定必须通过mutation修改数据，不可以直接通过store修改状态数据。

为什么要用mutation方式修改数据？Vuex的规定

为什么要有这样的规定？统一管理数据，便于监控数据变化

1.   vuex的store状态的唯一更新方式

     提交mutations
     mutations主要包括两部分：

-   字符串的事件类型
-   一个回调函数，该回调函数的第一个参数就是state

```javascript
mutations: {
    // 修改state数据必须在mutations中的方法
    // 方法名建议大写
    SET_CART_NUM(state,data){
        // 修改cartNum的值
        state.cartNum = data;
    }
},
```

2.   在组件中访问mutations的方法

     $store.commit('SET_CART_NUM',100)

```html
<p>购物车数量:{{$store.state.cartNum}}</p>
<button @click="$store.commit('SET_CART_NUM',100)">修改为100</button>
<button @click="$store.commit('SET_CART_NUM',$store.state.cartNum+1)">修改+1</button><br>
```

总结：
先定义（mutations），再出发 this.$store.commit(‘mutation的名称，参数’)
mutation的本质就是方法，方法名称自定义，mutation函数内部负责处理的变更操作。
一种操作就是一个mutation，不同的mutation处理不同的场景。

##### 2.9.4 actions异步操作

先定义（mutations），再出发 this.$store.commit(‘mutation的名称，参数’)
mutation的本质就是方法，方法名称自定义，mutation函数内部负责处理的变更操作。
一种操作就是一个mutation，不同的mutation处理不同的场景。
**先安装axios的包**

```javascript
npm i axios
// 导入包
import axios from 'axios'
```

**再定义获取数据方法**

```javascript
actions: {
 
    // actions是固定的，用于定义异步,网络延迟等方法
    // 只能调用mutations,不能直接修改state
    getCartNum(context,data){
        // 可以执行网络请求,等待延迟
        setTimeout(()=>{
            // 等待4秒后执行mutations的 SET_CART_NUM方法
            context.commit("SET_CART_NUM",data);//修改了cartNum的值为1
        },4000)
    }
},
```

-   mutation中的方法用commit回调
-   actions中的方法用dispatch回调
-   state里的状态只能在mutation中更改

总结：

1.  原始方式：this.$store.dispatch(‘queryData’, num)
2.  简化方式一：对象
3.  简化方式二：数组

##### 2.9.5 modules模块化

modules: 模块化vuex，可以让每一个模块拥有自己的 state、mutation、action、 getters，使得结构非常清晰，方便管理。

注意：style上加scoped属性的原理
在 Vue 组件中，为了使样式模块化，不对全局造成污染，可以在style 标签上添加 scoped 属性以表示它的只属于当下的模块，局部有效。
结合实际:我们做的后管系统设置头像图片样式的时候,不加scoped属性就会影响全局样式

#### 2.10 v-bind与v-model的区别

##### 2.10.1 v-model原理

vue数据的双向绑定是通过数据劫持结合发布者-订阅者模式的方式来实现的。其核心就是通过Object.defineProperty()方法设置set和get函数来实现数据的劫持,在数据变化时发布消息给订阅者,触发相应的监听回调。也就是说数据和视图同步,数据发生变化,视图跟着变化,视图变化,数据也随之发生改变。

##### 2.10.2 v-bind与v-model的区别

1、v-bind是单向绑定，用来绑定数据和属性以及表达式，数据只能从data流向页面。

2、v-model是双向绑定，数据能从data流向页面，也能从页面流向data。

3、v-bind可以给任何属性赋值，v-model只能给表单类，也就是具有value属性的元素进行数据双向绑定，如text、radio、checkbox、selected。

这个原因也很好理解，从页面流向data，v-model是捕获用户的输入值，如果没有value,捕获不了，所以这个流向没有意义，v-model就是收集value值。

例子：

使用v-bind单向绑定

修改data中的值，文本框也会变 使用v-model双向绑定

文本框的内容变化，data中的值也会变，反之如此；同时单向文本框的内容也会变化，因为data变化了。 

```javascript
<body>
    <div id="root">
        <!-- 简写 -->
        单向数据绑定<input type="text" name="" id="" :value='name'><br />
        双向数据绑定<input type="text" name="" id="" v-model='name'>
    </div>
    <script>
        new Vue({
            el: '#root',
            data: {
                name: '单向数据绑定与双向'
 
            }
        })
    </script>
</body>
```

#### 2.11 Vue中的常见指令有那些

Vue 中提供了14个比较常用的指令，如

1.   v-model ：双向数据绑定，

表单元素常用 input select radio checkbox textarea 等，v-model有三个修饰符，例如input元素 v-model.trim去掉输入值的前后空格和v-model.number，将输入的字符串转换为number,v-model.lazy 输入的数据不再实时更新，而是数据失去焦点的时候再更新输入的数据

2.   v-show： 元素的显示和隐藏，

频繁操作元素的显示和隐藏，就用v-show ,原理是操作的dom 的css样式 display的值是true还是false

3.   v-if：

元素的显示和隐藏，原理是，是否创建元素的dom,例如表格中某条数据是否显示编辑，删除按钮，由后台传的数据解决的，这种不频繁操作的情况可用v-if，v-if 可以加入template标签中判断 v-show 不可以

4.   v-else ： 和v-if 搭配使用

5.   v-else-if ：条件满足v-if ？

不满足判断v-else-if 如果还不满足直接走v-else 这个的使用方式和我们的js 中的 if ，else if() ，else 是类似的使用方式

6.   v-bind： 绑定

 v-bind:class v-bind:style v-bind:attribute v-bind可以省略成：最后写成 ：class :style :attribute

7.   v-on ：绑定常用事件

 下面的常用事件去掉on 改为@click：点击某个对象时触发@clickondblclick：双击某个对象时触发@dblclickonmouseover：鼠标移入某个元素时触发@mouseoveronmouseout：鼠标移出某个元素时触发@mouseoutonmouseenter：鼠标进入某个元素时触发@onmouseenter

$event

vue 提供了名为**$event** 的特殊变量，用来表示原生的事件参数对象 event。$event 可以解决事件参数对象event 被覆盖的问题。
```javascript
<button @click="addCount(2, $event)">+2</button>
<script>
    const vm = new Vue({
        ...
        methods: {
            addCount(step, e) {
                ...
            },
        },
    })
</script>
```

事件修饰符

在事件处理函数中调用**preventDefault()** 或 **stopPropagation()** 是非常常见的需求。

因此，vue 提供了**事件修饰符**的概念，来辅助程序员更方便的对事件的触发进行控制。

在Vue中，有**5个**较为常用的事件修饰符：
![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/d2a94f58b2704f2898bfede261893f4d.png)

8.   v-for：项目中常用循环数组的指令。
     key使用的注意事项
     key 的值只能是字符串或数字类型
     key 的值必须具有唯一性（即：key 的值不能重复）
     建议把数据项 id 属性的值作为key 的值（因为 id 属性的值具有唯一性）
     使用 index 的值当作key 的值没有任何意义（没有任何意义！）
     建议使用 v-for 指令时一定要指定key 的值（既提升性能、又防止列表状态紊乱）

9.   v-html ：将字符串html 转换为结构显示，

项目中基本不这种方式去处理，涉及到安全性问题

10.   v-text：防止为了{{}} 闪烁问题 项目不常用

11.   v-once： 指令指的是元素仅仅绑定一次，只是渲染一次

12.   v-cloak：指的是cloak 等元素编译结束以后才会显示dom

13.   v-pre :跳过当前元素及子元素的编译过程，先进行编译

14.   v-slot：插槽

#### 2.12 三种this指向的方法——call()、bind()、apply()

##### 2.12.1 call()方法

在 JavaScript 中，`call()` 方法用于调用一个函数，可以指定函数体内 `this` 对象的值。这里的 `this` 指的是函数执行时所在的上下文对象，也就是函数执行时所处的环境，同时可以传递参数列表来执行函数。

`call()` 方法接受的第一个参数是要绑定给 `this` 的值，后面的参数是传递给函数的参数列表。通过 `call()` 方法，可以改变函数内部 `this` 的指向，并且立即执行函数。

以下是 `call()` 方法的语法：

```js
functionName.call(thisArg, arg1, arg2, ...)
```

-   `functionName`：要调用的函数名称。
-   `thisArg`：函数执行时绑定的 `this` 值，即函数内部的上下文对象。
-   `arg1, arg2, ...`：要传递给函数的参数列表。

当**调用 `call()` 方法时，它会立即执行函数**，并将指定的 `thisArg` 绑定到函数内部的 `this` 上下文。这意味着函数内部的 `this` 将引用 `thisArg` 所指定的对象。

另外，`call()` 方法还可以**接受多个参数作为函数的参数列表，并依次传递给函数**。

下面是一个使用 `call()` 方法的简单例子：

```js
const person = {
  fullName: function() {
    return this.firstName + " " + this.lastName;
  }
}

const person1 = {
  firstName: "John",
  lastName: "Doe"
}

const person2 = {
  firstName: "Mary",
  lastName: "Doe"
}

// 使用 call() 方法指定 person1 作为函数内部的 this 对象
const fullName1 = person.fullName.call(person1); // 返回 "John Doe"

// 使用 call() 方法指定 person2 作为函数内部的 this 对象
const fullName2 = person.fullName.call(person2); // 返回 "Mary Doe"
```

在上面的例子中，`call()` 方法被用于在不同的上下文中调用 `person.fullName()` 函数。通过使用 `call()` 方法，我们可以指定函数内部 `this` 的值，并且让函数在不同的上下文中执行，从而达到我们的目的。

使用 `call()` 方法的主要场景包括：

-   **显式**设置函数内部的 `this` 上下文。
-   在借用其他对象的方法时，将当前对象作为 `this` 上下文。
-   调用函数并传递参数列表。

>   总结：`call()` 方法用于调用一个函数并设置函数内部的 `this` 值。它接受一个对象作为 `thisArg`，将该对象绑定到函数内部的 `this` 上下文，并可以传递参数列表给函数。这个方法常用于显式设置函数的执行上下文和借用其他对象的方法。

##### 2.12.2 bind()方法

`bind()` 方法是 JavaScript 中的一个内置函数，用于**创建一个新的函数**，这个新函数与原函数绑定了指定的 `this` 对象和部分参数，并且在调用时这些参数会被预先传入。`bind()` 方法的语法如下：

```js
functionName.bind(thisArg, arg1, arg2, ...)
```

-   `functionName`：要绑定上下文的函数名称。
-   `thisArg`（必选参数）：函数执行时绑定的 `this` 值，即函数内部的上下文对象。
-   `arg1, arg2, ...`（可选参数）：要预设的参数列表。

**`bind()` 方法会返回一个新的函数**，该新函数的 `this` 值被永久地绑定到 `thisArg` 所指定的对象。当调用这个新函数时，它会以指定的上下文执行，并将预设的 `arg1`、`arg2` 等参数预先传入新函数。

使用 `bind()` 方法，**可以实现改变函数内部的 `this` 指向**，以及部分参数的预先传入。这个方法在一些特定的场景下非常有用，比如**在回调函数中使用**，可以解决 `this` 指向问题。例如：

示例一：

```js
var person = {
    name: "John",
    greet: function (message) {
        console.log(message + ", " + this.name);
    },
};

var anotherPerson = {
    name: "Ben",
};

var boundGreet = person.greet.bind(person, "Hello");
boundGreet(); // 输出：Hello, John

var boundGreet = person.greet.bind(anotherPerson, "Hello");
boundGreet(); // 输出：Hello, Ben
```

示例二：

```js
const obj = {
	name: 'Tom',
	sayHi() {
 		console.log(`Hi, my name is ${this.name}`);
	},
};

// 在回调函数中使用 bind() 方法改变 sayHi() 函数内部的 this 指向
setTimeout(obj.sayHi(), 1000); // 立即执行 输出：Hi, my name is Tom
setTimeout(obj.sayHi.bind(obj), 1000); // 1s后执行 输出：Hi, my name is Tom
```

上面代码直接用 setTimeout(obj.sayHi(), 1000); 不也可以，为什么还要加上bind()

>   上面代码直接使用`setTimeout(obj.sayHi(), 1000)`会立即调用`obj.sayHi()`函数，并把它的返回值作为第一个参数传递给`setTimeout()`函数，相当于`setTimeout(undefined, 1000)`。所以实际上是没有等待1秒后再执行`sayHi()`的效果的。
>
>   而`setTimeout(obj.sayHi.bind(obj), 1000)`中，`bind()`方法会返回一个绑定了`obj`作为上下文的新函数，并不会立即调用。所以`setTimeout()`函数会等待1秒后再调用这个新函数，保证了1秒后再执行`sayHi()`函数。

又例如，预先传入部分参数的情况：

```js
function add(x, y) {
  return x + y;
}

// 使用 bind() 方法预先传入参数 1，得到一个新的函数
const addOne = add.bind(null, 1);

console.log(addOne(2)); // 输出：3
```

在上面的例子中，使用 `bind()` 方法预先传入了参数 `1`，得到一个新的函数 `addOne`，在调用这个新函数时，只需要再传入一个参数 `2`，即可完成 `1 + 2` 的操作。

##### 2.12.3 apply方法

`apply()` 方法是 JavaScript 中的一个函数方法，用于在特定的作用域中调用函数，**并将参数以数组形式传递**。

语法：

```js
function.apply(thisArg, [argsArray])
```

参数说明：

-   `thisArg`：可选参数，指定函数执行时的作用域对象。在函数内部使用 `this` 关键字时，将引用该参数指定的对象。如果省略或传入 `null` 或 `undefined`，则在调用时使用全局对象（通常是 `window` 对象）作为作用域。
-   `argsArray`：可选参数，一个数组或类数组对象，包含传递给函数的参数。如果省略或传入 `null` 或 `undefined`，则表示不传递任何参数。

使用 `apply()` 方法可以实现以下功能：

1.  在特定作用域中调用函数：通过指定 `thisArg` 参数，可以在特定对象的作用域中执行函数，修改函数内部的 `this` 引用。
2.  传递参数数组：将参数以数组形式传递给函数，可以方便地在调用函数时动态传递参数。

示例：

```js
function greet(name, age) {
  console.log(`Hello, ${name}! You are ${age} years old.`);
}

const person = {
  name: 'Alice',
  age: 25
};

greet.apply(person, ['Bob', 30]);
// 输出：Hello, Bob! You are 30 years old.
// 相当于在person对象作用域里面打印了 "Hello, Bob! You are 30 years old." 打招呼的话
```

在上面的示例中，我们定义了一个 `greet` 函数用于打招呼，接受一个 `name` 参数和一个 `age` 参数。然后，我们创建了一个 `person` 对象，包含 `name` 和 `age` 属性。通过使用 `apply()` 方法，我们将 `person` 对象作为函数调用的作用域，并传递一个包含 `'Bob'` 和 `30` 的参数数组。最终，函数在 `person` 对象的作用域中执行，并输出相应的结果。

##### 2.12.4 apply和call的区别

需要注意的是，`apply()` 方法和 `call()` 方法的作用类似，**唯一的区别是参数的传递方式不同。`apply()` 方法使用数组形式传递参数，而 `call()` 方法使用逐个参数传递。**

##### 2.12.5 apply()其他应用场景

当使用 `apply()` 方法时，还可以在某些情况下提供更灵活和动态的函数调用。以下是一些使用 `apply()` 方法的其他例子：

1.  动态改变函数的上下文：

    ```js
    function greet() {
      console.log(`Hello, ${this.name}!`);
    }
    
    const person1 = { name: 'Alice' };
    const person2 = { name: 'Bob' };
    
    greet.apply(person1); // 输出：Hello, Alice!
    greet.apply(person2); // 输出：Hello, Bob!
    ```

    通过使用 `apply()` 方法，可以动态地将不同的对象作为函数调用的上下文（`this`）。

2.  数组操作：

    ```js
    const numbers = [1, 2, 3, 4, 5];
    const max = Math.max.apply(null, numbers);
    const min = Math.min.apply(null, numbers);
    
    // const max = Math.max(...numbers);
    // const min = Math.min(...numbers);
    
    console.log(max); // 输出：5
    console.log(min); // 输出：1
    ```

    在这个例子中，通过使用 `apply()` 方法，将数组作为参数传递给 `Math.max()` 和 `Math.min()` 函数，从而得到数组中的最大值和最小值。

3.  配合 `arguments` 对象使用：

    ```js
    function sum() {
      // 将 arguments 对象转换为真正的数组
      const argsArray = Array.prototype.slice.call(arguments);
        
      // 使用 reduce 方法对数组中的元素进行累加求和，初始值为 0
      return argsArray.reduce((total, num) => total + num, 0);
      // 这里传入的实参0是可选参数initialValue，用于指定累积的初始值
      // 如果没有提供初始值，则将使用数组的第一个元素作为初始值，并从第二个元素开始进行迭代。
      // 所以不写也是OK的，结果相同
    }
    
    const numbers = [1, 2, 3, 4, 5];
    
    // 使用 apply 方法将 numbers 数组作为参数传递给 sum 函数，并执行求和操作
    const result = sum.apply(null, numbers);
    
    console.log(result); // 输出：15
    ```

    在这个例子中，`sum()` 函数接收任意数量的参数，并使用 `apply()` 方法将参数数组传递给函数。通过将 `arguments` 对象转换为真正的数组，我们可以对参数进行操作，例如在此例中计算它们的总和。

总之，`apply()` 方法提供了一种动态调用函数的方式，并且在某些情况下非常有用，**特别是在需要改变函数上下文、操作数组或处理不定数量的参数时。

#### 2.13 vue-router中路由的二种模式hash和history

在vue的脚手架项目中,想必大家都会用到`vue-router`,`vue-router`是`vue.js`官方推出的一个管理路由的包。它集成了嵌套路由映射、动态路由选择、HTML5 API等等一系列的功能，让我们能够很轻松的管理一个SPA应用的路由。下面让我们一起来看看`vue-router`中的几种路由模式。

##### 2.13.1 hash模式

当我们使用`vue-router`的`hash`模式时,浏览器地址栏上的链接会包含一个`#`号,这个`#`号后面的内容被称之为`hash值`。 这个`hash值`有几个特点:

1.  `https`请求不会包含`hash值`内容
2.  改变`hash值`页面不会被刷新
3.  改变`hash值`会生成新的浏览器历史记录 那么我们如何改变`hash值`呢？我们可以使用浏览器API中的 `window.location.hash`来获取。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ee76736c05f48e5951a45480fe22f34~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

------

当然 我们也可以用`window.location.hash`来修改`hash值` ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bd384f3c31340819f4fead2a95433fa~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) 我们发现浏览器地址栏上`#`后面的`hash值`改变成了视频

有时候我们可能希望当浏览器地址栏的`hash值`发生改变的时候进行一些逻辑操作。此时我们可以使用

`onhashchange`事件进行处理。 `onhashchange`一共有三种使用方法:

```javascript
//浏览器对象上的方法
window.onhashchange =  ()=>{   // dosomething }
//在body标签上添加onhashchange方法
<body onhashChange="func();"></body>
// 使用事件监听
window.addEventListener("hashchange", func, false);
```

下图是用事件监听获取到的结果:

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90896c80a1f6496998ca17141854be63~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

我们可以从监听获取的回调函数中得到地址栏变更前后的地址。

------

`hash值`对于浏览器来说是很重要的,除了上面所说的切换视图,我们还可以使用`hash值`来进行锚点操作

```javascript
<a name='header-2'></a>
```

当页面中存在`name`为`header-2`的标签时，页面或自动滚动到`header-2`所在的地方 并且浏览器地址栏`#`后面的内容也会变为`header-2`

**值得注意的是:当项目中使用hash路由时，锚点功能是无法正常使用的。**

##### 2.13.2 history模式

`vue-router`中`history`模式的部分实现使用了`html5`新增的`pushState()`和`replaceState()`,这两个方法均来自于`window.history`,它的作用是添加或者替换浏览器历史记录中的条目。

`pushState()`接受3个参数`pushState(stateObj,title,url)`:

1.  `stateObj`:状态对象。状态对象简言之就是一个对象。该参数最大能接受一个被序列化之后有640kb的对象，这个序列化的对象最终保存在用户的电脑磁盘中。我们可以使用 `window.history.state` 获取到这个状态对象
2.  `title`:标题。作用不大，可以传空字符串。
3.  `url`:给浏览器历史记录添加一条新的条目。 该路径可以是相对路径也可以是绝对路径

```javascript
history.pushState({foo:"bar"}, "page 2", "bar.html");
```

当我们打开百度首页并在浏览器`console`中执行该代码时，浏览器的地址栏发生了改变, 从`baidu.com`变成了`baidu.com/more`,但页面并没有刷新。

我们在浏览器`console`输入`history.state` 结果:  `console`打印出了 `{foo: "bar"}`

------

`replaceState()`和`pushState()`接受的参数一模一样。它们的区别就在于一个新增一条历史记录的条目，一个是替换一条历史记录的条目。

当然 `vue-router`的`history`模式中并不是仅仅只用到了这两个`api`。`vue-router`继承了`history`对象的所有api。比如我们经常用到的`$router.go(-1)`, 返回到上一级页面~。这个方法实则是`history`对象中的`go()`方法

有关`window.history`相关的API具体可以参考[MDN文档](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FHistory_API)

##### 2.13.3 hash和history方式的优缺点

**hash方式**

优点:由于发送`https`请求时不会带上`hash值`,因此无论是刷新页面或者改变`hash值`都不会影响到服务器端。

缺点:

1.  当使用`hash值`做路由时，锚点功能就失效了
2.  `hash`方式传递参数的限制是基于浏览器url最大参数限制的。
3.  `hash`方式导致浏览器地址栏出现`#`不美观 **history方式**

优点:

1.  很方便的获取到传递的参数。并且能传递最大640kb的对象
2.  后端也能很方便的获取到路由的地址 缺点:
3.  F5刷新页面可能会导致页面404,前端url必须与发送到服务器请求的url相同
4.  改变url地址后,会重新请求服务器。

#### 2.14 Vue响应式原理

数据发生变化后，会重新对页面渲染，这就是Vue响应式，那么这一切是怎么做到的呢？

想完成这个过程，我们需要：

-   侦测数据的变化
-   收集视图依赖了哪些数据
-   数据变化时，自动“通知”需要更新的视图部分，并进行更新

对应专业俗语分别是：

-   数据劫持 / 数据代理
-   依赖收集
-   发布订阅模式

```如何侦测数据的变化```

首先有个问题，在Javascript中，如何侦测一个对象的变化？ 其实有两种办法可以侦测到变化：使用`Object.defineProperty`和ES6的`Proxy`，这就是进行数据劫持或数据代理。这部分代码主要参考珠峰架构课。

##### 2.14.1 Object.defineProperty实现

Vue通过设定对象属性的 setter/getter 方法来监听数据的变化，通过getter进行依赖收集，而每个setter方法就是一个观察者，在数据变更的时候通知订阅者更新视图。

```javascript
function render () {
  console.log('模拟视图渲染')
}
let data = {
  name: '浪里行舟',
  location: { x: 100, y: 100 }
}
observe(data)
function observe (obj) { // 我们来用它使对象变成可观察的
  // 判断类型
  if (!obj || typeof obj !== 'object') {
    return
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
  function defineReactive (obj, key, value) {
    // 递归子属性
    observe(value)
    Object.defineProperty(obj, key, {
      enumerable: true, //可枚举（可以遍历）
      configurable: true, //可配置（比如可以删除）
      get: function reactiveGetter () {
        console.log('get', value) // 监听
        return value
      },
      set: function reactiveSetter (newVal) {
        observe(newVal) //如果赋值是一个对象，也要递归子属性
        if (newVal !== value) {
          console.log('set', newVal) // 监听
          render()
          value = newVal
        }
      }
    })
  }
}
data.location = {
  x: 1000,
  y: 1000
} //set {x: 1000,y: 1000} 模拟视图渲染
data.name // get 浪里行舟
```

上面这段代码的主要作用在于：`observe`这个函数传入一个 `obj`（需要被追踪变化的对象），通过遍历所有属性的方式对该对象的每一个属性都通过 `defineReactive` 处理,以此来达到实现侦测对象变化。值得注意的是，`observe` 会进行递归调用。 那我们如何侦测Vue中`data` 中的数据，其实也很简单：

```javascript
class Vue {
    /* Vue构造类 */
    constructor(options) {
        this._data = options.data;
        observer(this._data);
    }
}
```

这样我们只要 new 一个 Vue 对象，就会将 `data` 中的数据进行追踪变化。 不过这种方式有几个注意点需补充说明：

-   **无法检测到对象属性的添加或删除**(如`data.location.a=1`)。

这是因为 Vue 通过`Object.defineProperty`来将对象的key转换成`getter/setter`的形式来追踪变化，但`getter/setter`只能追踪一个数据是否被修改，无法追踪新增属性和删除属性。如果是删除属性，我们可以用`vm.$delete`实现，那如果是新增属性，该怎么办呢？ 1）可以使用 `Vue.set(location, a, 1)` 方法向嵌套对象添加响应式属性; 2）也可以给这个对象重新赋值，比如`data.location = {...data.location,a:1}`

-   **`Object.defineProperty` 不能监听数组的变化，需要进行数组方法的重写**，具体代码如下：

```javascript
function render() {
  console.log('模拟视图渲染')
}
let obj = [1, 2, 3]
let methods = ['pop', 'shift', 'unshift', 'sort', 'reverse', 'splice', 'push']
// 先获取到原来的原型上的方法
let arrayProto = Array.prototype
// 创建一个自己的原型 并且重写methods这些方法
let proto = Object.create(arrayProto)
methods.forEach(method => {
  proto[method] = function() {
    // AOP
    arrayProto[method].call(this, ...arguments)
    render()
  }
})
function observer(obj) {
  // 把所有的属性定义成set/get的方式
  if (Array.isArray(obj)) {
    obj.__proto__ = proto
    return
  }
  if (typeof obj == 'object') {
    for (let key in obj) {
      defineReactive(obj, key, obj[key])
    }
  }
}
function defineReactive(data, key, value) {
  observer(value)
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      observer(newValue)
      if (newValue !== value) {
        render()
        value = newValue
      }
    }
  })
}
observer(obj)
function $set(data, key, value) {
  defineReactive(data, key, value)
}
obj.push(123, 55)
console.log(obj) //[1, 2, 3, 123,  55]
```

ES6提供了元编程的能力，所以有能力拦截，Vue3.0可能会用ES6中Proxy 作为实现数据代理的主要方式。

##### 2.14.2 Proxy实现

`Proxy` 是 JavaScript 2015 的一个新特性。**`Proxy`  的代理是针对整个对象的，而不是对象的某个属性**，因此不同于 `Object.defineProperty` 的必须遍历对象每个属性，`Proxy`  只需要做一层代理就可以监听同级结构下的所有属性变化，当然对于深层结构，递归还是需要进行的。此外**`Proxy`支持代理数组的变化。

```javascript
function render() {
  console.log('模拟视图的更新')
}
let obj = {
  name: '前端工匠',
  age: { age: 100 },
  arr: [1, 2, 3]
}
let handler = {
  get(target, key) {
    // 如果取的值是对象就在对这个对象进行数据劫持
    if (typeof target[key] == 'object' && target[key] !== null) {
      return new Proxy(target[key], handler)
    }
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    if (key === 'length') return true
    render()
    return Reflect.set(target, key, value)
  }
}

let proxy = new Proxy(obj, handler)
proxy.age.name = '浪里行舟' // 支持新增属性
console.log(proxy.age.name) // 模拟视图的更新 浪里行舟
proxy.arr[0] = '浪里行舟' //支持数组的内容发生变化
console.log(proxy.arr) // 模拟视图的更新 ['浪里行舟', 2, 3 ]
proxy.arr.length-- // 无效
```

以上代码不仅精简，而且还是实现一套代码对对象和数组的侦测都适用。不过`Proxy`兼容性不太好！

```为什么要收集依赖```

我们之所以要观察数据，其目的在于当数据的属性发生变化时，可以通知那些曾经使用了该数据的地方。比如第一例子中，模板中使用了price 数据，当它发生变化时，要向使用了它的地方发送通知。那如果多个Vue实例中共用一个变量，如下面这个例子：

```javascript
let globalData = {
    text: '浪里行舟'
};
let test1 = new Vue({
    template:
        `<div>
            <span>{{text}}</span> 
        <div>`,
    data: globalData
});
let test2 = new Vue({
    template:
        `<div>
            <span>{{text}}</span> 
        <div>`,
    data: globalData
});
```

如果我们执行下面这条语句：

```javascript
globalData.text = '前端工匠';
```

此时我们需要通知 test1 以及 test2 这两个Vue实例进行视图的更新,我们只有通过收集依赖才能知道哪些地方依赖我的数据，以及数据更新时派发更新。那依赖收集是如何实现的？其中的核心思想就是“事件发布订阅模式”。接下来我们先介绍两个重要角色-- 订阅者 Dep和观察者 Watcher ，然后阐述收集依赖的如何实现的。

##### 2.14.3 订阅者 Dep

1.为什么引入 Dep

收集依赖需要为依赖找一个存储依赖的地方，为此我们创建了Dep,它用来收集依赖、删除依赖和向依赖发送消息等。

于是我们先来实现一个订阅者 Dep 类，用于解耦属性的依赖收集和派发更新操作，说得具体点，它的主要作用是用来存放 Watcher 观察者对象。我们可以把**Watcher理解成一个中介的角色，数据发生变化时通知它，然后它再通知其他地方。**

2. Dep的简单实现

```javascript
class Dep {
    constructor () {
        /* 用来存放Watcher对象的数组 */
        this.subs = [];
    }
    /* 在subs中添加一个Watcher对象 */
    addSub (sub) {
        this.subs.push(sub);
    }
    /* 通知所有Watcher对象更新视图 */
    notify () {
        this.subs.forEach((sub) => {
            sub.update();
        })
    }
}
```

以上代码主要做两件事情：

-   用 addSub 方法可以在目前的 Dep 对象中增加一个 Watcher 的订阅操作；
-   用 notify 方法通知目前 Dep 对象的 subs 中的所有 Watcher 对象触发更新操作。

所以当需要依赖收集的时候调用 addSub，当需要派发更新的时候调用 notify。调用也很简单：

```javascript
let dp = new Dep()
dp.addSub(() => {
    console.log('emit here')
})
dp.notify()
```

##### 2.14.4 观察者 Watcher

```1.为什么引入Watcher```

Vue 中定义一个 Watcher 类来表示观察订阅依赖。至于为啥引入Watcher，《深入浅出vue.js》给出了很好的解释:

当属性发生变化后，我们要通知用到数据的地方，而使用这个数据的地方有很多，而且类型还不一样，既有可能是模板，也有可能是用户写的一个watch,这时需要抽象出一个能集中处理这些情况的类。然后，我们在依赖收集阶段只收集这个封装好的类的实例进来，通知也只通知它一个，再由它负责通知其他地方。

**依赖收集的目的是将观察者 Watcher 对象存放到当前闭包中的订阅者 Dep 的 subs 中**。形成如下所示的这样一个关系（图参考《剖析 Vue.js 内部运行机制》）。

<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231212153840682.png" alt="image-20231212153840682" style="zoom:50%;" />

```2.Watcher的简单实现```

```javascript
class Watcher {
  constructor(obj, key, cb) {
    // 将 Dep.target 指向自己
    // 然后触发属性的 getter 添加监听
    // 最后将 Dep.target 置空
    Dep.target = this
    this.cb = cb
    this.obj = obj
    this.key = key
    this.value = obj[key]
    Dep.target = null
  }
  update() {
    // 获得新值
    this.value = this.obj[this.key]
   // 我们定义一个 cb 函数，这个函数用来模拟视图更新，调用它即代表更新视图
    this.cb(this.value)
  }
}
```

以上就是 Watcher 的简单实现，在执行构造函数的时候将 `Dep.target` 指向自身，从而使得收集到了对应的 Watcher，在派发更新的时候取出对应的 Watcher ,然后执行 `update` 函数。

##### 2.14.5 收集依赖

所谓的依赖，其实就是Watcher。至于如何收集依赖，总结起来就一句话，**在getter中收集依赖，在setter中触发依赖。**先收集依赖，即把用到该数据的地方收集起来，然后等属性发生变化时，把之前收集好的依赖循环触发一遍就行了。

具体来说，当外界通过Watcher读取数据时，便会触发getter从而将Watcher添加到依赖中，哪个Watcher触发了getter，就把哪个Watcher收集到Dep中。当数据发生变化时，会循环依赖列表，把所有的Watcher都通知一遍。

最后我们对 defineReactive 函数进行改造，在自定义函数中添加依赖收集和派发更新相关的代码,实现了一个简易的数据响应式。

```javascript
function observe (obj) {
  // 判断类型
  if (!obj || typeof obj !== 'object') {
    return
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
  function defineReactive (obj, key, value) {
    observe(value)  // 递归子属性
    let dp = new Dep() //新增
    Object.defineProperty(obj, key, {
      enumerable: true, //可枚举（可以遍历）
      configurable: true, //可配置（比如可以删除）
      get: function reactiveGetter () {
        console.log('get', value) // 监听
     // 将 Watcher 添加到订阅
       if (Dep.target) {
         dp.addSub(Dep.target) // 新增
       }
        return value
      },
      set: function reactiveSetter (newVal) {
        observe(newVal) //如果赋值是一个对象，也要递归子属性
        if (newVal !== value) {
          console.log('set', newVal) // 监听
          render()
          value = newVal
     // 执行 watcher 的 update 方法
          dp.notify() //新增
        }
      }
    })
  }
}

class Vue {
    constructor(options) {
        this._data = options.data;
        observer(this._data);
        /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象 */
        new Watcher();
        console.log('模拟视图渲染');
    }
}
```

当 render function 被渲染的时候,读取所需对象的值，会触发 reactiveGetter 函数把当前的 Watcher 对象（存放在 Dep.target 中）收集到 Dep 类中去。之后如果修改对象的值，则会触发 reactiveSetter 方法，通知 Dep 类调用 notify 来触发所有 Watcher 对象的 update 方法更新对应视图。

##### 2.14.6 总结

最后我们依照下图（参考《深入浅出vue.js》），再来回顾下整个过程：

<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231212154754522.png" alt="image-20231212154754522" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231212155747719.png" alt="image-20231212155747719" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RvbmdxaWFuOTEx,size_16,color_FFFFFF,t_70-20231212155432233.png" alt="在这里插入图片描述" style="zoom:50%;" />

在 `new Vue()` 后， Vue 会调用` _init` 函数进行初始化，也就是init 过程，在 这个过程Data通过Observer转换成了getter/setter的形式，来对数据追踪变化，当被设置的对象被读取的时候会执行`getter` 函数，而在当被赋值的时候会执行 `setter`函数。

当render function 执行的时候，因为会读取所需对象的值，所以会触发getter函数从而将Watcher添加到依赖中进行依赖收集。

在修改对象的值的时候，会触发对应的`setter`， `setter`通知之前**依赖收集**得到的 Dep 中的每一个 Watcher，告诉它们自己的值改变了，需要重新渲染视图。这时候这些 Watcher就会开始调用 `update` 来更新视图。

#### 2.15 Flex容器属性

##### 2.15.1 Flex布局与响应式布局

###### 2.15.1.1 为什么需要响应式布局？

在电脑PC端，使用浮动，定位同时使用像素px单位就可以完成大部分布局，而且布局完之后不会有大问题，但是到了移动端，移动设备的屏幕尺寸多种多样，从小屏幕的智能手机到大屏幕的平板电脑，甚至是可穿戴设备，简单地运用和PC端一样的方式就会出现一些布局和排列的问题。

这里用PC端的缩放浏览器来举个例子，当浏览器缩小的时候，百度就只显示了一部分，无法在缩小的屏幕（浏览器窗口）中完全显示。

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230629214844072-394757886.png)

 移动前端中常说的 viewport （视口）就是浏览器中用于呈现网页的区域。视口通常并不等于屏幕大小，特别是可以缩放浏览器窗口的情况下，为了确保在不同设备上都能够提供良好的用户体验，需要使用响应式布局来适应不同的屏幕尺寸。

###### 2.15.1.2 响应式布局的解决方案

响应式布局有多种方案，比如：

1.  媒体查询：它允许根据设备的特性（如屏幕宽度、设备类型等）应用不同的样式规则。通过使用媒体查询，可以针对不同的屏幕尺寸和设备类型应用不同的样式，从而实现响应式布局。
2.  流式布局（百分比布局）：它是一种基于相对单位（如百分比）进行设计的布局方式。在流式布局中，元素的宽度和高度相对于父元素或视口进行计算，使得它们可以根据可用空间的大小进行自适应调整。流式布局可以使页面在不同屏幕尺寸下保持比例和流动性。
3.  Flex布局：Flexbox是CSS3中的一种弹性盒子布局模型，它提供了强大的排列和对齐功能，可以实现灵活的响应式布局。通过使用Flexbox属性和值，可以轻松地控制元素在容器中的位置、顺序和大小。
4.  栅格系统：栅格系统是一种将页面划分为多个网格列的布局方式，通过定义网格列数和间距来布局页面内容。栅格系统通常与媒体查询和流式布局结合使用，以实现在不同屏幕尺寸下的响应式布局。流行的栅格系统包括Bootstrap的栅格系统和Foundation的栅格系统。

本文主要介绍Flex布局

###### 2.15.1.3 Flex布局的优越性

**排列灵活，样式简单：**Flex布局在响应式解决方案中具有灵活的排列和对齐、自适应的弹性性质、自动换行和调整顺序以及容器和项目的灵活性等优点，可以通过简单的CSS属性设置来控制元素在容器中的位置和布局。通过设置容器的flex-direction、justify-content和align-items等属性，可以轻松实现水平或垂直方向上的排列和对齐需求。这种灵活性使得在不同设备上适应不同布局要求变得容易。相比起针对不同屏幕来设置的媒体查询，相同的样式设置就可以适配多种屏幕尺寸，Flex布局非常的方便。

**自动换行，调整顺序：**在移动设备上，屏幕空间有限，需要在有限的空间中合理布局元素。Flex布局可以通过设置flex-wrap属性实现自动换行，使得项目可以在一行排列不下时自动换行到下一行。此外，还可以使用order属性调整项目的显示顺序，以便在移动设备上优先显示重要内容。这种自动换行和调整顺序的特性使得在小屏幕设备上实现良好的用户体验变得简单。

除了响应式布局外，在PC端也可以利用Flex布局来**替代浮动和定位**，完成很好的元素排列，让开发者免去使用float，position来布局的不便。最常见的八股文面试题，垂直水平居中就可以用flex布局轻松完成，这也是工作中较为常用的方式。

##### 2.15.2 Flex布局定义

Flex布局对于元素的内联（行内）或块级的性质是不关心的。在Flex布局中，元素会根据容器和项目的属性进行排列，无论元素是行内元素还是块级元素。采用Flex布局的元素，称为Flex容器（flex container），简称”容器”。Flex容器的所有子元素自动成为容器成员，称为Flex项目（flex item），简称”项目”。

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230630151608755-243490454.png)

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做main start，结束位置叫做main end；交叉轴的开始位置叫做cross start，结束位置叫做cross end。

项目默认沿主轴排列。单个项目占据的主轴空间叫做main size，占据的交叉轴空间叫做cross size。

##### 2.15.3 Flex容器属性

###### 2.15.3.1 开启flex布局display:flex

元素写了这个属性之后，就变成了一个flex的容器，就可以通过flex布局相关的方式去操作排列子元素。

```html
  <style>
    .parent{
      display: flex;
      width: 400px;
      height: 200px;
      background-color:blueviolet;
    }
    .child{
      width: 100px;
      height: 50px;
      background-color: aqua;
      border: 1px solid black;
    }
  </style>
</head>
<body>
  <div class="parent">
    <div class="child">1</div>
    <div class="child">2</div>
  </div>
</body>
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230630165321057-1043471896.png)

开启flex布局之后，没有进行其他的设置，可以看到这个排列和没有开启flex布局的时候是不一样的，2个块级元素，并没有上下排列，而是已经排列在左右。开启flex布局后，容器中的项目默认会沿着主轴进行排列，此时没有对容器和项目进行其他的设置，主轴也按照默认的方向水平放置，所以2个子盒子都沿着主轴水平排列了。

###### 2.15.3.2 改变主轴的方向flex-direction属性

flex-direction属性决定了主轴的方向，所有容器中的项目都会根据主轴方向来排列。

flex-direction 属性有四个可能的取值：

1.  row（默认值）：Flex 项目水平排列，起点在左端，终点在右端。主轴从左到右。
2.  row-reverse：Flex 项目水平排列，起点在右端，终点在左端。主轴从右到左。
3.  column：Flex 项目垂直排列，起点在顶部，终点在底部。主轴从上到下。
4.  column-reverse：Flex 项目垂直排列，起点在底部，终点在顶部。主轴从下到上。

图中显示flex-direction的值为**row**时元素按顺序从左往右横向排列，子元素贴着父元素的左侧

```html
 1  .parent{
 2       display: flex;
 3       flex-direction: row;
 4       width: 400px;
 5       height: 200px;
 6       background-color:blueviolet;
 7     }
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230630170637262-1462556210.png)

图中显示flex-direction的值为**row-reverse**时元素按顺序从右往左横向排列，子元素贴着父元素的右侧（代码同上）

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230630171344600-2134603289.png)

图中显示flex-direction的值为**column**时元素按顺序从上往下竖向排列，子元素贴着父元素的顶部，这一点类似于常规的文档流中块级元素的排列（代码同上）

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230630172113405-704655488.png)

图中显示flex-direction的值为**column-reverse**时元素按顺序从下往上竖向排列，子元素贴着父元素的底部（代码同上） 

![img](https://img2023.cnblogs.com/blog/2306010/202306/2306010-20230630172705204-356358143.png)

总的来说，flex-direction属性虽然简单，但是有重要的作用，可以

1.  控制主轴方向：flex-direction 属性决定了主轴的方向，即 Flex 项目在水平方向或垂直方向上的排列。通过设置不同的取值，我们可以实现水平排列（左到右或右到左）或垂直排列（从上到下或从下到上）的布局。
2.  确定起点和终点：flex-direction 属性的取值影响了 Flex 项目在主轴上的起点和终点的位置。在 row 值下，起点位于左端，终点位于右端；在 row-reverse 值下，起点位于右端，终点位于左端；在 column 值下，起点位于顶部，终点位于底部；在 column-reverse 值下，起点位于底部，终点位于顶部。这种控制起点和终点的能力对于设计布局非常有用。
3.  影响项目排列顺序：flex-direction 属性还决定了 Flex 项目在主轴上的排列顺序。在默认的 row 值下，Flex 项目按照其在 HTML 结构中的顺序从左到右排列；在 row-reverse 值下，项目按照相反的顺序从右到左排列；在 column 值下，项目按照结构顺序从上到下排列；在 column-reverse 值下，项目按照相反的顺序从下到上排列。通过改变项目的排列顺序，我们可以调整 Flex 布局的外观和行为。

###### 2.15.3.3 改变换行方式flex-wrap属性

flex-wrap属性决定了换行相关的策略。它决定了当弹性容器的宽度不足以容纳所有子元素时，是否允许子元素换行并如何排列。

它有几个常用的属性值：

1.  nowrap（默认值）：子元素不换行，尽可能地将它们放在一行内，即使溢出弹性容器的边界。
2.  wrap：如果子元素在一行内放不下，将它们进行换行，从新行开始排列。
3.  wrap-reverse：与 wrap 相同，但换行时的排列顺序与正常顺序相反。

当没有写flex-wrap属性时，所有元素会默认沿着主轴在一行（或一列）排列。这也就和写了flex-wrap: **nowrap**是等效的

在已经给子项目设置了100px的宽度的情况下，6个项目仍然会排在同一行，而此时父元素的宽度也只有400px，说明此时子项目的宽度已经被压缩了变成了小于100px。

```html
 1 <style>
 2     .parent {
 3         display: flex;
 4         width: 400px;
 5         height: 200px;
 6         background-color: blueviolet;
 7     }
 8 
 9     .child {
10         width: 100px;
11         height: 50px;
12         background-color: aqua;
13         border: 1px solid black;
14     }
15 </style>
16 <body>
17     <div class="parent">
18         <div class="child">1</div>
19         <div class="child">2</div>
20         <div class="child">3</div>
21         <div class="child">4</div>
22         <div class="child">5</div>
23         <div class="child">6</div>
24     </div>
25 </body>
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230702214637701-1864623682.png)

当希望子项目完成换行的时候可以设置flex-wrap: **wrap**

明显可以看到，图片已经完成了换行效果，但是这里上下两行元素出现了空隙，似乎与预期效果不符合，这是由于多行对齐时的align-content的默认值导致的，具体align-content用法会在后文解释。

```htm
 1     .parent {
 2         display: flex;
 3         flex-wrap: wrap;
 4         width: 400px;
 5         height: 200px;
 6         background-color: blueviolet;
 7     }
 8 
 9     .child {
10         width: 100px;
11         height: 50px;
12         background-color: aqua;
13         border: 1px solid black;
14     }
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230702221137246-143513445.png) 

当换行属性设置为flex-wrap: **wrap-reverse**，也会完成换行，但是换行的顺序与前面相反，第一行会在最下面，最后一行在上面

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230702221206795-72840163.png)

  

###### 2.15.3.4 主轴对齐方式justify-content属性

justify-content是flex布局中的重要属性之一，用于定义和调整弹性容器中项目在主轴上的对齐方式。它控制项目沿着主轴的分布方式，包括项目之间的间距、对齐和对齐方式的调整。

这个属性常用的有以下几个值

1.  flex-start（默认值）：将项目对齐到弹性容器的起始位置。项目靠主轴起始端对齐。
2.  flex-end：将项目对齐到弹性容器的末尾位置。项目靠主轴末尾端对齐。
3.  center：将项目在主轴上居中对齐。项目在主轴上平均分布，两端留有相同的空白。
4.  space-between：将项目在主轴上平均分布，并使项目之间的间距相等。首个项目对齐到主轴起始端，最后一个项目对齐到主轴末尾端。
5.  space-around：将项目在主轴上平均分布，并使项目之间的间距相等。首尾两端的间距是相邻项目间距的一半。
6.  space-evenly：将项目在主轴上平均分布，并使项目之间的间距相等。首尾两端和相邻项目之间的间距相等。

 不写justify-content或者justify-content的值为**flex-start**时，flex容器内部的项目会按顺序沿着主轴排列，也就是当主轴是水平的时候就横过来排列，主轴是竖直的就竖过来排列。

以较常见的flex-direction取默认值row的时候举例，有类似于float:left的效果，但是不会出现子元素浮动后脱离文档流导致父元素高度塌陷的问题。

```html
1 .parent {
2         display: flex;
3         justify-content: flex-start;
4         width: 400px;
5         height: 200px;
6         background-color: blueviolet;
7     }
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230630211850757-1293868822-20231218172531478.png)

justify-content的值为**flex-end**时，子元素也就是flex容器会靠主轴的终点处对齐，与前面的flex-start呈现相反的对齐排列效果。

以较常见的flex-direction取默认值row的时候举例，类似于float:right的效果，但是与右浮动不同的是右浮动会导致元素倒序排列而flex-end会保持元素的顺序，元素的排列顺序仍然是1，2，3。

```html
1     <div class="parent">
2         <div class="child">1</div>
3         <div class="child">2</div>
4         <div class="child">3</div>
5     </div>
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230630212739103-932769855.png)

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230630212636390-1007346083.png)

**对于右浮动会出现倒序的原因，这里进行简单的解释：**

**浮动的元素直到碰到边缘或另一个浮动元素的边缘为止，而代码又是从上往下执行，对于第一个child会优先进行浮动，碰到父盒子右边缘，结束，第二个child再开始浮动，碰到第一个child的左边缘再结束，第三个child在第二个child浮动结束后再浮动，就贴着第二个child左边缘。**

解决右浮动倒序的方法可以有以下几种：

1.  利用flex布局的flex-end，如上图所示

2.  倒序书写元素，这样就可以正序排列了。

3.  对于多个右浮动的child，再在外面加一层div包裹，先让外层的div右浮动（只有一个盒子，不会出现顺序问题的同时又能靠右对齐），然后让每个child左浮动（左浮动不会导致顺序出现问题，又可以实现浮动效果），代码和图片如下

    ```html
    <style>
        .parent {
            width: 400px;
            height: 200px;
            background-color: blueviolet;
        }
    
        .wrapper {
            float: right;
        }
    
        .child {
            float: left;
            width: 100px;
            height: 50px;
            background-color: aqua;
            border: 1px solid black;
        }
    </style>
    </head>
    <body>
        <div class="parent">
            <div class="wrapper">
                <div class="child">1</div>
                <div class="child">2</div>
                <div class="child">3</div>
            </div>
        </div>
    </body>
    ```

    ![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230630214912590-510159166.png)

justify-content的值为**center**时，flex容器内的元素在主轴上居中对齐，向两边平均分布

以较常见的flex-direction取默认值row的时候举例，图中利用flex布局的justify-content:center 可以非常方便地实现块级元素的居中对齐

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230630214004924-2124417700.png)

 justify-content的值为**space-between**时，项目会在主轴两端对齐，中间平均排列，让不同的项目之间的间距相等

这里将每个child的宽度调成50px让多个盒子都能呈现在父容器内（同时避免尺寸发生变化）以展示space-between的效果。

这种布局形式在真实开发中也较为常用，有许多场景都需要两端对齐后，中间均分空隙。

以较常见的flex-direction取默认值row的时候举例，可以看到子项目中的间距都是相同的。在没有设置任何margin的情况下，元素也可以完成分离。

```html
 1     .parent {
 2         display: flex;
 3         justify-content: space-between;
 4         width: 400px;
 5         height: 200px;
 6         background-color: blueviolet;
 7     }
 8 
 9     .child {
10         width: 50px;
11         height: 50px;
12         background-color: aqua;
13         border: 1px solid black;
14     }
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230630221654010-1807254784.png)

justify-content的值为**space-around**时，每个项目自身的左右间距会相等，类似于设置了左右两边相同的margin值

以较常见的flex-direction取默认值row的时候举例，看起来首尾元素间距更窄，是因为对于中间元素一共有2份间距，前一个元素的右间距+后一个元素的左间距，所以中间的间距是首尾的两倍。

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230630222516755-1397474668.png)

justify-content的值为**space-evenly**时，所有项目的间距都会相等，前面提到的space-around会让每个项目自身都具有相同左右边距，导致中间的间距叠加成立首尾的2倍。而space-evenly中会让所有的间距都相等，包括刚才所提到的首尾和中间。

以较常见的flex-direction取默认值row的时候举例，所有间距都相同。

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230630223557159-1157802868.png)

 

###### 2.15.3.5 交叉轴单行对齐align-items属性

 与justify-content对应的，align-items用于定义和调整弹性容器中项目在交叉轴上的对齐方式，它同样也控制项目沿着交叉轴的分布方式，包括项目之间的间距、对齐和对齐方式的调整。

这个属性有以下几个常用的值

1.  stretch（默认值）：将项目在交叉轴上拉伸以填充整个弹性容器。项目将沿交叉轴方向拉伸至与容器的交叉轴尺寸相等。
2.  flex-start：将项目对齐到弹性容器的交叉轴起始位置。项目靠交叉轴起始端对齐。
3.  flex-end：将项目对齐到弹性容器的交叉轴末尾位置。项目靠交叉轴末尾端对齐。
4.  center：将项目在交叉轴上居中对齐。项目在交叉轴上平均分布，上下留有相同的空白。
5.  baseline：将项目在交叉轴上与其基线对齐。项目的基线与其他项目的基线对齐。

这里先从默认不写这个属性来看，虽然align-items里也有和justify-content相同的flex-start值，但是这里的**默认值**并不是flex-start而是**stretch**，stretch的意思是伸展、延伸，也就是说写了stretch之后（或者直接不写align-items让他取默认值），项目会在交叉轴上伸展。

以没有写高度的项目举例

```html
 1     .parent {
 2         display: flex;
 3         justify-content: stretch;
 4         width: 400px;
 5         height: 200px;
 6         background-color: blueviolet;
 7     }
 8 
 9     .child {
10         width: 50px;
11         background-color: aqua;
12         border: 1px solid black;
13     }
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230702195859606-90665414.png)

 

注意，以上代码中，子元素没有设置高度，所以flex项目完成拉伸并且在交叉轴上填满整个父容器的高度（或宽度），当然如果项目分多行排列，也会撑满整个父容器，每个项目的高度会被拉伸到：父元素高度/行数。

如果子项目已经设置了高度，那么这个属性就不会生效，不会再去拉伸项目。同样的如果主轴是垂直的，项目没有写宽度，也会横向撑满整个容器

```html
 1     .parent {
 2         display: flex;
 3         align-items: stretch;
 4         width: 400px;
 5         height: 200px;
 6         background-color: blueviolet;
 7     }
 8 
 9     .child {
10         width: 50px;
11         height: 50px;
12         background-color: aqua;
13         border: 1px solid black;
14     }
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230702200847648-874301929.png)

align-items为**flex-start**时，子项目都沿着交叉轴靠着交叉轴的起点对齐

这里因为只有一行（没有设置换行属性，也没有一行排列不下），整个容器的上端也就是交叉轴的起点， 所以看起来和上面的图没什么区别。

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230702202156644-447558129.png)

align-items为**flex-end**时，子项目都沿着交叉轴靠着交叉轴的终点对齐

和上图相反的是，设置了这个属性，一行的项目就来到了容器底部，因为默认情况下交叉轴从上往下，容器的底部也就是整个交叉轴的终点

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230702202759495-2127273728.png)

align-items为**center**时，子项目都沿着交叉轴靠着交叉轴居中对齐，往两边平均分布

设置了center后，子项目来到居中的位置。这也是在flex布局中最常用的居中技巧之一。如果需要垂直方向的居中，可以直接使用flex布局并且写上align-items: center。

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230702203027921-1811031100.png)

align-items为**baseline**时，项目会按照文本的基线对齐

先针对第二个项目设置了一个padding，这样第二个项目的文字就会被挤下去，所以文字就不会在同一条基线上了

```html
 1 <style>
 2     .parent {
 3         display: flex;
 4         width: 400px;
 5         height: 200px;
 6         background-color: blueviolet;
 7     }
 8 
 9     .child {
10         width: 50px;
11         height: 50px;
12         background-color: aqua;
13         border: 1px solid black;
14     }
15 
16     #two {
17         padding-top: 10px;
18     }
19 </style>
20 <body>
21     <div class="parent">
22         <div class="child">1</div>
23         <div class="child" id="two">2</div>
24         <div class="child">3</div>
25         <div class="child">4</div>
26         <div class="child">5</div>
27         <div class="child">6</div>
28     </div>
29 </body>
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230702205013194-139160147.png)

 如果设置align-items: baseline之后，项目明显都在同一条基线上。

![img](https://img2023.cnblogs.com/blog/2306010/202307/2306010-20230702205108228-407174499.png)

 

 

###### 2.15.3.6 交叉轴多行对齐align-content属性

在上文的flex-wrap中，换行显示的盒子出现了一些空隙，这就和align-content有关系，align-content是CSS中用于控制flex容器中多行项目的对齐方式的属性。它适用于具有多行内容的flex容器，并决定了这些行在容器中的项目在交叉轴上的对齐方式。 

 以下是align-content的一些常用的取值：

1.  flex-start：将多行项目对齐到容器的起始位置。第一行将与容器的顶部对齐。
2.  flex-end：将多行项目对齐到容器的结束位置。最后一行将与容器的底部对齐。
3.  center：将多行项目在容器中垂直居中对齐。
4.  space-between：在容器中平均分布多行项目，使第一行在容器的顶部，最后一行在容器的底部，剩余的行平均分布在中间。
5.  space-around：在容器中平均分布多行项目，使每行周围具有相等的空间，包括顶部和底部。
6.  space-evenly：在容器中平均分布多行项目，使每行之间和周围都具有相等的空间。
7.  stretch（默认值）：在容器中平均分布多行项目，项目将被拉伸以填充整个容器的高度。

需要注意的是，align-content只在有多行的情况下才会生效，而在只有一行的情况下是不会产生任何效果的，所以以下的示例全部会涉及到flex-wrap换行。

当默认不写align-content时，align-content的值默认取**stretch**，也就是会把每一个项目都会拉伸来撑满整个容器，这里最多2行，所以每个项目的高度都被拉伸到了容器高度/2。

当对子项目设置高度的时候，项目不会被拉伸，但是原来拉伸后的空间会有间距填充

```html
 1     .parent{
 2       display: flex;
 3       flex-wrap: wrap;
 4       /* 默认值，也可以不写 */
 5       align-content: stretch;
 6       width: 400px;
 7       height: 200px;
 8       background-color:blueviolet;
 9     }
10     .child{
11       width: 100px;
12       background-color: aqua;
13       border: 1px solid black;
14     }
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703160542574-1969583303.png)

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703160503120-438958790.png)

 当align-content的值取**flex-start**时，第一行会靠着交叉轴起点，也就是顶部对齐，不会留有上图那样的间距

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703160938337-1570256400.png)

当align-content的值取**flex-end**时，最后一行会靠着交叉轴终点，也就是底部对齐，也不会留有上图那样的间距

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703161107890-388842939.png)

当align-content的值取**center**时，项目会在交叉轴上居中对齐，向两边平均分布，这个与之前的align-items和justify-content相似

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703161435180-713814852.png)

当align-content的值取**space-between**时，项目会在交叉轴上贴着两端，中间间距相同

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703161625271-1774393986-20231218173407394.png)

当align-content的值取**space-around**时，每个项目的上下间距相同，和justify-content一样，因为中间的间距叠加，首尾的间距是中间间距的一半

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703162322531-788858057.png)

 当align-content的值取**space-evenly**时，所有交叉轴上的间距相同

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703162416988-1064119191.png)

 

##### 2.15.4 Flex项目属性

###### 2.15.4.1 改变项目的显示顺序order属性

order属性用于控制Flex容器中子元素的排序。默认情况下，Flex容器中的子元素按照它们在HTML源代码中的顺序进行排列，但是使用order属性，我们可以改变这个顺序

每个Flex项目的order属性默认值是0。你可以为项目设定任意整数值，数值可以是正数、0或者负数。**具有较小order值的元素将被优先排列**，具有相同order值的元素将按照它们在HTML源代码中的原始顺序排列。

```htm
 1     .parent{
 2       display: flex;
 3       flex-wrap: wrap;
 4       align-content: flex-start;
 5       width: 400px;
 6       height: 200px;
 7       background-color:blueviolet;
 8     }
 9     .child{
10       width: 100px;
11       height: 50px;
12       background-color: aqua;
13       border: 1px solid black;
14     }
15     #two{
16       order: -1;
17     }
18     #three{
19       order: -2;
20     }
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703163241747-1659924149.png)

 

###### 2.15.4.2 子项目扩张flex-grow属性

flex-grow用于设置或检索flex容器中的flex子项目的能力，以根据其在flex容器中的空间比例来伸展和占用空间。

flex-grow属性的默认值为0，表示子项目将不会伸展以填充容器。

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703172529041-457820971.png)

flex可以取的值是所有非负数，数值不带单位，表示当容器有剩余空间的时候，子项目按比例去增大，占满容器。子项目扩张的算法如下：比如剩余空间为 x，三个元素的 flex-grow 分别为 a，b，c。设 sum 为 a + b + c。那么三个元素将得到剩余空间分别是 x * a / sum, x * b / sum, x * c / sum

对第三个子项目进行设置flex-grow：1，表示的意思是：有剩余空间的时候，第三个项目会扩张，占一份，因为只有一个元素设置了flex-grow，所以第三项目占满了所有剩余空间。

此时如果对第三个项目设置flex-grow：2/3/4/5....都不会使他变得更大，因为剩余空间只有那么多，其他的元素也都是flex-grow：0。

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703173005424-1294397707.png)

对多个项目设置flex-grow时，它们就按照比例来占满剩余空间，第二个子项目占1份（四分之一），第三个子项目占3份（四分之三）

```html
 1     .parent {
 2       display: flex;
 3       width: 400px;
 4       height: 200px;
 5       background-color: blueviolet;
 6     }
 7 
 8     .child {
 9       width: 50px;
10       height: 50px;
11       background-color: aqua;
12       border: 1px solid black;
13     }
14 
15     #two {
16       flex-grow: 1;
17     }
18 
19     #three {
20       flex-grow: 3;
21     }
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703174241878-780458438.png)

前面有说到，flex-grow可以设置所有非负的值，当所有的子项目flex-grow的值之和小于1时，计算扩张的算法会发生改变，不再只是将所有的剩余空间的按flex-grow的比例分配，而是将剩余空间*sum（三个元素的 flex-grow 分别为 a，b，c设 sum 为 a + b + c）按flex-grow的比例分配。也可以等效地理解为按上面讲的算法x * a / sum, x * b / sum, x * c / sum，当sum<1时，分母直接使用1。

如下图，第二个子项目获得剩余空间的20%，第三个子项目获得剩余空间的60%，剩下的20%仍然空出。

```html
 1     .parent {
 2       display: flex;
 3       width: 400px;
 4       height: 200px;
 5       background-color: blueviolet;
 6     }
 7 
 8     .child {
 9       width: 50px;
10       height: 50px;
11       background-color: aqua;
12       border: 1px solid black;
13     }
14 
15     #two {
16       flex-grow: 0.2;
17     }
18 
19     #three {
20       flex-grow: 0.6;
21     }
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703175552874-2096167450.png)

简单案例：之前在开发中遇到一个需求，后端会给前端传许多一段一段的标签，每个标签的宽度都不一样长，这些标签要换行排列。每一行的标签要贴着左右边缘，中间间距相等（justify-content: space-between）。最后一行标签一般都会数量较少，如果仅仅使用justify-content: space-between而不对最后一行专门处理，最后一行的间距就会特别大，影响最后页面效果的呈现。

为了解决最后一行标签数量较少的问题，可以在容器末尾加一个看不见的盒子，让那个盒子占满剩余的空间，也就是利用flex-grow: 1

以下用简单的代码模拟了一下上述开发场景

```html
 1 <style>
 2     .parent {
 3         display: flex;
 4         flex-wrap: wrap;
 5         justify-content: space-between;
 6         width: 400px;
 7         height: 200px;
 8         background-color: blueviolet;
 9     }
10 
11     .child {
12         width: 100px;
13         height: 40px;
14         background-color: aqua;
15         border: 1px solid black;
16         font-size: 18px;
17     }
18 
19     .hidden {
20         flex-grow: 1;
21         visibility: hidden;
22     }
23 </style>
24 <body>
25     <div class="parent">
26         <div class="child">1</div>
27         <div class="child" style="width: 120px;">2</div>
28         <div class="child" style="width: 30px;">3</div>
29         <div class="child">4</div>
30         <div class="child" style="width: 150px;">5</div>
31         <div class="child">6</div>
32         <div class="child">7</div>
33         <div class="child">8</div>
34         <div class="child">9</div>
35         <div class="hidden"></div>
36     </div>
37 </body>
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703201114603-1492737671.png)

###### 2.15.4.3 子项目收缩flex-shrink属性

 flex-shrink用于指定项目在容器中缩小的能力，当 flex 容器空间不足时候，单个元素的收缩比例。当父元素的宽度小于子元素宽度之和并且超出了父元素的宽度时，flex-shrink 就会按照一定的比例进行收缩：将子元素宽度之和与父元素宽度的差值按照子元素 flex-shrink 的值分配给各个子元素，每个子元素原本宽度减去按比例分配的值，其剩余值为实际宽度。

flex-shrink的默认值是1，也就是说，当子元素宽度的和超出父容器的时候，所有子项目都等比例的缩小

下图中所有子项目的flex-shrink都取1，但是子项目的宽度是有不同的，第二个子项目宽度为120px，第三个子项目宽度为150px，其他所有子项目的宽度都是100px，他们宽度的和是100*4+120+150 = 670px，但是父容器宽度只有400px，也就是说超出了270px。此时要等比例缩小，要计算每个盒子要缩小的宽度，算法是：子项目宽度/（每个子项目的宽度*对应shrink的值）之和 * 超出的宽度。对于宽度为100的子项目要缩小的宽度是 （100*1）/（100*4*1+120*1+150*1）*270 = 40.29px，对于第二个宽度为120px的子项目要缩小的宽度是（120*1）/（100*4*1+120*1+150*1）*270 = 48.36px，对于第三个宽度为150px的子项目要缩小的宽度是（150*1）/（100*4*1+120*1+150*1）*270 = 60.48px

所有盒子在收缩后，最后的宽度=原来宽度-要缩小的宽度

```html
 1     .parent {
 2         display: flex;
 3         width: 400px;
 4         height: 200px;
 5         background-color: blueviolet;
 6     }
 7 
 8     .child {
 9         width: 100px;
10         height: 50px;
11         flex-shrink: 1;
12         background-color: aqua;
13         border: 1px solid black;
14     }
15     #two{
16         width: 120px;
17     }
18     #three{
19         width: 150px;
20     }
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703191951395-2121963649.png)

当flex-shrink为0的时候，该子项目不会收缩

以第三个150px的盒子举例，让它的flex-shrink为0，它就不会收缩，其他盒子按比例收缩，宽度为100px的项目flex-shrink为1，要缩小的宽度为 （100*1）/（100*4*1+120*1.5+150*0）*270 = 46.55px， 宽度为120px的项目flex-shrink为1.5，要缩小的宽度为 （120*1.5）/（100*4*1+120*1.5+150*0）*270 = 83.79px

```html
 1     .parent {
 2         display: flex;
 3         width: 400px;
 4         height: 200px;
 5         background-color: blueviolet;
 6     }
 7 
 8     .child {
 9         width: 100px;
10         height: 50px;
11         flex-shrink: 1;
12         background-color: aqua;
13         border: 1px solid black;
14     }
15     #two{
16         width: 120px;
17         flex-shrink: 1.5;
18 
19     }
20     #three{
21         width: 150px;
22         flex-shrink: 0;
23 
24     }
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230703194701253-852801574-20231218174230848.png)

 

###### 2.15.4.4 子项目初始尺寸flex-basis属性

flex-basis用于设置flex容器中项目的初始大小。它定义了一个项目在主轴上的初始尺寸，即在项目没有被放大或缩小之前的大小。flex-basis可以接受多种单位值，如像素（px）、百分比（%）、视口宽度（vw）、视口高度（vh）等。

flex-basis常用的值有

1.  <length>：可以是像素值（px）、百分比（%）等，表示项目的初始尺寸。
2.  auto（默认值）：项目的初始尺寸由其内容决定。如果项目没有设置尺寸或具有固定的尺寸，则自动计算尺寸。
3.  content：项目的初始尺寸由项目内容决定。

在Flex布局中，子项设置width是没有**直接效果**的，之前所有设置宽度并且生效是因为没有写flex-basis属性，也就是说flex-basis属性取了默认值**auto，**当flex-basis取auto的时候，容器的宽度就由子项自身的尺寸（比如width，max-width等）去渲染。

```html
 1 .parent {
 2       display: flex;
 3       width: 400px;
 4       height: 200px;
 5       background-color: blueviolet;
 6     }
 7 
 8     .child {
 9       width: 50px;
10       height: 50px;
11       flex-basis: auto;
12       background-color: aqua;
13       border: 1px solid black;
14     }
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230704174729063-72987759.png)

 在同时用长度设置flex-basis和width时，width将无效，根据flex-basis的值决定尺寸

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230704175226981-726418171-20231218174222968.png)

 在设置flex-basis为content时，子项目的尺寸根据内容的大小决定

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230704180622234-604106788.png)

 

###### 2.15.4.5 联合写法flex属性

flex属性是flex-grow，flex-shrink，flex-basis三个属性的简写，用于控制子项目的缩放行为和初始尺寸。

flex的完整写法是 flex：<flex-grow> <flex-shrink> <flex-basis>，也就是一共有3个值要去设置，分别按顺序对应flex-grow，flex-shrink，flex-basis，而在日常工作中并不会经常写完整的写法，而较常用的是flex：1或者50%这种写法。

flex-grow和flex-shrink可以同时设置，但是对于一个元素，同时只会有其中一者生效，因为flex-grow需要有剩余空间才能进行拉伸分配而flex-shrink需要子元素宽度之和超过父元素（溢出）才会收缩，一个盒子要么空间不足，要么就空间超出，不可能既有剩余空间又宽度之和超出父元素

flex属性的常用值有

1.  flex: auto: 此值表示元素可以根据可用空间进行伸缩，可以扩展也可以收缩。
2.  flex: initial: 此值将 flex-grow、flex-shrink 和 flex-basis 设置为默认值。flex-grow 为 0，flex-shrink 为 1，flex-basis 为 auto。
3.  flex: none: 此值表示元素不应该伸缩。flex-grow 和 flex-shrink 均为 0，flex-basis 为其本来的大小。
4.  flex: 数字/百分比/长度

flex:auto代表的是 flex:1 1 auto（flex-grow:1, flex-shrink: 1, flex-basis: auto) ，表示的是根据具体空间来进行扩展或者收缩

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230705102300132-1910881794.png)

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230705102350322-720244375.png)

 flex:initial（默认值）代表的是 flex:0 1 auto（flex-grow:0, flex-shrink: 1, flex-basis: auto) ，表示子项目不会在有剩余空间时候扩张，但是超出时会要收缩。

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230705102552518-1301580532.png)

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230705102618166-1689900791.png)

flex:none 代表的是 flex:0 0 auto（flex-grow:0, flex-shrink: 0, flex-basis: auto)，表示子项目不会扩张也不会收缩，保持原有尺寸

在超出父容器的时候，也会继续保持原有的尺寸

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230705102750911-1000977980.png)

其他值：

如果只写**一个值**，类似于flex: 1 这种，分2种情况

1.  如果写的是数字比如，flex: 1，flex: 2，flex: 3这种那设置的是flex-grow的值，其他2个值取默认
2.  如果写的是百分比（flex: 20%）或者是长度（flex: 100px），就是设置的flex-basis属性，其他2个值取默认

如果只写**两个值**，第一个值对应的是flex-grow，第二个值对应2种情况

1.  如果第二个值写的是数字比如，flex: 1，flex: 2，flex: 3这种那设置的是flex-shrink的值
2.  如果写的是百分比（flex: 20%）或者是长度（flex: 100px），就是设置的flex-basis属性

如果写**三个值**，对应地去设置flex-grow、flex-shrink 和 flex-basis 

 

简单案例：

场景1：简单实现一个两栏布局，左列定宽，右边自适应

这里用到flex: 1 让右边的项目自动根据剩余空间扩张

```html
 1   <style>
 2     .parent {
 3       display: flex;
 4       width: 400px;
 5       height: 200px;
 6       background-color: blueviolet;
 7     }
 8 
 9     .child1 {
10       width: 100px;
11       height: 50px;
12       background-color: aqua;
13       border: 1px solid black;
14     }
15     .child2 {
16       height: 50px;
17       background-color: aqua;
18       flex: 1;
19       border: 1px solid black;
20     }
21   </style>
22 
23 <body>
24   <div class="parent">
25     <div class="child1">1111</div>
26     <div class="child2">2</div>
27   </div>
28 </body>
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230705134100622-1396911083.png)

场景2：让多个盒子分行排列，每行要三个盒子，同时宽度自适应

这里要对父容器设置flex-wrap：wrap，对子项目设置，flex：33%来让它们每行排列3个

```html
 1 <style>
 2   .parent {
 3     display: flex;
 4     justify-content: space-between;
 5     flex-wrap: wrap;
 6     width: 400px;
 7     height: 200px;
 8     background-color: blueviolet;
 9   }
10 
11   .child {
12     box-sizing: border-box;
13     flex: 33%;
14     height: 50px;
15     background-color: aqua;
16     border: 1px solid black;
17   }
18 </style>
19 
20 <body>
21   <div class="parent">
22     <div class="child">1</div>
23     <div class="child">2</div>
24     <div class="child">3</div>
25     <div class="child">4</div>
26     <div class="child">5</div>
27     <div class="child">6</div>
28   </div>
29 </body>
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230705134756950-786647524.png)

 

###### 2.15.4.6 子项目单独对齐align-self属性

align-self属性用于调整Flex容器中单个项目（Flex项）的垂直对齐方式。它允许你为单个项目指定不同于其它项目的垂直对齐方式。align-self属性可以应用于任何Flex项，并覆盖容器级别的垂直对齐设置（通过align-items属性设置）

 常用的值有：

1.  auto（默认值）：继承自父容器的align-items属性。
2.  flex-start：项目与容器的顶部对齐。
3.  flex-end：项目与容器的底部对齐。
4.  center：项目在容器的垂直中心对齐。
5.  baseline：项目与容器的基线对齐。
6.  stretch：项目被拉伸以填充整个容器的高度。

这些取值都在前面的align-items中介绍过了，这里只用一些案例来演示align-self的效果

针对第二个子项目，设置了align-self: center，第三个子项目设置了align-self: flex-end

这里是单行的align-self效果

```html
 1   .parent {
 2     display: flex;
 3     align-items: flex-start;
 4     width: 400px;
 5     height: 200px;
 6     background-color: blueviolet;
 7   }
 8 
 9   .child {
10     box-sizing: border-box;
11     width: 100px;
12     height: 50px;
13     background-color: aqua;
14     border: 1px solid black;
15   }
16 
17   #two{
18     align-self: center;
19   }
20   #three{
21     align-self: flex-end;
22   }
```

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230705141657544-685581902.png)

如果在父容器中加入换行，效果如下

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/2306010-20230705141846784-1875850461.png)

#### 2.16 标准盒模型和怪异盒模型的区别

-   标准盒模型的组成：宽高（content）+padding+border+margin
    宽度实际占有的位置大小：
    宽+左右padding+左右border+左右margin。
    高度实际占有的位置大小：
    高+上下padding+上下border+上下margin。

width或height是对实际内容的width或height进行设置，内容周围的border和padding另外设置，盒子模型的width（或者height）=内容的宽高+padding+border+margin

-   怪异盒模型的组成：
    元素的宽度：width（content+border+padding）+margin
    width或height是对实际内容（content）+内边距（padding）+边框（border）之和的width和height进行设置的，盒模型的width（height）=设置的width（height）+外边距margin

注：标准盒模型可以转成怪异盒模型：用属性box-sizing
box-sizing的属性有两个 border-box（怪异盒模型）/content-box（标准盒模型）

box-sizing值为content-box时：宽度和高度分别应用到元素的内容框，在宽度和高度之外绘制元素的内边距和边框。（标准盒模型）

box-sizing值为border-box时：宽度和高度决定了边框，只能在宽度和高度内进行绘制，通过从已设定的宽度和高度分别减去边框和内边距才能得到内容的宽度和高度。（怪异盒模型）

```html
<!DOCTYPE html>
<html>
 <head>
  <meta charset="UTF-8">
  <title></title>
  <style type="text/css">
   *{
    margin: 0;
    padding: 0;
   }
   .std{
    width: 100px;
    height: 100px;
    background: yellow;
    border: 1px blue solid;
    padding: 10px;
    
   }
   .spec{
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    background: pink;
    padding: 10px;
   }
  </style>
 </head>
 <body>
  <div class="std">
    hello
  </div>
  <div class="spec">
   hello

  </div>
 </body>
</html>
```

<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231219095002749.png" alt="image-20231219095002749" style="zoom:50%;" />

box-sizing:border-box;是怪异盒模型
box-sing:content-box;是标准盒模型
据上面实验也看到了,如果不想因为改变padding的时候盒子的大小也会跟着变化的话就可以使用怪异盒模型,而如果想让盒子的大小被padding撑开的话就可以使用标准盒模型

#### 2.17 Vue插槽slot

插槽 **slot** 在实际的项目开发中是经常使用的，主要分为三大类：**默认插槽**、**具名插槽**和**作用域插槽**，也是比较容易上手的。

##### 2.17.1 插槽的含义

插槽 slot 是写在子组件的代码中，供父组件使用的占位符。在代码中，大致写为如下的形式，后面会进行详细的写法介绍。

<slot> </slot>

插槽其实就是在写 slot 的地方挖个坑，等着组件的使用者，即父组件，进行填充。子组件中使用插槽 slot 后，父组件可以在这个占位符中填充内容，包括数据、html代码、组件等，也就是说，当子组件的某部分内容是根父组件填充的不同而变化的，那我们就可以使用插槽slot，具体填充什么，由父组件而定。

让父组件向子组件指定位置插入html结构，也是一种组件间通信的方式，适用于父组件 => 子组件

##### 2.17.2 插槽的三种使用方法

###### 2.17.2.1 默认插槽

有两个组件，App是父组件，Child是子组件

父组件代码如下：
```vue
<template>
  <div class="parent">
    <span>我是父组件</span>
    <Child></Child>
  </div>
</template>
 
<script>
import Child from './components/Child'
export default {
  name:'app',
  components:{
    Child
  }
 
}
</script>
 
<style scoped>
.parent{
  width: 400px;
  height: 400px;
  background-color: #bfa;
}
</style>
```

子组件的代码：
```vue
<template>
  <div class="child">
    <div>我是子组件</div>
    <br>
    <slot>我是默认插槽,当父组件不填充任何内容时,我这句话才会出现</slot>
  </div>
</template>
 
<script>
export default {
  name:'Child',
  data() {
    return {
      
    }
  },
};
</script>
 
<style>
.child {
  width: 200px;
  height: 200px;
  background-color: lightblue;
  margin: auto;
}
</style>
```

启动项目，在浏览器中显示：
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231220144635291.png" alt="image-20231220144635291" style="zoom:50%;" />

这时候，我们已经使用 **slot** ，在子组件中占了一个坑，但是我们还没有填充内容，接下来填充内容：
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231220144720730.png" alt="image-20231220144720730" style="zoom:50%;" />

可以看到，填充的内容，确实在子组件中显示
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231220144826204.png" alt="image-20231220144826204" style="zoom:50%;" />

假如，我们去掉子组件的插槽，父组件在子组件填充的内容还能看到吗？我们来试一试：
可以看到：浏览器中，只显示两个组件原本的信息，父组件填充的内容是看不到的。
在 **slot** 中，不仅可以填充文字，也可以填充图片、视频、HTML结构等，如填充图片：
<img src="/Users/ray/Library/Application Support/typora-user-images/image-20231220144926816.png" alt="image-20231220144926816" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231220145008619.png" alt="image-20231220145008619" style="zoom:50%;" />

###### 2.17.2.2 具名插槽

>   具名插槽，顾名思义，就是带有名字的插槽，具有 **name** 属性，一个不带 **name** 的 **`<`slot`>`** 会带有默认的名字 **default** 。

在子组件中，**slot** 指定 **name** 属性
```vue
<template>
  <div class="child">
    <div>我是子组件</div>
    <br>
    <slot name="content">
      我是插槽默认的内容,当父组件不填充任何内容时,我这句话才会出现
    </slot>
  </div>
</template>
 
<script>
export default {
  name:'Child',
  data() {
    return {
      
    }
  },
};
</script>
 
<style>
.child {
  width: 200px;
  height: 200px;
  background-color: lightblue;
  margin: auto;
}
</style>
```

在父组件中，需要使用 **template** ，在 **template** 模板中，指定 **slot** 在子组件中的 **name** 值
```vue
<template>
  <div class="parent">
    <span>我是父组件</span>
    <Child>
      <template slot="content">
        <div>这是父组件在子组件中填充的内容，在子组件中显示</div>
        <br />
        <img src="https://s3.ax1x.com/2021/01/16/srJlq0.jpg" alt="" />
      </template>
    </Child>
  </div>
</template>
 
<script>
import Child from "./components/Child";
export default {
  name: "app",
  components: {
    Child,
  },
};
</script>
 
<style scoped>
.parent {
  width: 400px;
  height: 400px;
  background-color: #bfa;
}
img {
  width: 200px;
}
</style>
```

浏览器可以正常显示填充的内容：
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231220145432651.png" alt="image-20231220145432651" style="zoom:50%;" />

在引用子组件的代码中， **template** 中的**slot** 是根据等号 **=** 后面的值，来寻找对应的插槽 **slot** ，从而在对应的位置上，填充相应的内容。当我们使用的插槽数量比较多时，具名插槽就有很大的实用性。

###### 2.17.2.3 作用域插槽

>    如果数据在子组件，可以在子组件中直接使用数据，但根据数据生成的结构需要组件的使用者来决定，我们就需要用到作用域插槽，同时，我们也可以实现多种结构。

例如：games数据在子组件中，但使用数据所遍历出来的结构由父组件App决定

>   子组件中，使用 **<slot :games="games">** 指明使用什么数据，并将数据传给插槽的使用者

```vue
<template>
  <div class="child">
    <span>我是子组件</span>
    <h5>{{title}}</h5>
    <slot :games="games">
      我是插槽默认的内容,当父组件不填充任何内容时,我这句话才会出现
    </slot>
  </div>
</template>
 
<script>
export default {
  name:'Child',
  props:['title'],
  data() {
    return {
      games:['红色警戒','穿越火线','超级玛丽'],
    }
  },
};
</script>
 
<style>
.child {
  width: 200px;
  height: 200px;
  background-color: lightblue;
  margin: auto;
}
</style>
```

在父组件中，使用子组件通过插槽传递过来的数据，渲染结构，有3种形式：
```vue
<template>
  <div class="parent">
    <span>我是父组件</span>
    <Child title="游戏1">
			<template scope="youxi1">
        <!-- 无序列表结构 -->
				<ul>
					<li style="color:red" v-for="(g,index) in youxi1.games" :key="index">{{g}}</li>
				</ul>
			</template>
		</Child>
    <hr>
    <Child title="游戏2">
      <template slot-scope="youxi2">
        <!-- 有序列表结构 -->
        <ol>
          <li v-for="(g,index) in youxi2.games" :key=index>{{g}}</li>
        </ol>  
      </template>
    </Child>
    <hr>
    <Child title="游戏3">
      <template scope="{games}">
        <!-- h4结构 -->
        <h5 v-for="(g,index) in games" :key=index>{{g}}</h5>
      </template>
    </Child>
    <hr>
  </div>
</template>
 
<script>
import Child from "./components/Child";
export default {
  name: "app",
  components: {
    Child,
  },
};
</script>
 
<style scoped>
.parent {
  width: 400px;
  height: 700px;
  background-color: #bfa;
}
img {
  width: 200px;
}
</style>
```

<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231220145859693.png" alt="image-20231220145859693" style="zoom:50%;" />

 第1种：是基本用法，使用 **scope = " youxi1 "，youxi1** 是自定义的变量，来接收子组件传过来的数据，它是一个对象，使用插值语法，把 **youxi1** 打印出来：
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231220150052359.png" alt="image-20231220150052359" style="zoom:50%;" />

第2种：将 **scope** 替换为 **slot-scope**

第3种：使用 **es6** 解构赋值的方法，直接将对象数据解构为数组，然后进行 **v-for** 的遍历

上述的小案例，就实现了：使用同样的数据，父组件将其渲染成不同的结构，非常方便实用。 

##### 2.17.3 版本变化
 Vue 2.6.0 起，引入了 v-slot ,上文提到了3类插槽的 slot 和 slot-scope ，可以直接替换为 v-slot ，在vue2版本中，我们仍可以使用 slot 和 slot-scope ，但是在vue3中就只能使用v-slot了。详细内容参见 vue官方文档 的解释。

#### 2.18 数组转字符串（3种方法）和字符串转数组（2种）

##### 2.18.1 数组转字符串（3种方法）

同样是数组转字符串，toString()，toLocaleString()，join()，join(’,’)的区别是什么？

JavaScript 允许数组与字符串之间相互转换。其中 Array 方法对象定义了 3 个方法，可以把数组转换为字符串，如表所示。

| 数组方法         | 说明                                           |
| ---------------- | ---------------------------------------------- |
| toString()       | 将数组转换成一个字符串；把对象直接转换成字符串 |
| toLocaleString() | 把数组转换成本地约定的字符串                   |
| join()           | 将数组元素连接起来以构建一个字符串             |

1)   join()方法用于把数组中的所有元素放入一个字符串

元素是通过指定的分隔符进行分隔的

| join()指定的分隔符                          | 说明                                                         |
| ------------------------------------------- | ------------------------------------------------------------ |
| join()                                      | 可理解为直接变成字符串，默认逗号分隔                         |
| join(’ '）                                  | 空连接                                                       |
| join(’ ，’)或者 join(’ - ‘)或者 join(’ 。’) | 中间这个逗号是手动添加的，也可以改成别的比如、。! -等等都可以 |

<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231221153933353.png" alt="image-20231221153933353" style="zoom: 50%;" />

<img src="/Users/ray/Library/Application Support/typora-user-images/image-20231221154005133.png" alt="image-20231221154005133" style="zoom:50%;" />

<img src="/Users/ray/Library/Application Support/typora-user-images/image-20231221154035859.png" alt="image-20231221154035859" style="zoom:50%;" />

2)   toString()方法可把一个逻辑值转换为字符串，并返回结果

```javascript
var c = a.toString();  //把数组转换为字符串
console.log(c)
console.log(typeof c);  //返回字符串string，说明是字符串类型
//打印结果  00,01,02,03,04
```

toString()方法不可以指定分隔符，但是我们可以通过replace()方法指定替换

```javascript
var f = a.toString().replace(/,/gi,'-')
console.log(f)
//打印结果：00-01-02-03-04
```

3)   toLocaleString()

把数组转换成本地约定的字符串

```javascript
var e = a.toLocaleString();  
console.log(e)
console.log(typeof e);  
//打印结果：00,01,02,03,04
```

##### 2.18.2 字符串转数组（2种方法）

| 字符串方法      | 说明                   |
| --------------- | ---------------------- |
| split() 方法    | 将字符串转换成一个数组 |
| 扩展运算符（…） | es6里面的扩展运算符    |

1) split() 方法用于把一个字符串分割成字符串数组

同样是用于把一个字符串分割成字符串数组，split(’,’)，split()，split(’ '）的区别是什么？

| split()方法          | 说明                                 |
| -------------------- | ------------------------------------ |
| split(’,’)           |                                      |
| split()              | 可理解为直接变成字符串，默认逗号分隔 |
| split(’ '） 空字符串 | 每个字符之间都会被分割               |

<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231221154540339.png" alt="image-20231221154540339" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231221154559130.png" alt="image-20231221154559130" style="zoom:50%;" />

如果把空字符串 ("") 用作 separator，那么 stringObject 中的每个字符之间都会被分割

<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231221154628048.png" alt="image-20231221154628048" style="zoom:50%;" />

2)   es6里面的扩展运算符

<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231221154717953.png" alt="image-20231221154717953" style="zoom:50%;" />

#### 2.19 Vue和React

##### 2.19.1 核心思想不同
Vue是一个灵活易用的渐进式双向绑定的MVVM框架。
React的核心思想是声明式渲染和组件化、单向数据流，React既不属于MVC也不属于MVVM架构。
![image-20231228142608505](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231228142608505.png)

注：React的单向数据流指的是数据主要从父节点通过props传递到子节点，
如果顶层某个props改变了，React会重新渲染所有的子节点，但是单向数据流并非单向绑定，
React想要从一个组件去更新另一个组件的状态，需要进行状态提升，即将状态提升到他们最近的
祖先组件中，触发父组件的状态变更，从而影响另一个组件的显示。单向数据流的好处是能够保证
状态改变的可追溯性，假如，父组件维护了一个状态，子组件如果能够随意更改父组件的状态，那
么各组件的状态改变就会变得难以追溯

##### 2.19.2 组件写法上不同
Vue的组件写法是通过template的单文件组件格式。
React的组件写法是JSX+inline style，也就是吧HTML和CSS全部写进JavaScript中。

##### 2.19.3 Diff算法不同
Diff算法是一种对比算法，主要是对比旧的虚拟DOM和新的虚拟DOM，找出发生更改的节点，并只
更新这些接地那，而不更新未发生变化的节点，从而准确的更新DOM，减少操作真实DOM的次数，
提高性能。
vue对比节点，如果节点元素类型相同，但是className不同，认为是不同类型的元素，会进行删
除重建，但是react则会认为是同类型的节点，只会修改节点属性。
vue的列表比对采用的是首尾指针法，而react采用的是从左到右依次比对的方式，当一个集合只
是把最后一个节点移动到了第一个，react会把前面的节点依次移动，而vue只会把最后一个节点
移动到最后一个，从这点上来说vue的对比方式更加高效。

##### 2.19.4 响应式原理不同
React的响应式原理
React主要是通过setState()方法来更新状态，状态更新之后，组件也会重新渲染。

Vue的响应式原理
vue会遍历data数据对象，使用Object.definedProperty()将每个属性都转换为getter和
setter，每个Vue组件实例都有一个对应的watcher实例，在组件初次渲染的时候会记录组件用到
了那些数据，当数据发生改变的时候，会触发setter方法，并通知所有依赖这个数据的watcher实
例调用update方法去触发组件的compile渲染方法，进行渲染数据。

##### 2.19.5 React 与 VUE 共同点

React 与 Vue 存在很多共同点，例如他们都是 JavaScript 的 UI 框架，专注于创造前端的富应用。不同于早期的 JavaScript 框架“功能齐全”，Reat 与 Vue 只有框架的骨架，其他的功能如路由、状态管理等是框架分离的组件。

*优势*

**React**

-   灵活性和响应性：它提供最大的灵活性和响应能力。
-   丰富的JavaScript库：来自世界各地的贡献者正在努力添加更多功能。
-   可扩展性：由于其灵活的结构和可扩展性，React已被证明对大型应用程序更好。
-   不断发展： React得到了Facebook专业开发人员的支持，他们不断寻找改进方法。
-   Web或移动平台： React提供React Native平台，可通过相同的React组件模型为iOS和Android开发本机呈现的应用程序。

**Vue**

-   易于使用： Vue.js包含基于HTML的标准模板，可以更轻松地使用和修改现有应用程序。
-   更顺畅的集成：无论是单页应用程序还是复杂的Web界面，Vue.js都可以更平滑地集成更小的部件，而不会对整个系统产生任何影响。
-   更好的性能，更小的尺寸：它占用更少的空间，并且往往比其他框架提供更好的性能。
-   精心编写的文档：通过详细的文档提供简单的学习曲线，无需额外的知识; HTML和JavaScript将完成工作。
-   适应性：整体声音设计和架构使其成为一种流行的JavaScript框架。它提供无障碍的迁移，简单有效的结构和可重用的模板。

##### 2.19.6 总结

如上所说的 Vue 的响应式机制也有问题，当 state 特别多的时候，Watcher 会很多，会导致卡顿，所以大型应用（状态特别多的）一般用 React，更加可控。可对于易用性来说，VUE 是更容易上手的，对于项目来说新人更容易接手。

使用 Reac 的公司：Facebook，Instagram，Netflix，纽约时报，雅虎，WhatsApp，Codecademy，Dropbox，Airbnb，Asana，微软等。

使用 Vue 的公司：Facebook，Netflix，Adobe，Grammarly，Behance，小米，阿里巴巴，Codeship，Gitlab和Laracasts等。

#### 2.20 rem和em

##### 2.20.1 什么是rem?
rem是根元素字体的单位，比如 `html{font-size:16px;}` ，1rem相当于16px。
不仅仅可以给字体用，其他px单位的都可以用，比如设`padding:2rem` ，相当于32px。
1、rem的大小是根据html根目录下的字体大小进行计算的。
2、当我们改变根目录下的字体大小的时候，下面字体都改变。
3、rem不仅可以设置字体的大小，也可以设置元素宽、高等属性。

如何使用？
1 . 给根元素设置字体大小，并在body元素校正

```html
html{font-size:100px;}
body{font-size:14px;}
```

如上设置后，使用rem代替px，直接除100即可
```css
.menu li{
	display: table-cell;
	padding: .1rem .3rem;/*相当于10px 30px*/
}
```

2 . 绑定监听事件，dom加载后和尺寸变化时改变font-size

**注意把代码中的 `1536` 修改为实际开发时页面的宽度**

```javascript
//改变font-size
(function(doc,win){
    var docEI = doc.documentElement,
    resizeEvt = 'orientationchange' in window?'orientataionchange':'resize',
    recalc = function(){
        var clientWidth = docEI.clientWidth;
        if(!clientWidth) return;
        //100是字体大小，1536是开发时浏览器窗口的宽度，等比计算
        docEI.style.fontSize = 100*(clientWidth/1536)+'px';
    }

    if(!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document,window);
```

##### 2.20.2 em

CSS 中的 `em` 单位是一个相对的测量单位，用于测量网页上元素的大小，主要是字体大小。因为它是相对于其父元素而言的，所以 1 个 `em` 等于**父元素**中设置的**字体大小**。

这意味着如果你将父 `div` 中的字体大小设置为 `20px`，并将子 `div` 的字体大小设置为 `2em`，那么子 `div` 中的字体大小将等于 `40px`。

```html
<div class="parent">
  I'm parent div set to 20px
  <div class="child">
    I'm the child div set to 2em, i.e 40px.
  </div>
</div>
```

```css
.parent{
  font-size: 20px;
}

.child{
  font-size: 2em;
}

// <p> 元素中的文字大小将是父级元素或未设置父元素字体大小事为浏览器默认字体大小的 1.5 倍
p {
  font-size: 1.5em;
}
```

会得到如下结果：
![image-20240104144533069](https://gitee.com/KingsRay/gitee-image-host/raw/master/image/image-20240104144533069.png)

`em` 单位很有用，因为它允许你根据之前所说的元素的字体大小来调整页面上的元素的大小，这有助于创建一个一致的视觉层次结构。这对创建无障碍网站很有帮助，可以让有视觉障碍的用户容易阅读。

需要注意的是，如果你没有指定父元素的值，浏览器的默认值会被当作父元素。

#### 2.21 keep-alive

keep-alive 是 vue 中的内置组件，能够在组件切换过程中将状态保留在内存中，防止重复的渲染 DOM；
keep-alive 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们；
设置了 keep-alive 缓存的组件，会多出两个生命周期钩子（activated 和 deactivated ）

**props**

-   `include` 字符串或者正则表达式，只有名称匹配的组件会被缓存
-   `exclude` 字符串或者正则表达式，任何名臣匹配的组件都不会被缓存
-   `max` 数字，最多可以缓多少组件实例

`keep-alive`是一个组件，这个组件中有三个属性，分别是`include`、`exclude`、`max`，在`created`中创建缓存列表和缓存组件的key列表，销毁的时候会做一个循环销毁清空所有的缓存和key。当`mounted`时会监控`include`和`include`属性，进行组件的缓存处理。

#### 2.22 vue.nextTick()方法

在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

使用：
```javascript
this.$nextTick(function(){
    console.log(that.$refs.aa.innerText);  //输出：修改后的值
})
```

什么时候需要用的Vue.nextTick()？
1、Vue生命周期的created()钩子函数进行的DOM操作一定要放在Vue.nextTick()的回调函数中，原因是在created()钩子函数执行的时候DOM 其实并未进行任何渲染，而此时进行DOM操作无异于徒劳，所以此处一定要将DOM操作的js代码放进Vue.nextTick()的回调函数中。与之对应的就是mounted钩子函数，因为该钩子函数执行时所有的DOM挂载已完成。
2.vue改变dom元素结构后使用vue.$nextTick()方法来实现dom数据更新后延迟执行后续代码
