# 现代的 CMake 的介绍

人们喜欢对构建系统抱有敌意。
CppCon17 的讲座就是一个开发者们将构建系统当成头等笑话的例子。
这引出了一个问题：为什么（人们这样认为）？
确实，使用构建系统构建项目时不乏这样那样的问题。
但我认为，我们有一个非常好的解决方案来消除其中的一些问题。
那就是 CMake 。但不是 CMake 2.8 ，它比 C++11 还要早出现。
也不是那些糟糕的 CMake 例程（甚至包括那些 KitWare 自己的教程里发布的例子）。
我指的是现代的 CMake 。是 CMake 3.15+ ，甚至是 CMake 4.4+ ！
它简洁、强大、优雅，所以你能够花费你的大部分时间在编写代码上，而不是在一个不可读、不可维护的 Make （或 CMake 2） 文件上浪费时间。

:::{attention}

本书是一篇持续维护的文档。你可以在 [GitLab](https://gitlab.com/CLIUtils/modern-cmake) 上提 issue 或是 合并请求。
你也可以 [下载PDF](https://CLIUtils.gitlab.io/modern-cmake/modern-cmake.pdf) 格式的副本。请务必查看一下 [HSF CMake Training][] （也是一个 CMake 教程）!

:::

简而言之, 如果你正在考虑使用 Modern CMake，以下是你心中最可能存在的问题:

## 为什么我需要一个好的构建系统？

以下情况是否适用于你？

- 你想避免将路径硬编码
- 你需要在不止一台电脑上构建软件包
- 你想在项目中使用 CI（持续集成）
- 你需要支持不同的操作系统（甚至可能只是 Unix 的不同版本）
- 你想支持多个编译器
- 你想使用 IDE，但也许不总是使用
- 你想从逻辑上描述你的程序是如何结构的，而不是通过某些标志和命令
- 你想使用一个第三方库
- 你想使用工具，比如 Clang-Tidy，来帮助你编码
- 你想使用调试器来 Debug

如果是这样，你会从类似 CMake 的构建系统中受益。

## 为什么答案一定是CMake？

构建系统是一个热门话题。当然，有很多构建系统可选。但是，即使是一个真的非常好的构建系统，或者一个使用类似（CMake）的语法的，也不能达到 CMake 的使用体验。
为什么？
因为生态。
每个 IDE 都支持 CMake（或者是 CMake 支持那个 IDE）。
使用 CMake 构建的软件包比使用其他任何构建系统的都多。
所以，如果你想要在你的代码中包含一个库，你有两个选择，要么自己写一个构建系统，要么使用该库支持的构建系统中的某个。而那通常包含 CMake。
如何你的工程包含的库多了，CMake 或很快成为那些库所支持的构建系统的交集。并且，如果你使用一个预装在系统中的库，它有很大可能有一个 find CMake 或者是一个 config CMake 的脚本。

## 我难道不应该支持尽可能老的版本吗？

简短的回答：不应该。

如果你将 CMake 的最低版本设置得太低，CMake 会产生警告甚至报错。截至 CMake 4.4，你能设置的最老版本是 3.5，且任何低于 3.10 的设置都会触发警告。虽然用户在紧急情况下可以通过将 `CMAKE_POLICY_VERSION_MINIMUM` 设置为有效版本来绕过这一限制，但你并不希望用户不得不这么做。

你应该至少使用在你的编译器之后出现的 CMake 版本，因为它需要知道该版本的编译器标志等信息。
而且，由于 CMake 只会启用 CMakeLists.txt 中包含的最低 CMake 版本所对应的特性，所以即使是在系统范围内安装一个新版本的 CMake 也是相当安全的。
你至少应该在本地安装它。这很容易（在许多情况下是 1-2 行命令），你会发现 5 分钟的工作将为你节省数百行和数小时的 CMakeLists.txt 编写，而且从长远来看，将更容易维护。

合适的最低版本快速总结（书中会有更详细的介绍）：

- 3.24：包查找系统非常出色，适合作为支持包作者的良好最低版本。
- 3.18：对 Python 和 CUDA 有相当好的支持，大多数系统至少都具备此版本。
- 3.15：这是大多数项目应当设定的下限，Ubuntu 20.04+ 已自带 3.16+。
- 3.10：避免触发 CMake 警告的最低版本，Ubuntu 18.04+。
- 3.5：仅当你**确实**别无选择时使用。
- 只要你同时设置了最高版本，甚至可以将最低版本设得比这更低。但请不要这么做。

请始终将最高版本设置为你测试过的最高版本（例如 4.4）。这样一来，只要 CMake 尚未将该**最高**版本移出其支持窗口，你的配置就能继续正常工作，而不会受限于最低版本何时被淘汰！

本书试图解决那些网上泛滥的糟糕例子和所谓”最佳实践“存在的问题。

## 其他资料

本书原作者的其他资料:

- [HSF CMake Training][]
- [Interactive Modern CMake talks](https://gitlab.com/CLIUtils/modern-cmake-interactive-talk)

在网上还有一些其他的地方可以找到好的资讯。下面是其中的一些:

- [The official help](https://cmake.org/cmake/help/latest/): 非常棒的文档。组织得很好，有很好的搜索功能，而且你可以在顶部切换版本。它只是没有一个很好的 “最佳实践教程”，而这正是本书试图解决的内容。
- [Effective Modern CMake](https://gist.github.com/mbinna/c61dbb39bca0e4fb7d1f73b0d66a4fd1): 
一个很好的 do's and don'ts 的清单。
- [Embracing Modern CMake](https://steveire.wordpress.com/2017/11/05/embracing-modern-cmake/): 一篇对术语有很好描述的文章。
- [It's time to do CMake Right](https://pabloariasal.github.io/2018/02/19/its-time-to-do-cmake-right/): 一些现代的 CMake 项目的最佳实践。
- [The Ultimate Guide to Modern CMake](https://rix0r.nl/blog/2015/08/13/cmake-guide/): 一篇有着本书类似目的稍显过时的文章。
- [More Modern CMake](https://youtu.be/y7ndUhdQuU8): 来自 Meeting C++ 2018 的一个很棒的演讲，推荐使用 CMake 3.12 以上版本。该演讲将 CMake 3.0+ 称为 “现代 CMake”，将 CMake 3.12+ 称为 “更现代的 CMake”。
- [Oh No! More Modern CMake](https://www.youtube.com/watch?v=y9kSr5enrSk): More Modern CMake 的续篇。
- [toeb/moderncmake](https://github.com/toeb/moderncmake): 关于 CMake 3.5+ 的很好的介绍和例子，包括从语法到项目组织的介绍。

## 制作

Modern CMake 最初由 [Henry Schreiner](https://iscinumpy.gitlab.io) 编写. 其他的贡献者可以在 [Gitlab的列表](https://gitlab.com/CLIUtils/modern-cmake/-/network/master) 中找到.

[hsf cmake training]: https://hsf-training.github.io/hsf-training-cmake-webpage/01-intro/index.html
