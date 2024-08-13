## Android

### 1 Kotlin语言相关

#### 1.1 Kotlin的特性,与Java的区别

1.  语法：Kotlin 的语法比 Java 更简洁、更易读，可以更快地编写代码。Kotlin 还支持一些新的特性，如 null 安全、扩展函数和 lambda 表达式等。
2.  性能：虽然 Kotlin 是在 JVM 上运行的，但是相比于 Java，Kotlin 在某些方面可能更快，因为 Kotlin 的编译器能够生成更为紧凑的字节码。此外，Kotlin 还支持协程，这使得编写异步代码变得更加容易，同时也提高了应用程序的性能。
3.  互操作性：Kotlin 和 Java 可以相互调用。Kotlin 可以调用 Java 代码，反之亦然。这使得在已有的 Java 代码库中使用 Kotlin 或者在 Kotlin 应用程序中使用 Java 库变得容易。
4.  安全性：Kotlin 支持空安全，这意味着可以避免出现 null 引用异常。在编写 Kotlin 代码时，需要使用 ? 操作符来标记变量是否可以为 null。

#### 1.2 Kotlin协程的使用场景和原理

​    Kotlin协程是Kotlin语言中的轻量级线程抽象，它可以更轻松地实现异步编程。它的基本原理是在一个单独的线程中，使用Kotlin的协程抽象，可以创建一个单独的受控环境，用于管理协程的执行。
​    Kotlin协程的基本原理是基于挂起函数 (suspend function) 和协程构建器 (coroutine builder来实现的。挂起函数可以挂起一个正在运行的协程，而不会抛出异常。协程构建器可以创建一个新的协程，并且可以指定该协程的上下文环境和挂起点。
​    Kotlin协程可以处理多个任务，每个任务都能够在自己的协程中运行，而不会影响其他任务的运行。同时，Kotlin协程可以实现非阻塞式I/O操作，以提高程序的性能。

协程的**特点**有：

-   协程可以让异步代码同步化，其本质是轻量级线程。
-   可在单个线程运行多个协程，其支持挂起，不会使运行协程的线程阻塞。
-   可以降低异步程序的设计复杂度。

场景：

1.   比如有一些网络请求需要进行回调再处理另一个网络请求，甚至更多的需要按照顺序执行的网络请求，kotlin可以类似vue await方式，顺序执行。
2.   一种非抢占式或者协作式的计算机程序并发调度实现，程序可以主动挂起或者恢复执行，其核心点是函数或一段程序能够被挂起，稍后再在挂起的位置恢复，通过主动让出运行权来实现协作，程序自己处理挂起和恢复来实现程序执行流程的协作调度。 **协程本质上是轻量级线程。**

#### 1.3 Kotlin高阶函数、扩展函数的使用

​    高阶函数是指在 Kotlin 中， **使用函数作为变量或者返回值** 的函数。使用 lambda 表达式，我们可以更简洁地使用 Kotlin 的高阶函数。
在 Kotlin 中，可以给函数加上 inline 前缀，表示该函数是内联函数
如果不进行内联，则在传入函数类型参数时，实际上是新创建了一个对象然后传入
如果进行内联，则不会新创建一个对象，而是将传入函数的代码直接插入到调用该内联函数处
一般只有在函数参数列表中包含有高阶函数时才使用 inline 关键字，因为 Java 会识别函数并在特定情况下进行自动内联，因此通过加入 inline 关键字来优化调用这些函数所消耗的性能是微不足道的
使用内联函数没有创建新对象，节约了性能的开销。

​    扩展函数是定义在类的外面，把要扩展的类或者接口的名称，放到即将添加的函数前面。这个类或者接口就被称为接收者类型；用来调用这个扩展函数的那个对象，叫作接收者对象。另外，这里的扩展函数，可以像普通的成员函数一样，省略掉 this。
在 Kotlin 中，类型和类是不一样的。对于一个非泛型类，对应着非空类型和可空类型
扩展函数是不可以重写的

### 2 Android系统架构知识

#### 2.1 Activity、Fragment、View等组件工作流程

##### 2.1.1 Activity启动流程

​      Step 1. 无论是通过Launcher来启动Activity，还是通过Activity内部调用startActivity接口来启动新的Activity，都通过Binder进程间通信进入到ActivityManagerService进程中，并且调用ActivityManagerService.startActivity接口； 

​     Step 2. ActivityManagerService调用ActivityStack.startActivityMayWait来做准备要启动的Activity的相关信息；

​     Step 3. ActivityStack通知ApplicationThread要进行Activity启动调度了，这里的ApplicationThread代表的是调用ActivityManagerService.startActivity接口的进程，对于通过点击应用程序图标的情景来说，这个进程就是Launcher了，而对于通过在Activity内部调用startActivity的情景来说，这个进程就是这个Activity所在的进程了；

​     Step 4. ApplicationThread不执行真正的启动操作，它通过调用ActivityManagerService.activityPaused接口进入到ActivityManagerService进程中，看看是否需要创建新的进程来启动Activity；

​     Step 5. 对于通过点击应用程序图标来启动Activity的情景来说，ActivityManagerService在这一步中，会调用startProcessLocked来创建一个新的进程，而对于通过在Activity内部调用startActivity来启动新的Activity来说，这一步是不需要执行的，因为新的Activity就在原来的Activity所在的进程中进行启动；

​     Step 6. ActivityManagerServic调用ApplicationThread.scheduleLaunchActivity接口，通知相应的进程执行启动Activity的操作；

​     Step 7. ApplicationThread把这个启动Activity的操作转发给ActivityThread，ActivityThread通过ClassLoader导入相应的Activity类，然后把它启动起来。

![activity生命周期](https://gitee.com/KingsRay/gitee-image-host/raw/master/image/activity%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.png)

##### 2.1.2 Fragment启动流程和生命周期

<center>
    <img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/webp" alt="img" style="zoom:50%;" />
    <img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/webp-20231026150006490" alt="img" style="zoom:50%;" />
</center>

​    

Fragment 中两个最重要的概念出现了，FragmentManager 和 FragmentTransaction(事务是指一组原子性的操作，这些操作是不可分割的整体，要么全完成，要么全不完成，完成后可以回滚到完成前的状态)。
FragmentManager 封装着对 Fragment 操作的各种方法，addFragment(), removeFragment() 等等，而 FragmentActivity 通过 FragmentController 来操作 FragmentManager。
它们均为抽象类，需要具体的实现类。
FragmentManager 的实现类为 FragmentManagerImpl，其内部逻辑已全部移至 FragmentManager 中，是个空实现。
FragmentTransaction 的实现类为 BackStackRecord ，其内部引用了 FragmentManager 的实例 ，同时重写了父类的 四个 commit(...) 相关的方法。

FragmentTransaction的4种提交方式

-   **commit()**：如果在宿主执行了`onSaveInstanceState`之后再执行该操作,会抛出异常。属于异步操作（不是子线程操作，而是会将操作发送的主线程的轮询队列中，当主线程轮询到了才进行事务的操作。）
-   **commitAllowStateLoss()**：如果在宿主执行了`onSaveInstanceState`之后再执行该操作，不会去检查宿主状态，不会抛出异常。但该操作不会被Activity记录，恢复时也就没办法恢复这些提交操作，所以该操作适用不重要的事务。同属于异步事务。
-   **commitNow()**：会立刻执行当前提交的`Transaction`事务。属于同步事务。
-   **commitNowAllowStateLoss()**：具备以上两者的特性，既是同步执行，也不会检查宿主的状态，有可能该操作不会被正确恢复。

一般情况选择`commitNowAllowStateLoss()`,这样不会抛出异常中断用户的操作。

##### 2.1.3 View工作机制

###### View的工作流程

-   messure：测量View的宽和高
-   layout：确定View在父容器中的位置
-   draw：将View绘制在屏幕上

###### View的分发机制

<center>
    <img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM4MzUwNjM1,size_16,color_FFFFFF,t_70.png" alt="在这里插入图片描述" style="zoom:50%;" />
    <img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM4MzUwNjM1,size_16,color_FFFFFF,t_70-20231026151243377.png" alt="在这里插入图片描述" style="zoom:50%;" />
</center>



###### 自定义View

1.自定义View的分类
继承View重写onDraw方法
主要用于实现一些不规则的效果。当需要静态或者动态的实现一些不规则的图形的时候。
继承ViewGroup派生出特殊的Layout
主要用户实现自定义布局，当某种效果看起来很像几种View组合在一起的时候。
继承特定的View
比较常见，一般是扩展现有View的功能。
继承特定的ViewGroup
和第二个接近，但是不需要自己处理ViewGroup的测量和布局这两个过程。
2.自定义View须知
让View支持wrap_content
如果有必要，让你的View支持padding
尽量不要在View中使用Handler,，没必要
View中如果有线程或者动画，需要即时停止
View带有滑动的嵌套情形时，需要处理滑动冲突

#### 2.2 Android系统启动过程、消息机制

![img](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/dcdc5d1d92e548058aa92be6e3b774ea.png)

事件分发机制

![image-20231026153239819](https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231026153239819.png)

消息分发机制handler
Android的消息机制也是Handler机制，主要的作用是用来在不同线程之间的通信，通常使用在子线程执行完成一些耗时操作，需要回到主线程更新界面UI时,通过Handler将有关UI的操作切换到主线程。

**Handler机制中最重要的四个对象**

-   Handler：负责发送消息及处理消息
-   Looper：复制不断的从消息队列中取出消息，并且给发送本条消息的Handler
-   MessageQueue：负责存储消息
-   Message：消息本身，负责携带数据

#### 2.3 Android 历代版本主要变化

这里只站在开发者的角度，谈论一下 Android 5.0 之后的版本的主要变化

```Android 5.0 L```
开始支持64位的处理器
开始全面由 Dalvik 虚拟机转成ART虚拟机

```Android 6.0 M```
增加全新的动态权限机制（运行时权限）
取消支持 Apache HTTP 客户端

```Android 7.0 N```
系统权限的更改，分享私有文件内容的推荐方法是使用 FileProvider，禁止向你的应用外公开 file:// URI

```Android 8.0 O```
通知渠道 — Notification Channels
画中画模式 — PIP

```Android 9.0 P```
异型屏适配
使用前台服务，必须请求 FOREGROUND_SERVICE 权限
不能直接非 Activity 环境中（比如Service，Application）启动 Activity，否则会崩溃报错。保活的说法从此之后越来越少

```Android 10 Q```
新增深色主题的背景（暗黑模式）
用户存储权限的变更
在外部存储设备中为每个应用提供了一个“隔离存储沙盒”，任何其他应用都无法直接访问您应用的沙盒文件。
文件是应用的私有文件，因此不再需要任何权限即可在外部存储设备中访问和保存自己的文件。
此变更可让您更轻松地保证用户文件的隐私性，并有助于减少应用所需的权限数量。
根目录($rootDir)：/storage/emulated/0（不一定，不同设备可能不同），通过Environment.getExternalStorageDirectory()获取。
应用程序目录(a p p l i c a t i o n D i r ) ： applicationDir)：applicationDir)：rootDir/Andorid/data/包名
应用缓存目录：$applicationDir/cache，通过Context.getExternalCacheDir()获取。
应用文件目录：$applicationDir/files， 通过Context.getExternalFilesDir(String type)，type为空字符串时获取。type系统提供了很多常用的类型，比如图片和下载等等:
public static String DIRECTORY_MUSIC = "Music";
public static String DIRECTORY_ALARMS = "Alarms";
public static String DIRECTORY_NOTIFICATIONS = "Notifications";
public static String DIRECTORY_PICTURES = "Pictures";
public static String DIRECTORY_MOVIES = "Movies";
public static String DIRECTORY_DOWNLOADS = "Download";
public static String DIRECTORY_DCIM = "DCIM";
public static String DIRECTORY_DOCUMENTS = "Documents";

Environment.getExternalStorageDirectory():            /storage/emulated/0
Context.getExternalCacheDir():                              /storage/emulated/0/Android/data/com.learn.test/cache
Context.getExternalFilesDir(""):                             /storage/emulated/0/Android/data/com.learn.test/files
Context.getExternalFilesDir("test"):                        /storage/emulated/0/Android/data/com.learn.test/files/test
Context.getExternalFilesDir(Environment.DIRECTORY_PICTURES):    /storage/emulated/0/Android/data/com.learn.test/files/Pictures
具体路径在 sd 卡的 Android 目录下面，此目录下有 data、media、obb、obj
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231028135139947.png" alt="image-20231028135139947" style="zoom:33%;" />

data 目录下拥有所有已安装的app的包名为路径的文件夹
<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231028135050858.png" alt="image-20231028135050858" style="zoom: 33%;" />

访问这些文件不需要申请动态权限，这些文件会随着app的卸载而删除，且并不会使app本身越用越大，跟内部存储是两个地方

引入了新的位置权限 ACCESS_BACKGROUND_LOCATION，新权限仅会影响应用在后台运行时对位置信息的访问权。除非应用的某个 Activity 可见或应用正在运行前台服务，否则应用将被视为在后台运行

```Android 11 R```
更改了应用在读取电话号码时使用的与电话相关的权限
TelecomManager 类中的 getLine1Number() 方法、TelecomManager 类中的 getMsisdn() 方法
也就是当用到这两个API的时候，原来的READ_PHONE_STATE权限不管用了，需要READ_PHONE_NUMBERS权限才行
需要 APK 签名方案 v2

```Android 12 S```
前台服务优化
JDK版本强制JDK11
蓝牙权限
将蓝牙扫描与位置权限进行了分离，解决了长久以来打开蓝牙需要申请定位权限的系统级 bug
引入了 BLUETOOTH_SCAN、BLUETOOTH_ADVERTISE 和 BLUETOOTH_CONNECT 权限。这些权限可让以 Android 应用更轻松地与蓝牙设备互动，不再需要申请设备位置信息相关权限。
应用启动页
系统会在应用的冷启动和暖启动时，使用新的启动页 SplashScreen，该启动页默认由应用ICON + 应用主题的windowBackground内容构成
所有的App在每次启动时（特指冷启动与温启动），系统都会为我们加上一个默认的启动画面

### 3 Android核心组件

#### 3.1 android四大组件

**Activity（活动）**：Activity是用户界面的基本构建块，它代表应用程序中的一个屏幕。每个Activity都有一个用户界面，用户可以与之进行交互。例如，登录界面、设置页面和聊天窗口等都可以作为一个Activity存在。

**Service（服务）**：Service是在后台执行长时间运行操作的组件，它没有用户界面。Service通常用于执行一些耗时的任务、处理网络请求、播放音乐等。它可以在后台运行，即使用户切换到其他应用程序或锁定屏幕，Service也可以继续执行。

**Broadcast Receiver（广播接收器）**：Broadcast Receiver是用于接收和响应系统广播消息的组件。广播消息可以来自系统（例如，设备启动完成）或其他应用程序（例如，发送自定义广播）。Broadcast Receiver可以注册监听特定类型的广播消息，并在接收到广播时执行相应的操作。

**Content Provider（内容提供器）**：Content Provider是用于实现应用程序间数据共享的组件。它提供了一种结构化的方式来管理应用程序中的数据，并允许其他应用程序通过URI访问和修改这些数据。Content Provider可用于共享数据，如联系人信息、数据库内容或文件等。

#### 3.2  Jetpack组件

ViewModel

LiveData

Room

### 4 用户界面
\- 布局组件:ConstraintLayout、RecyclerView等
\- Material Design实现 responsive UI
\- 自定义View原理



### 5 性能优化
\- 内存优化:避免内存泄漏等
\- 绘制优化:过渡绘制、避免过度绘制等
\- 平滑体验:预加载、缓存等



### 6 网络请求处理
\- Retrofit等网络请求库的使用
\- OkHttp拦截器实现统一处理
\- 图片加载处理:Glide、Picasso等使用



### 7 其它
\- 动画实现
\- 数据存储:Room、SharePreference使用
\- 多线程:AsyncTask、Handler等



## Java

### 1 JVM

​        JVM是Java Virtual Machine（Java虚拟机）的缩写，JVM是一种用于计算设备的规范，它是一个虚构出来的计算机，是通过在实际的计算机上仿真模拟各种计算机功能来实现的。Java虚拟机包括一套字节码指令集、一组寄存器、一个栈、一个垃圾回收堆和一个存储方法域。 JVM屏蔽了与具体操作系统平台相关的信息，使Java程序只需生成在Java虚拟机上运行的目标代码（字节码）,就可以在多种平台上不加修改地运行。JVM在执行字节码时，实际上最终还是把字节码解释成具体平台上的机器指令执行。

<img src="https://cdn.jsdelivr.net/gh/raychin/ImageHosting/image/image-20231030093557483.png" alt="image-20231030093557483" style="zoom: 33%;" />

**1、Class Loader 类加载器**

类加载器的作用是加载类文件到内存，比如编写一个HelloWord.java 程序，然后通过javac 编译成class 文件，那怎么才能加载到内存中被执行呢？Class Loader 承担的就是这个责任，那不可能随便建立一个.class 文件就能被加载的，Class Loader 加载的class 文件是有格式要求。

Class Loader 只管加载，只要符合文件结构就加载，至于说能不能运行，则不是它负责的，那是由Execution Engine 负责的。

**2、Execution Engine 执行引擎**

执行引擎也叫做解释器(Interpreter) ，负责解释命令，提交操作系统执行。

**3、Native Interface 本地接口**

本地接口的作用是融合不同的编程语言为Java 所用，它的初衷是融合C/C++ 程序，Java 诞生的时候是C/C++ 横行的时候，要想立足，必须有一个聪明的、睿智的调用C/C++ 程序，于是就在内存中专门开辟了一块区域处理标记为native 的代码，它的具体做法是Native Method Stack 中登记native 方法，在Execution Engine 执行时加载native libraies 。目前该方法使用的是越来越少了，除非是与硬件有关的应用，比如通过Java 程序驱动打印机，或者Java 系统管理生产设备，在企业级应用中已经比较少见，因为现在的异构领域间的通信很发达，比如可以使用Socket 通信，也可以使用Web Service 等等，不多做介绍。

**4、 Runtime data area 运行数据区**

运行数据区是整个JVM 的重点。我们所有写的程序都被加载到这里，之后才开始运行，Java 生态系统如此的繁荣，得益于该区域的优良自治。

整个JVM 框架由加载器加载文件，然后执行器在内存中处理数据，需要与异构系统交互是可以通过本地接口进行，瞧，一个完整的系统诞生了！

### 2 内存管理

**1、 Stack 栈**

栈也叫栈内存，是Java程序的运行区，是在线程创建时创建，它的生命期是跟随线程的生命期，线程结束栈内存也就释放。栈中的数据都是以栈帧（Stack Frame）的格式存在，栈帧是一个内存区块，是一个数据集，是一个有关方法(Method)和运行期数据的数据集，当一个方法A被调用时就产生了一个栈帧F1，并被压入到栈中，A方法又调用了B方法，于是产生栈帧F2也被压入栈，执行完毕后，先弹出F2栈帧，再弹出F1栈帧，遵循“先进后出”原则。
栈帧中主要保存3类数据：本地变量（Local Variables），包括输入参数和输出参数以及方法内的变量；栈操作（Operand Stack），记录出栈、入栈的操作；栈帧数据（Frame Data），包括类文件、方法等等。

<img src="https://pic1.zhimg.com/v2-d6673a2d45a8494a396b9d93f6cf1d84_r.jpg" alt="img" style="zoom:33%;" />

**2、Heap 堆内存**

jvm中分为堆和方法区，**堆**又进一步分为**新生代和老年代，方法区为永久代。**
堆中区分的新生代和老年代是为了垃圾回收，新生代中的对象存活期一般不长，而老年代中的对象存活期较长，所以当垃圾回收器回收内存时，新生代中垃圾回收效果较好，会回收大量的内存，而老年代中回收效果较差，内存回收不会太多。

**Permanent Space 永久存储区**

永久存储区是一个常驻内存区域，用于存放JDK自身所携带的Class,Interface的元数据，也就是说它存储的是运行环境必须的类信息，被装载进此区域的数据是不会被垃圾回收器回收掉的，关闭JVM才会释放此区域所占用的内存。

**Young Generation Space 新生区**

新生区是类的诞生、成长、消亡的区域，一个类在这里产生，应用，最后被垃圾回收器收集，结束生命。新生区又分为两部分：伊甸区（Eden space）和幸存者区（Survivor pace），所有的类都是在伊甸区被new出来的。幸存区有两个： 0区（Survivor 0 space）和1区（Survivor 1 space）。当伊甸园的空间用完时，程序又需要创建对象，JVM的垃圾回收器将对伊甸园区进行垃圾回收，将伊甸园区中的不再被其他对象所引用的对象进行销毁。然后将伊甸园中的剩余对象移动到幸存0区。若幸存0区也满了，再对该区进行垃圾回收，然后移动到1区。那如果1区也满了呢？再移动到养老区。

**Tenure generation space养老区**

养老区用于保存从新生区筛选出来的JAVA对象，一般池对象都在这个区域活跃。 三个区的示意图如下：

<img src="/Users/ray/Library/Application Support/typora-user-images/image-20231030094304504.png" alt="image-20231030094304504" style="zoom:33%;" />

**3、 Method Area 方法区**

方法区是被所有线程共享，该区域保存所有字段和方法字节码，以及一些特殊方法如构造函数，接口代码也在此定义。

**4、PC Register 程序计数器**

每个线程都有一个程序计数器，就是一个指针，指向方法区中的方法字节码，由执行引擎读取下一条指令。

**5、Native Method Stack 本地方法栈**

### 3 GC回收机制和常用的垃圾回收器

GC (*Garbage Collection*)的基本原理：将内存中不再被使用的对象进行回收，GC中用于回收的方法称为收集器，由于GC需要消耗一些资源和时间，Java在对对象的生命周期特征进行分析后，按照新生代、旧生代的方式来对对象进行收集，以尽可能的缩短GC对应用造成的暂停

（1）对新生代的对象的收集称为minor GC；

（2）对旧生代的对象的收集称为Full GC；

（3）程序中主动调用System.gc()强制执行的GC为Full GC。

不同的对象引用类型， GC会采用不同的方法进行回收，JVM对象的引用分为了四种类型：

（1）强引用：默认情况下，对象采用的均为强引用（这个对象的实例没有其他对象引用，GC时才会被回收）

（2）软引用：软引用是Java中提供的一种比较适合于缓存场景的应用（只有在内存不够用的情况下才会被GC）

（3）弱引用：在GC时一定会被GC回收

（4）虚引用：由于虚引用只是用来得知对象是否被GC



常用的垃圾回收器

**1）Serial（-XX:+UseSerialGC）**

Serial 是Java虚拟机初代收集器，在JDK1.3之前是Java虚拟机**新生代收集器**的唯一选择，这是一个单线程工作的收集器。在进行垃圾回收的时候，需要暂停所有的用户线程，直到回收结束。
**Serial 负责收集新生代区域，它采用标记-复制算法。**

**2）Serial Old（-XX:+UseSerialOldGC）**

SerialOld 是 Serial 收集器的老年代版本，和 Serial 一样，它也是单线程的收集器。目前主要应用在客户端模式（Client VM）下的HotSpot虚拟机使用。

**SerialOld 负责收集老年代区域，它采用标记-整理算法。**

**3）Parallel Scavenge（-XX:+UseParallelGC）**

Parallel Scavenge 从外观上看，和 ParNew 很相似，都是新生代的收集器，支持多线程并行回收，也同样是使用标记-复制来作为回收算法。但 Parallel Scavenge 的关注点不一样，它的目标是实现一个可控制吞吐量的垃圾收集器。

吞吐量的计算公式：运行用户代码时间 / (运行用户代码时间 + 运行垃圾收集时间)

假设运行用户代码时间是 99 分钟，运行垃圾收集时间是 1 分钟，结合计算公式 ：吞吐量 = 99 / (99 + 1) = 0.99，也就是 99% 的吞吐量。

Parallel Scavenge 收集器提供了一些参数，给用户按自身需求控制吞吐量：

>   -XX:MaxGCPauseMillis
>   控制垃圾收集停顿的最大时间，单位是毫秒，可以设置一个大于0的数值。
>   不要想着把这个数值设置得很小来提升垃圾收集的速度，这里缩短的停顿时间是以牺牲新生代空间大小换来的，空间小，回收自然就快，停顿时间自然也短，但是空间小，吞吐量自然也会小。所以得综合考虑。
>
>   -XX:GCTimeRatio
>   设置垃圾收集时间占比的计算因子，参数范围是0 - 100的整数。它的公式是 1 / (1+GCTimeRatio)
>   举个栗子：当设置成15，那就是 1 / (1+15) = 0.0625，就是允许最大垃圾收集时间占总时间的6.25%，当设置成99的时候，就是 1 / (1+99) = 0.01，也就是允许最大垃圾收集时间占总时间的1%，依次类推。
>
>   -XX:+UseAdaptiveSizePolicy
>   动态调整开关，这个参数和 Parallel Scavenge 收集器无关，但是搭配起来使用是一个很好的选择。
>   当这个参数被激活，就不需要人工指定新生代的大小、Eden和Survivor区的比例、对象直接进入老年代的大小等等细节参数了，JVM会根据当前运行的情况动态调整，给出最合适的停顿时间和吞吐量。搭配以上两个参数，和把基本的内存数据设置好即可，例如堆的最大占用空间等等。

**4）Parallel Old（-XX:+UseParallelOldGC）**

就像 Serial Old 是 Serial 的老年代版本一样，Parallel Old 是 Parallel Scavenge 的老年代版本。

Parallel Old 也支持多线程并行回收的能力，使用标记-整理来作为回收算法。这个收集器是JDK6的时候推出的，和 Parallel Scavenge 搭配，在多CPU核心和大内存的场景下，吞吐性能优秀。

在注重吞吐量和多CPU核心的情况下，都可以优先考虑 Parallel Scavenge + Parallelo Old 收集器，**这也是JDK8默认的垃圾收集器组合**。

**5）CMS （-XX:+UseConcMarkSweepGC）**

CMS（Concurrent Mark Sweep） 是JDK1.4后期推出的GC收集器，它是一款并发低停顿的收集器，对于响应速度有较高要求，对停顿时间忍受度低的应用，非常适合使用CMS作为垃圾收集器。

**CMS 负责收集老年代区域，它采用标记-清除算法。**

**6）Garbage First（G1）**

G1 是 Garbage First 收集器的简称，它在JDK7的时候立项，JDK8 Update 40的时候才全部完工。这个收集器在JDK9 的时候成为了服务端模式下的默认垃圾收集器。

G1 收集器的设计理念是：实现一个**停顿时间可控的低延迟垃圾收集器**

参考：https://zhuanlan.zhihu.com/p/25539690?utm_source=ZHShareTargetIDMore
