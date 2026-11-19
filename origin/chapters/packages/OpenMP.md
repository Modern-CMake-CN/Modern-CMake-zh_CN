# OpenMP

The Modern(TM) way to add [OpenMP] to a target is:

```cmake
find_package(OpenMP)
if(OpenMP_CXX_FOUND)
    target_link_libraries(MyTarget PUBLIC OpenMP::OpenMP_CXX)
endif()
```

This not only is cleaner than the old flag-based method, it will also correctly set the library link line differently from the compile line if needed. It supports OpenMP on macOS, too (if the library is available, such as with `brew install libomp`).

[openmp]: https://cmake.org/cmake/help/latest/module/FindOpenMP.html
