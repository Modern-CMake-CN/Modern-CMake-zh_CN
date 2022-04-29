# Catch

[Catch2]（只有C++11版本）是一个独立且强大的测试工具，它的理念（philosophy）类似于 Python 中的 Pytest。他比 GTest 支持更多的编译器版本，并且会紧跟潮流支持新的事物，比如支持在 M1 版本 MacOS 上使用 Catch。他也有一个相似但是更加快速的双胞胎兄弟，[doctest](https://github.com/onqtam/doctest)，他编译十分迅速但是缺少了一些类似于匹配器（features）的特性。为了在 CMake 项目中使用 Catch，下面是一些可选的方式：

## 如何配置

Catch 对 CMake 支持很友好，不过你还是需要下载整个仓库来使用他。无论是使用 submodules 还是FetchContent 都可以。[`extended-project`](https://gitlab.com/CLIUtils/modern-cmake/-/tree/master/examples/extended-project)  与 [`fetch`](https://gitlab.com/CLIUtils/modern-cmake/-/tree/master/examples/fetch) 这两个示例用的都是 FetchContent 的方式。更多的可以参考[官方文档](https://github.com/catchorg/Catch2/blob/v2.x/docs/cmake-integration.md#top)。

## Quick download

这可能是最简单并且对老版本 CMake 适配性更好的方式。你可以一步到位地直接下载一个 All-in-one 的头文件：

```cmake
add_library(catch_main main.cpp)
target_include_directories(catch_main PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}")
set(url https://github.com/philsquared/Catch/releases/download/v2.13.6/catch.hpp)
file(
  DOWNLOAD ${url} "${CMAKE_CURRENT_BINARY_DIR}/catch.hpp"
  STATUS status
  EXPECTED_HASH SHA256=681e7505a50887c9085539e5135794fc8f66d8e5de28eadf13a30978627b0f47)
list(GET status 0 error)
if(error)
  message(FATAL_ERROR "Could not download ${url}")
endif()
target_include_directories(catch_main PUBLIC "${CMAKE_CURRENT_BINARY_DIR}")
```

在 Catch 3 发布后，你可能需要下载两个文件，因为现在需要两个文件进行测试（但是你不再需要自己写 main.cpp 文件）。这个 `main.cpp` 文件看起来像这样：

```cpp
#define CATCH_CONFIG_MAIN
#include "catch.hpp"
```

## Vendoring

如果你已经把 Catch 加入到你项目的一部分（放到了一个单独的文件夹中），你可以这样来使用 Catch：

```cmake
# Prepare "Catch" library for other executables
set(CATCH_INCLUDE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/extern/catch)
add_library(Catch2::Catch IMPORTED INTERFACE)
set_property(Catch2::Catch PROPERTY INTERFACE_INCLUDE_DIRECTORIES "${CATCH_INCLUDE_DIR}")
```

然后，你需要链接到 Catch2::Catch。你也可以把它作为一个 INTERFACE 目标，因为你不会导出你的测试模块。


## Direct inclusion

如果你使用 ExternalProject，FetchContent 或者 git submodules 的形式来添加库，你也可以使用 `add_subdirectory` 。（CMake 3.1+）

Catch 还提供了两个 CMake 模块（modules），你可以通过这个来注册独立的测试。

[Catch2]: https://github.com/catchorg/Catch2
