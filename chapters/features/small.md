# 为 CMake 项目添加选项

CMake 中有许多关于编译器和链接器的设置。当你需要添加一些特殊的需求，你应该首先检查 CMake 是否支持这个需求，如果支持的话，你就可以不用关心编译器的版本，一切交给 CMake 来做即可。 更好的是，你可以在 `CMakeLists.txt` 表明你的意图，而不是通过开启一系列标志 (flag) 。

其中最首要，并且最普遍的需求是对 C++ 标准的设定与支持，这个将会单独开一章节讲解。

## 地址无关代码(Position independent code)

用标志 `-fPIC` 来设置[这个](https://cmake.org/cmake/help/latest/variable/CMAKE_POSITION_INDEPENDENT_CODE.html)是最常见的。大部分情况下，你不需要去显式的声明它的值。CMake 将会在 `SHARED` 以及 `MODULE` 类型的库中自动的包含此标志。如果你需要显式的声明，可以这么写： 

```cmake
set(CMAKE_POSITION_INDEPENDENT_CODE ON)
```

这样会对全局的目标进行此设置，或者可以这么写：

```cmake
set_target_properties(lib1 PROPERTIES POSITION_INDEPENDENT_CODE ON)
```

来对某个目标进行设置是否开启此标志。

## Little libraries

如果你需要链接到 `dl` 库，在 Linux 上可以使用 `-ldl` 标志，不过在 CMake 中只需要在 `target_link_libraries` 命令中使用内置的 CMake 变量 [`${CMAKE_DL_LIBS}` ](https://cmake.org/cmake/help/latest/variable/CMAKE_DL_LIBS.html)。这里不需要模组或者使用 `find_package` 来寻找它。（这个命令包含了调用 `dlopen` 与 `dlclose` 的一切依赖）

不幸的是，想要链接到数学库没这么简单。如果你需要明确地链接到它，你可以使用 `target_link_libraries(MyTarget PUBLIC m)`，但是使用 CMake 通用的 [`find_library`](https://cmake.org/cmake/help/latest/command/find_library.html) 可能更好，如下是一个例子：

```cmake
find_library(MATH_LIBRARY m)
if(MATH_LIBRARY)
    target_link_libraries(MyTarget PUBLIC ${MATH_LIBRARY})
endif()
```

通过快速搜索，你可以很容易地找到这个和其他你需要的库的 `Find*.cmake` 文件，大多数主要软件包都具有这个 CMake 模组的辅助库。更多信息请参见**包含现有软件包**的章节。

## 程序间优化(Interprocedural optimization)

«prop:tgt:INTERPROCEDURAL_OPTIMIZATION»，最有名的是 *链接时间优化* 以及 `-flto` 标志，这在最新的几个 CMake 版本中可用。你可以通过变量 «variable:CMAKE_INTERPROCEDURAL_OPTIMIZATION»（ CMake 3.9+ 可用）或对目标指定 «prop:tgt:INTERPROCEDURAL_OPTIMIZATION» 属性来打开它。在 CMake 3.8 中添加了对 GCC 及 Clang 的支持。如果你设置了 `cmake_minimum_required(VERSION 3.9)` 或者更高的版本（参考 «policy:CMP0069»），当在编译器不支持 «prop:tgt:INTERPROCEDURAL_OPTIMIZATION» 时，通过变量或属性启用该优化会产生报错。你可以使用内置模块 «module:CheckIPOSupported» 中的 `check_ipo_supported()` 来检查编译器是否支持 IPO 。下面是基于 CMake 3.9 的一个例子：

```cmake
include(CheckIPOSupported)
check_ipo_supported(RESULT result)
if(result)
  set_target_properties(foo PROPERTIES INTERPROCEDURAL_OPTIMIZATION TRUE)
endif()
```
