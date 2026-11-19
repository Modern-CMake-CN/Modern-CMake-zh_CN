# FetchContent (CMake 3.14+)

Often, you would like to do your download of data or packages as part of the configure instead of the build. This was invented several times in third party modules, but was finally added to CMake itself as the [FetchContent] module.

The [FetchContent] module has excellent documentation that I won't try to repeat. The key ideas are:

- Use `FetchContent_Declare(MyName)` to get data or a package. You can set URLs, Git repositories, and more.
- Use `FetchContent_MakeAvailable(MyName)` to make it available; if it is a package with a `CMakeLists.txt`, this adds it to your build (like `add_subdirectory` would).

For example, to download Catch2:

```cmake
FetchContent_Declare(
  catch
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG        v3.15.0
)

FetchContent_MakeAvailable(catch)
```

If you are maintaining older code, you may still run across the original pattern of checking `MyName_POPULATED` and calling `FetchContent_Populate(MyName)` by hand; that was deprecated in CMake 3.30 ([CMP0169](https://cmake.org/cmake/help/latest/policy/CMP0169.html)) and warns on current CMake, so just use `FetchContent_MakeAvailable`.

See the example [here](https://gitlab.com/CLIUtils/modern-cmake/-/tree/master/examples/fetch).

[fetchcontent]: https://cmake.org/cmake/help/latest/module/FetchContent.html
