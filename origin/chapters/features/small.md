# Adding Features

There are lots of compiler and linker settings. When you need to add something special, you could check first to see if CMake supports it; if it does, you can avoid explicitly tying yourself to a compiler version. And, better yet, you explain what you mean in your CMakeLists, rather than spewing flags.

The first and most common feature was C++ standards support, which got its own chapter.

## Position independent code

[This](https://cmake.org/cmake/help/latest/variable/CMAKE_POSITION_INDEPENDENT_CODE.html) is best known as the `-fPIC` flag. Much of the time, you don't need to do anything. CMake will include the flag for `SHARED` or `MODULE` libraries. If you do explicitly need it:

```cmake
set(CMAKE_POSITION_INDEPENDENT_CODE ON)
```

will do it globally, or:

```cmake
set_target_properties(lib1 PROPERTIES POSITION_INDEPENDENT_CODE ON)
```

to explicitly turn it `ON` (or `OFF`) for a target.

## Little libraries

If you need to link to the `dl` library, with `-ldl` on Linux, just use the built-in CMake variable [`${CMAKE_DL_LIBS}`](https://cmake.org/cmake/help/latest/variable/CMAKE_DL_LIBS.html) in a `target_link_libraries` command. No module or `find_package` needed. (This adds whatever is needed to get `dlopen` and `dlclose`)

Unfortunately, the math library is not so lucky. If you need to explicitly link to it, you can always do `target_link_libraries(MyTarget PUBLIC m)`, but it might be better to use CMake's generic [`find_library`](https://cmake.org/cmake/help/latest/command/find_library.html):

```cmake
find_library(MATH_LIBRARY m)
if(MATH_LIBRARY)
    target_link_libraries(MyTarget PUBLIC ${MATH_LIBRARY})
endif()
```

You can pretty easily find `Find*.cmake`'s for this and other libraries that you need with a quick search; most major packages have a helper library of CMake modules. See the chapter on existing package inclusion for more.

## Interprocedural optimization

[`INTERPROCEDURAL_OPTIMIZATION`](https://cmake.org/cmake/help/latest/prop_tgt/INTERPROCEDURAL_OPTIMIZATION.html), best known as _link time optimization_ and the `-flto` flag, is well supported by CMake. You can turn this on globally with [`CMAKE_INTERPROCEDURAL_OPTIMIZATION`](https://cmake.org/cmake/help/latest/variable/CMAKE_INTERPROCEDURAL_OPTIMIZATION.html) or per-target with the [`INTERPROCEDURAL_OPTIMIZATION`](https://cmake.org/cmake/help/latest/prop_tgt/INTERPROCEDURAL_OPTIMIZATION.html) property. Setting this to `ON` on a target is an error if the compiler doesn't support it (see [CMP0069](https://cmake.org/cmake/help/latest/policy/CMP0069.html)). You can use `check_ipo_supported()`, from the built-in [CheckIPOSupported](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html) module, to check support beforehand:

```cmake
include(CheckIPOSupported)
check_ipo_supported(RESULT result)
if(result)
  set_target_properties(foo PROPERTIES INTERPROCEDURAL_OPTIMIZATION TRUE)
endif()
```
