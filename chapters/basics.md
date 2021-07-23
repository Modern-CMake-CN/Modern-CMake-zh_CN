# 基础知识简介

## 最低版本要求

这是每个 `CMakeLists.txt` 都必须包含的第一行

```cmake
cmake_minimum_required(VERSION 3.1)
```

顺便提一下关于 CMake 的语法。命令 «command:`cmake_minimum_required`»  是不区分大小写的，所以常用的做法是使用小写[^1]。 `VERSION` 和它后面的版本号是这个函数的特殊关键字。在这本书中，你可以点击命令的名称来查看它的官方文档，并且可以使用下拉菜单来切换 `CMake` 的版本。

这一行很特殊[^2]！ `CMake` 的版本与它的特性（policies）相互关联，这意味着它也定义了 `CMake` 行为的变化。因此，如果你将 `cmake_minimum_required` 中的 `VERSION` 设定为 `2.8`，那么你将会在 macOS 上产生链接错误，例如，即使在 `CMake` 最新的版本中，如果你将它设置为 `3.3` 或者更低，那么你将会得到一个隐藏的标志行为(symbols behaviour)错误等。你可以在 «cmake:policies» 中得到一系列 policies 与 versions 的说明。

从 CMake 3.12 开始，版本号可以声明为一个范围，例如 `VERSION 3.1...3.15`；这意味着这个工程最低可以支持 `3.1` 版本，但是也最高在 `3.15` 版本上测试成功过。这对需要更精确(better)设置的用户体验很好，并且由于一个语法上的小技巧，它可以向后兼容更低版本的 CMake （尽管在这里例子中虽然声明为 `CMake 3.1-3.15` 实际只会设置为 `3.1` 版本的特性，因为这些版本处理这个工程没有什么差异）。新的版本特性往往对 macOS 和 Windows 用户是最重要的，他们通常使用非常新版本的 CMake。

当你开始一个新项目，起始推荐这么写：

```cmake
cmake_minimum_required(VERSION 3.7...3.21)

if(${CMAKE_VERSION} VERSION_LESS 3.12)
    cmake_policy(VERSION ${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION})
endif()
```

如果 CMake 的版本低于3.12，`if` 块条件为真，CMake 将会被设置为当前版本。如果 CMake 版本是 3.12 或者更高，`if` 块条件为假，将会遵守 `cmake_minimum_required` 中的规定，程序将继续正常运行。

**WARNING**:  MSVC 的 CMake 服务器模式起初解析这个语法的时候[有一个bug](https://github.com/fmtlib/fmt/issues/809)，所以如果你需要支持旧版本的 MSVC 的非命令行的 Windows 构建，你应该这么写：

```cmake
cmake_minimum_required(VERSION 3.7)

if(${CMAKE_VERSION} VERSION_LESS 3.21)
    cmake_policy(VERSION ${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION})
else()
    cmake_policy(VERSION 3.21)
endif()
```

{% hint style='info' %}

如果你真的需要在这里设置为一个低版本，你可以使用 «command:`cmake_policy`» 来有条件的提高特性级别或者设置一个特殊的特性。请至少为你的 macOS 用户进行设置！
{% endhint %}


## 设置一个项目

现在，每一个顶层 CMakelists 文件都应该有下面这一行：

```cmake
project(MyProject VERSION 1.0
                  DESCRIPTION "Very nice project"
                  LANGUAGES CXX)
```

现在我们看到了更多的语法。这里的字符串是带引号的，因此内容中可以带有空格。项目名称是这里的第一个参数。所有的关键字参数都可选的。`VERSION` 设置了一系列变量，例如 `MyProject_VERSION` 和 `PROJECT_VERSION`。语言可以是  `C`,`CXX`,`Fortran`,`ASM`,`CUDA`(CMake 3.8+),`CSharp`(3.8+),`SWIFT`(CMake 3.15+  experimental)，默认是`C CXX`。在 CMake 3.9，可以通过`DESCRIPTION` 关键词来添加项目的描述。这个关于 «command:`project`»  的文档可能会有用。

{% hint style='info' %}

你可以用 `#` 来添加[注释](https://cmake.org/cmake/help/latest/manual/cmake-language.7.html#comments)。CMake 也有一个用于注释的内联语法，但是那极少用到。
{% endhint %}

项目名称没有什么特别的用处。这里没有添加任何的目标(target)。

## 生成一个可执行文件

尽管库要有趣的多，并且我们会将把大部分时间花在其上。但是现在，先让我们从一个简单的可执行文件开始吧！

```cmake
add_executable(one two.cpp three.h)
```

这里有一些语法需要解释。`one` 既是生成的可执行文件的名称，也是创建的 `CMake` 目标(target)的名称(我保证，你很快会听到更多关于目标的内容)。紧接着的是源文件的列表，你想列多少个都可以。CMake 很聪明 ，它根据拓展名只编译源文件。在大多数情况下，头文件将会被忽略；列出他们的唯一原因是为了让他们在 IDE 中被展示出来，目标文件在许多 IDE 中被显示为文件夹。你可以在 «cmake:buildsystem» 中找到更多关于一般构建系统与目标的信息。

## 生成一个库

制作一个库是通过 «command:`add_library`» 命令完成的，并且非常简单：

```cmake
add_library(one STATIC two.cpp three.h)
```

你可以选择库的类型，可以是 `STATIC`,`SHARED`, 或者`MODULE`.如果你不选择它，CMake 将会通过 `BUILD_SHARED_LIBS` 的值来选择构建 STATIC 还是 SHARED 类型的库。

在下面的章节中你将会看到，你经常需要生成一个虚构的目标，也就是说，一个不需要编译的目标。例如，只有一个头文件的库。这被叫做 `INTERFACE` 库，这是另一种选择，和上面唯一的区别是后面不能有文件名。

你也可以用一个现有的库做一个 `ALIAS` 库，这只是给已有的目标起一个别名。这么做的一个好处是，你可以制作名称中带有 `::` 的库（你将会在后面看到）[^3] 。

## 目标时常伴随着你

现在我们已经指定了一个目标，那我们如何添加关于它的信息呢？例如，它可能需要包含一个目录：

```cmake
target_include_directories(one PUBLIC include)
```

«command:`target_include_directories`»  为目标添加了一个目录。 `PUBLIC` 对于一个二进制目标没有什么含义；但对于库来说，它让 CMake 知道，任何链接到这个目标的目标也必须包含这个目录。其他选项还有 `PRIVATE`（只影响当前目标，不影响依赖），以及 `INTERFACE`（只影响依赖）。

接下来我们可以将目标之间链接起来：

```cmake
add_library(another STATIC another.cpp another.h)
target_link_libraries(another PUBLIC one)
```

«command:`target_link_libraries`» 可能是 CMake 中最有用也最令人迷惑的命令。它指定一个目标，并且在给出目标的情况下添加一个依赖关系。如果不存在名称为 `one` 的目标，那他会添加一个链接到你路径中 `one` 库（这也是命令叫 `target_link_libraries` 的原因）。或者你可以给定一个库的完整路径，或者是链接器标志。最后再说一个有些迷惑性的知识：），经典的 CMake 允许你省略 `PUBLIC` 关键字，但是你在目标链中省略与不省略混用，那么 CMake 会报出错误。

只要记得在任何使用目标的地方都指定关键字，那么就不会有问题。

目标可以有包含的目录、链接库（或链接目标）、编译选项、编译定义、编译特性（见C++11 章节）等等。正如你将在之后的两个项目章节中看到的，你经常可以得到目标（并且经常是指定目标）来代表所有你使用的库。甚至有些不是真正的库，像 `OpenMP`，就可以用目标来表示。这也是为什么现代 CMake 如此的棒！


## 更进一步

看看你是否能理解以下文件。它生成了一个简单的 C++11 的库并且在程序中使用了它。没有依赖。我将在之后讨论更多的 C++ 标准选项，代码中使用的是 CMake 3.8。

```cmake
cmake_minimum_required(VERSION 3.8)

project(Calculator LANGUAGES CXX)

add_library(calclib STATIC src/calclib.cpp include/calc/lib.hpp)
target_include_directories(calclib PUBLIC include)
target_compile_features(calclib PUBLIC cxx_std_11)

add_executable(calc apps/calc.cpp)
target_link_libraries(calc PUBLIC calclib)

```

[^1]: 在这本书中，我主要避免向你展示错误的做事方式。你可以在网上找到很多关于这个的例子。我偶尔会提到替代方法，但除非是绝对必要，否则不推荐使用这些替代的方法，通常他们只是为了帮助你阅读更旧的 CMake 代码。
[^2]: 有时你会在这里看到 `FATAL_ERROR`，那是为了支持在 CMake < 2.6 时的错误，现在应该不会有问题了。
[^3]: `::` 语法最初是为了 `INTERFACE IMPORTED` 库准备的，这些库应该是在当前项目之外定义的。但是，因为如此，大多数的 `target_*` 命令对 `IMPORTED` 库不起作用，这使得它们难以自己设置。所以，暂时不要使用 `IMPORTED` 关键字，而使用 `ALIAS` 目标；它在你开始导出目标之前，都表现的很好。这个限制在 CMake 3.11 中得以修复。

