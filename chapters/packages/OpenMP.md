# OpenMP

现代（TM）CMake 使用 [OpenMP] 链接到一个目标的方法如下：

```cmake
find_package(OpenMP)
if(OpenMP_CXX_FOUND)
    target_link_libraries(MyTarget PUBLIC OpenMP::OpenMP_CXX)
endif()
```

这不仅比传统的基于标志的方法简单，若需要的话，还可以将库链接与编译的设置分开。它同样支持了 macOS 系统中的 OpenMP（需要对库文件进行安装，例如 `brew install libomp`）。

[openmp]: https://cmake.org/cmake/help/latest/module/FindOpenMP.html
