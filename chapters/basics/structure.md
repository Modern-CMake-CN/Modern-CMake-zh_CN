# 如何组织你的项目

下面的说法可能存在一些偏见，但我认为这是一种好的组织方式。我将会讲解如何组织项目的目录结构，这是基于以往的惯例来写的，这么做对你有以下好处：

* 可以很容易阅读以相同模式组织的项目
* 避免可能造成冲突的组织形式
* 避免使目录结构变得混乱和复杂

首先，如果你创建一个名为 `project` 的项目，它有一个名为 `lib` 的库，有一个名为 `app` 的可执行文件，那么目录结构应该如下所示：

```
- project
  - .gitignore
  - README.md
  - LICENCE.md
  - CMakeLists.txt
  - cmake
    - FindSomeLib.cmake
    - something_else.cmake
  - include
    - project
      - lib.hpp
  - src
    - CMakeLists.txt
    - lib.cpp
  - apps
    - CMakeLists.txt
    - app.cpp
  - tests
    - CMakeLists.txt
    - testlib.cpp
  - docs
    - CMakeLists.txt
  - extern
    - googletest
  - scripts
    - helper.py
```

其中，文件的名称不是绝对的，你可能会看到关于文件夹名称为 `tests`  还是 `test` 的争论，并且应用程序所在的文件夹可能为其他的名称（ 或者一个项目只有库文件 ）。你也许也会看到一个名为 `python` 的文件夹，那里存储关于 python 绑定器的内容，或者是一个 `cmake` 文件夹用于存储如 `Find<library>.cmake` 这样的 `.cmake` 辅助文件。但是一些比较基础的东西都在上面包括了。

可以注意到一些很明显的问题， `CMakeLists.txt` 文件被分割到除了 `include` 目录外的所有源代码目录下。这是为了能够将 `include` 目录下的所有文件拷贝到 `/usr/include` 目录或其他类似的目录下（除了配置的头文件，这个我将会在另一章讲到），因此为了避免冲突等问题，其中不能有除了头文件外的其他文件。这也是为什么在 `include` 目录下有一个名为项目名的目录。顶层 `CMakeLists.txt` 中应使用 `add_subdirectory` 命令来添加一个包含 `CMakeLists.txt` 的子目录。

你经常会需要一个 `cmake` 文件夹，里面包含所有用到的辅助模块。这是你放置所有 `Find*.cmake` 的文件。你可以在 [github.com/CLIUtils/cmake](https://github.com/CLIUtils/cmake) 找到一些常见的辅助模块集合。你可以通过以下语句将此目录添加到你的 CMake Path 中：

```cmake
set(CMAKE_MODULE_PATH "${PROJECT_SOURCE_DIR}/cmake" ${CMAKE_MODULE_PATH})
```

你的 `extern` 应该几乎只包含 git 子模块（ submodule ）。通过此方式，你可以明确地控制依赖的版本，并且可以非常轻松地升级。关于添加子模块的例子，可以参见 [Testing](https://modern-cmake-cn.github.io/Modern-CMake-zh_CN/chapters/testing.html) 章节。

你应该在 `.gitignore` 中添加形如 `/build*` 的规则，这样用户就可以在源代码目录下创建 `build` 目录来构建项目，而不用担心将生成的目标文件添加到 `.git` 中。有一些软件包禁止这么做，不过这还是相比**做一个真正的外部构建并且针对不同的包来使用不同的构建**要好的多。

如果你想要避免构建目录在有效的（ valid ）源代码目录中，你可以在顶层 `CMakeLists.txt` 文件头部添加如下语句：

```cmake
### Require out-of-source builds
file(TO_CMAKE_PATH "${PROJECT_BINARY_DIR}/CMakeLists.txt" LOC_PATH)
if(EXISTS "${LOC_PATH}")
    message(FATAL_ERROR "You cannot build in a source directory (or any directory with a CMakeLists.txt file). Please make a build subdirectory. Feel free to remove CMakeCache.txt and CMakeFiles.")
endif()
```

可以在这里查看 [拓展代码样例](https://github.com/Modern-CMake-CN/Modern-CMake-zh_CN/tree/master/examples/extended-project)
