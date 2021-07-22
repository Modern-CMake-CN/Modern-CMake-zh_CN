# OpenMP

[OpenMP] support was drastically improved in CMake 3.9+. The Modern(TM) way to add OpenMP to a target is:


```cmake
find_package(OpenMP)
if(OpenMP_CXX_FOUND)
    target_link_libraries(MyTarget PUBLIC OpenMP::OpenMP_CXX)
endif()
```

This not only is cleaner than the old method, it will also correctly set the library link line differently from the compile line if needed. In CMake 3.12+, this will even support OpenMP on macOS (if the library is available, such as with `brew install libomp`). However, if you need to support older CMake, the following works on CMake 3.1+:


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
Warning: CMake < 3.4 has a bug in the Threads package that requires you to have the `C` language enabled.
{% endhint %}

[OpenMP]: https://cmake.org/cmake/help/latest/module/FindOpenMP.html
