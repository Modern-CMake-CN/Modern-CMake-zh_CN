# Useful Modules

There are a ton of useful modules in CMake's [modules](https://cmake.org/cmake/help/latest/manual/cmake-modules.7.html) collection; but some of them are more useful than others. Here are a few highlights.

## [CMakeDependentOption](https://cmake.org/cmake/help/latest/module/CMakeDependentOption.html)

This adds a command `cmake_dependent_option` that sets an option based on another set of variables being true. It looks like this:

```cmake
include(CMakeDependentOption)
cmake_dependent_option(BUILD_TESTS "Build your tests" ON "VAL1;VAL2" OFF)
```

When the condition (here, `VAL1 AND VAL2`) is true, this behaves like a normal `option(BUILD_TESTS "Build your tests" ON)`. When the condition is false, however, it does not just hide the option; it sets `BUILD_TESTS` to the fallback value (`OFF` here) as a normal (non-cache) variable, shadowing any value the user may have set in the cache. So `BUILD_TESTS` is only user-configurable while the condition holds; roughly:

```cmake
if(VAL1 AND VAL2)
    option(BUILD_TESTS "Build your tests" ON)
else()
    set(BUILD_TESTS OFF)
endif()
```

Note that `BUILD_TESTING` is a better way to check for testing being enabled if you use `include(CTest)`, since it is defined for you. This is just an example of `CMakeDependentOption`.

## [CMakePrintHelpers](https://cmake.org/cmake/help/latest/module/CMakePrintHelpers.html)

This module has a couple of handy output functions. `cmake_print_properties` lets you easily print properties.
And `cmake_print_variables` will print the names and values of any variables you give it.

## [CheckCXXCompilerFlag](https://cmake.org/cmake/help/latest/module/CheckCXXCompilerFlag.html)

This checks to see if a flag is supported. For example:

```cmake
include(CheckCXXCompilerFlag)
check_cxx_compiler_flag(-someflag OUTPUT_VARIABLE)
```

Note that `OUTPUT_VARIABLE` will also appear in the configuration printout, so choose a good name.

This is just one of many similar modules, such as `CheckIncludeFileCXX`, `CheckStructHasMember`, `TestBigEndian`, and `CheckTypeSize` that allow you
to check for information about the system (and you can communicate that to your source code).

## [`try_compile`](https://cmake.org/cmake/help/latest/command/try_compile.html)/[`try_run`](https://cmake.org/cmake/help/latest/command/try_run.html)

This is not exactly a module, but is crucial to many of the modules listed above. You can attempt to compile (and possibly run) a bit of code at configure time. This can allow you to get information about the capabilities of your system. The basic syntax is:

```cmake
try_compile(
  RESULT_VAR
    bindir
  SOURCES
    source.cpp
)
```

There are lots of options you can add, like `COMPILE_DEFINITIONS`. In CMake 3.8+, this will honor the CMake C/C++/CUDA standard settings. If you use `try_run` instead, it will run the resulting program and give you the output in `RUN_OUTPUT_VARIABLE`.

## [FeatureSummary](https://cmake.org/cmake/help/latest/module/FeatureSummary.html)

This is a fairly useful but rather odd module. It allows you to print out a list of packages what were searched for, as well as any options you explicitly mark. It's partially but not completely tied into [`find_package`](https://cmake.org/cmake/help/latest/command/find_package.html). You first include the module, as always:

```cmake
include(FeatureSummary)
```

Then, for any find packages you have run or will run, you can extend the default information:

```cmake
set_package_properties(OpenMP PROPERTIES
    URL "http://www.openmp.org"
    DESCRIPTION "Parallel compiler directives"
    PURPOSE "This is what it does in my package")
```

You can also set the `TYPE` of a package to `RUNTIME`, `OPTIONAL`, `RECOMMENDED`, or `REQUIRED`; you can't, however, lower the type of a package; if you have already added a `REQUIRED` package through [`find_package`](https://cmake.org/cmake/help/latest/command/find_package.html) based on an option, you'll see it listed as `REQUIRED`.

And, you can mark any options as part of the feature summary. If you choose the same name as a package, the two interact with each other.

```cmake
add_feature_info(WITH_OPENMP OpenMP_CXX_FOUND "OpenMP (Thread safe FCNs only)")
```

Then, you can print out the summary of features, either to the screen or a log file:

```cmake
if(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME)
    feature_summary(WHAT ENABLED_FEATURES DISABLED_FEATURES PACKAGES_FOUND)
    feature_summary(FILENAME ${CMAKE_CURRENT_BINARY_DIR}/features.log WHAT ALL)
endif()
```

You can build any collection of `WHAT` items that you like, or just use `ALL`.
