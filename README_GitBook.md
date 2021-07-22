# 现代的 CMake 的介绍

人们喜爱讨厌构建系统。
CppCon17 的讲座就是一个开发者们将构建系统当成头等笑话的例子。
这引出了一个问题：为什么（人们这样认为）？
确实，使用构建系统构建项目时不乏这样那样的问题。
但我认为，在 2020 年，我们有一个非常好的解决方案来消除其中的一些问题。
那就是 CMake 。但不是 CMake 2.8 ，它比 c++11 还要早出现。
也不是那些糟糕的 CMake 例程（甚至包括那些 KitWare 自己的教程里发布的例子）。
我指的是现代的 CMake 。是 CMake 3.4+ ，甚至是 CMake 3.21+ ！
它简洁、强大、优雅，所以你能够花费你的大部分时间在编写代码上，而不是在一个不可读、不可维护的 Make （或 CMake 2） 文件上浪费时间。
并且 CMake 3.11+ 的构建速度应该也会更加的快！！！

{% hint style='working' %}
本书是一篇持续维护的文档。你可以在 [GitLab](https://gitlab.com/CLIUtils/modern-cmake) 上提 issue 或是 合并请求。
你也可以 [下载PDF](https://CLIUtils.gitlab.io/modern-cmake/modern-cmake.pdf) 格式的副本。请务必查看一下 [HSF CMake Training](https://hsf-training.github.io/hsf-training-cmake-webpage/01-intro/index.html) （也是一个 CMake 教程）!
{% endhint %}

简而言之, 如果你正在考虑使用Modern CMake，以下是你心中最可能存在的问题:

## 为什么我需要一个好的构建系统？

以下情况是否适用于你？

* 你想避免将路径硬编码
* 你需要在不止一台电脑上构建软件包
* 你想在项目中使用CI（持续集成）
* 你需要支持不同的操作系统（甚至可能只是Unix的不同版本）
* 你想支持多个编译器
* 你想使用IDE，但也许不总是使用
* 你想从逻辑上描述你的程序是如何结构的，而不是通过某些标志和命令
* 你想使用一个第三方库
* 你想使用工具，比如Clang-Tidy，来帮助你编码
* 你想使用调试器来debug

如果是这样，你会从类似CMake的构建系统中受益。

## 为什么答案一定是CMake？

构建系统是一个热门话题。当然，有很多构建系统可选。但是，即使是一个真的非常好的构建系统，或者一个使用类似（CMake）的语法的，也不能达到 CMake 的使用体验。
为什么？
因为生态。
每个 IDE 都支持 CMake（或者是 CMake 支持那个 IDE）。
使用 CMake 构建的软件包比使用其他任何构建系统的都多。
所以，如果你想要在你的代码中包含一个库，你有两个选择，要么自己写一个构建系统，要么使用该库支持的构建系统中的某个。而那通常包含 CMake。
如何你的工程包含的库多了，CMake 或很快成为那些库所支持的构建系统的交集。并且，如果你使用一个预装在系统中的库，它有很大可能有一个 find CMake 或者是一个 config CMake 的脚本。


## 为什么使用现代的 CMake ？

大概在 CMake 2.6-2.8 时， CMake 开始成为主流。它出现在大多数 Linux 操作系统的包管理器中，并被用于许多包中。

接着 Python 3 出现了。

这是一个直到现在某些的工程中进行的非常艰难、丑陋的迁移。

我知道，这和 CMake 没有任何关系。

但它们有一个 3 ,并且都跟在 2 后面。


所以我相信 CMake 3 跟在 Python 3 后面真是十分倒霉。[^1]
因为尽管每一个版本的CMake都有良好的向后兼容性，但 CMake 3 却总是被当作新事物来对待。
你会发现像 CentOS7 这样的操作系统，其上的 GCC 4.8几乎完全支持 C++14 ，而 CMake 则是在 C++11 之前几年就已经出现的 CMake 2.8 。

你应该至少使用在你的编译器之后出现的 CMake 版本，因为它需要知道该版本的编译器标志等信息。
而且，由于只会CMake会启用CMakeLists.txt中的生命力的最低CMake版本所对应的特性，所以即使是在系统范围内安装一个新版本的CMake也是相当安全的。
你至少应该在本地安装它。这很容易（在许多情况下是 1-2 行命令），你会发现 5 分钟的工作将为你节省数百行和数小时的 CMakeLists.txt 编写，而且从长远来看，将更容易维护。

本书试图解决那些网上泛滥的糟糕例子和所谓”最佳实践“存在的问题。

## 其他资料

本书原作者的其他资料:

* [HSF CMake Training](https://hsf-training.github.io/hsf-training-cmake-webpage/01-intro/index.html)
* [Interactive Modern CMake talk](https://gitlab.com/CLIUtils/modern-cmake-interactive-talk)

在网上还有一些其他的地方可以找到好的资讯。下面是其中的一些:

* [The official help](https://cmake.org/cmake/help/latest/): 非常棒的文档。组织得很好，有很好的搜索功能，而且你可以在顶部切换版本。它只是没有一个很好的 “最佳实践教程”，而这正是本书试图解决的内容。
* [Effective Modern CMake](https://gist.github.com/mbinna/c61dbb39bca0e4fb7d1f73b0d66a4fd1): 
一个很好的 do's and don'ts 的清单。
* [Embracing Modern CMake](https://steveire.wordpress.com/2017/11/05/embracing-modern-cmake/): 一篇对术语有很好描述的文章。
* [It's time to do CMake Right](https://pabloariasal.github.io/2018/02/19/its-time-to-do-cmake-right/): 一些现代的 CMake 项目的最佳实践。
* [The Ultimate Guide to Modern CMake](https://rix0r.nl/blog/2015/08/13/cmake-guide/): 一篇有着本书类似目的稍显过时的文章。
* [More Modern CMake](https://youtu.be/y7ndUhdQuU8): 来自 Meeting C++ 2018 的一个很棒的演讲，推荐使用 CMake 3.12 以上版本。该演讲将 CMake 3.0+ 称为 “现代 CMake”，将 CMake 3.12+ 称为 “更现代的 CMake”。
* [Oh No! More Modern CMake](https://www.youtube.com/watch?v=y9kSr5enrSk): More Modern CMake 的续篇。
* [toeb/moderncmake](https://github.com/toeb/moderncmake): 关于 CMake 3.5+ 的很好的介绍和例子，包括从语法到项目组织的介绍。

## 制作

Modern CMake 最初由 [Henry Schreiner](https://iscinumpy.gitlab.io) 编写. 其他的贡献者可以在 [Gitlab的列表](https://gitlab.com/CLIUtils/modern-cmake/-/network/master) 中找到.

[HSF CMake Training]: https://hsf-training.github.io/hsf-training-cmake-webpage/01-intro/index.html

[^1]: CMake 3.0 同样从非常老的CMake版本中删除了几个早已废弃的功能，并对与方括号有关的语法做了一个非常微小的向后不兼容的修改，所以这个说法并不完全公正；可能有一些非常非常老的CMake文件会在 CMake 3.0+ 中停止工作，但我从未遇到过。
