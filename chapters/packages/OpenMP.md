# OpenMP

CMake 3.9+ 中对 [OpenMP] 的支持进行了极大的改善。现代（TM）CMake 使用 OpenMP 链接到一个目标的方法如下：


```cmake
find_package(OpenMP)
if(OpenMP_CXX_FOUND)
    target_link_libraries(MyTarget PUBLIC OpenMP::OpenMP_CXX)
endif()
```

这不仅比传统方法简单，若需要的话，还可以将库链接与编译的设置分开。CMake 3.12+ 中，甚至支持了 macOS 系统中的 OpenMP（需要对库文件进行安装，例如 `brew install libomp`）。若需要支持旧版CMake，下面的代码可以在 CMake 3.1+ 上正常运行：


```cmake
# For CMake < 3.9, we need to make the target ourselves
if(NOT TARGET OpenMP::OpenMP_CXX)
    find_package(Threads REQUIRED)
    add_library(OpenMP::OpenMP_CXX IMPORTED INTERFACE)
    set_property(TARGET OpenMP::OpenMP_CXX
                 PROPERTY INTERFACE_COMPILE_OPTIONS ${OpenMP_CXX_FLAGS})
    # Only works if the same flag is passed to the linker; use CMake 3.9+ otherwise (Intel, AppleClang)
    set_property(TARGET OpenMP::OpenMP_CXX
                 PROPERTY INTERFACE_LINK_LIBRARIES ${OpenMP_CXX_FLAGS} Threads::Threads)

endif()
target_link_libraries(MyTarget PUBLIC OpenMP::OpenMP_CXX)
```

{% hint style='danger' %}

警告：CMake 小于 3.4 的版本中，Threads 包中有一个 bug，需要启用`C`语言。

{% endhint %}

[OpenMP]: https://cmake.org/cmake/help/latest/module/FindOpenMP.html
