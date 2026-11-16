# Adding features

This section covers adding common features to your CMake project. You'll learn how to add a variety of options commonly needed in C++ projects, like C++11 support, as well as how to support IDEs and more.

## Default build type

CMake normally does a "non-release, non debug" empty build type; if you prefer to set the default build type yourself, you can follow this
recipe for the default build type modified from the [Kitware blog](https://blog.kitware.com/cmake-and-the-default-build-type/):

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
