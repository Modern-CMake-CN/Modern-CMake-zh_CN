# 为 CMake 项目添加特性

本节将会涵盖如何为你的 CMake 项目添加特性。你将会学到如何为你的 C++ 项目添加一些常用的选项，如 C++11 支持，以及如何支持 IDE 工具等。


## 默认的构建类型

CMake 通常会设置一个 “既不是 Release 也不是Debug” 的空构建类型来作为默认的构建类型，如果你想要自己设置默认的构建类型，你可以参考 [Kitware blog](https://blog.kitware.com/cmake-and-the-default-build-type/) 中指出的方法。

```cmake
set(default_build_type "Release")
if(NOT CMAKE_BUILD_TYPE AND NOT CMAKE_CONFIGURATION_TYPES)
  message(STATUS "Setting build type to '${default_build_type}' as none was specified.")
  set(CMAKE_BUILD_TYPE "${default_build_type}" CACHE
      STRING "Choose the type of build." FORCE)
  # Set the possible values of build type for cmake-gui
  set_property(CACHE CMAKE_BUILD_TYPE PROPERTY STRINGS
    "Debug" "Release" "MinSizeRel" "RelWithDebInfo")
endif()
```

