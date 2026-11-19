# Catch

[Catch2] is a powerful, idiomatic testing solution similar in philosophy to PyTest for Python. It supports a wider range of compilers than GTest, and is quick to support new things, like M1 builds on macOS. It also has a smaller but faster twin, [doctest](https://github.com/doctest/doctest), which is quick to compile but misses features like matchers. The current Catch2 v3 line is a normal library (the old v2 single-header design is gone), and it requires C++14 or better. To use Catch2 in a CMake project, there are several options.

## Configure methods

Catch2 has nice CMake support; you can get it with FetchContent (or submodules, or an installed copy via `find_package(Catch2 3)`). Both the [`extended-project`](https://gitlab.com/CLIUtils/modern-cmake/-/tree/master/examples/extended-project) and [`fetch`](https://gitlab.com/CLIUtils/modern-cmake/-/tree/master/examples/fetch) examples use FetchContent. See [the docs](https://github.com/catchorg/Catch2/blob/devel/docs/cmake-integration.md#top).

```cmake
include(FetchContent)

FetchContent_Declare(
  catch
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG        v3.15.0
)
FetchContent_MakeAvailable(catch)
```

This provides two targets: `Catch2::Catch2`, and `Catch2::Catch2WithMain`, which also provides `main()` for you; unlike v2, you no longer write a `main.cpp` with `CATCH_CONFIG_MAIN`:

```cmake
add_executable(my_tests test.cpp)
target_link_libraries(my_tests PRIVATE Catch2::Catch2WithMain)
```

Your test files then just include what they use, like `<catch2/catch_test_macros.hpp>` (the v2 catch-all `<catch2/catch.hpp>` is gone).

## Registering tests with CTest

Catch2 also ships CMake modules in its `extras` folder that register each `TEST_CASE` with CTest individually. The one to use is `catch_discover_tests` from the `Catch` module (`ParseAndAddCatchTests` is deprecated in v3):

```cmake
list(APPEND CMAKE_MODULE_PATH ${catch_SOURCE_DIR}/extras)
include(CTest)
include(Catch)
catch_discover_tests(my_tests)
```

If you installed Catch2 instead of adding it as a subproject, the module is available directly after `find_package(Catch2 3 REQUIRED)`.

## Vendoring

If you can't (or don't want to) download at configure time, Catch2 v3 provides an amalgamated distribution: a pair of files, `extras/catch_amalgamated.hpp` and `extras/catch_amalgamated.cpp`, that you can drop into your project and build as a normal library:

```cmake
add_library(catch2 STATIC extern/catch2/catch_amalgamated.cpp)
target_include_directories(catch2 PUBLIC extern/catch2)
target_compile_features(catch2 PUBLIC cxx_std_14)
```

The amalgamated files include the default `main()` as well. This is fine as a plain (non-exported) target since you won't be exporting your tests.

[catch2]: https://github.com/catchorg/Catch2
