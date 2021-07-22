# FetchContent (CMake 3.11+)

Often, you would like to do your download of data or packages as part of the configure instead of the build. This was invented several times in third party modules, but was finally added to CMake itself as part of CMake 3.11 as the [FetchContent] module.

The [FetchContent] module has excellent documentation that I won't try to repeat. The key ideas are:

* Use `FetchContent_Declare(MyName)` to get data or a package. You can set URLs, Git repositories, and more.
* Use `FetchContent_GetProperties(MyName)` on the name you picked in the first step to get `MyName_*` variables.
* Check `MyName_POPULATED`, and if not populated, use `FetchContent_Populate(MyName)` (and if a package, `add_subdirectory("${MyName_SOURCE_DIR}" "${MyName_BINARY_DIR}")`)

For example, to download Catch2:

```cmake
FetchContent_Declare(
  catch
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG        v2.13.6
)

# CMake 3.14+
FetchContent_MakeAvailable(catch)
```

If you can't use CMake 3.14+, the classic way to prepare code was:

```cmake
# CMake 3.11+
FetchContent_GetProperties(catch)
if(NOT catch_POPULATED)
  FetchContent_Populate(catch)
  add_subdirectory(${catch_SOURCE_DIR} ${catch_BINARY_DIR})
endif()
```

Of course, you could bundled this up into a macro:

```cmake
if(${CMAKE_VERSION} VERSION_LESS 3.14)
    macro(FetchContent_MakeAvailable NAME)
        FetchContent_GetProperties(${NAME})
        if(NOT ${NAME}_POPULATED)
    	    FetchContent_Populate(${NAME})
    	    add_subdirectory(${${NAME}_SOURCE_DIR} ${${NAME}_BINARY_DIR})
        endif()
    endmacro()
endif()
```

Now you have the CMake 3.14+ syntax in CMake 3.11+.

See the example [here](https://gitlab.com/CLIUtils/modern-cmake/-/tree/master/examples/fetch).

[FetchContent]: https://cmake.org/cmake/help/latest/module/FetchContent.html
