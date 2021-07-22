# Catch


[Catch2] (C++11 only version) is a powerful, idomatic testing solutions similar in philosophy to PyTest for Python. It supports a wider range of compilers than GTest, and is quick to support new things, like M1 builds on macOS. It also has a smaller but faster twin, [doctest](https://github.com/onqtam/doctest), which is quick to compile but misses features like matchers. To use Catch in a CMake project, there are several options.

## Configure methods

Catch has nice CMake support, though to use it, you need the full repo. This could be with submodules or FetchContent. Both the [`extended-project`](https://gitlab.com/CLIUtils/modern-cmake/-/tree/master/examples/extended-project) and [`fetch`](https://gitlab.com/CLIUtils/modern-cmake/-/tree/master/examples/fetch) examples use FetchContent. See [the docs](https://github.com/catchorg/Catch2/blob/v2.x/docs/cmake-integration.md#top).

## Quick download

This is likely the simplest method and supports older versions of CMake. You can download the all-in-one header file in one step:

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

This will two downloads when Catch 3 is released, as that now requires two files (but you no longer have to write a main.cpp). The `main.cpp` looks like this:

```cpp
#define CATCH_CONFIG_MAIN
#include "catch.hpp"
```

## Vendoring

If you simply drop in the single include release of Catch into your project, this is what you would need to add Catch:

```cmake
# Prepare "Catch" library for other executables
set(CATCH_INCLUDE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/extern/catch)
add_library(Catch2::Catch IMPORTED INTERFACE)
set_property(Catch2::Catch PROPERTY INTERFACE_INCLUDE_DIRECTORIES "${CATCH_INCLUDE_DIR}")
```

Then, you would link to Catch2::Catch. This would have been okay as an INTERFACE target since you won't be exporting your tests.


## Direct inclusion

If you add the library using ExternalProject, FetchContent, or git submodules, you can also `add_subdirectory` Catch (CMake 3.1+).

Catch also provides two CMake modules that you can use to register the individual tests with CMake.

[Catch2]: https://github.com/catchorg/Catch2
