# Installing

Install commands cause a file or target to be "installed" into the install tree when you `make install`. Rather than hard-coding destinations like `lib` (wrong on distributions that use `lib64`, for example), use the standard [GNUInstallDirs](https://cmake.org/cmake/help/latest/module/GNUInstallDirs.html) module, which provides cache variables like `CMAKE_INSTALL_LIBDIR` with platform-appropriate defaults. Your basic target install command looks like this:

```cmake
include(GNUInstallDirs)
install(TARGETS MyLib
        EXPORT MyLibTargets
        LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
        ARCHIVE DESTINATION ${CMAKE_INSTALL_LIBDIR}
        RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
        INCLUDES DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}
        )
```

The various destinations are only needed if you have a library, static library, or program to install; since CMake 3.14, you can omit them entirely and these sensible defaults are used. The includes destination is special; since a target does not install includes. It only sets the includes destination on the exported target (which is often already set by `target_include_directories`, so check the MyLibTargets file and make sure you don't have the include directory included twice if you want clean cmake files).

It's usually a good idea to give CMake access to the version, so that `find_package` can have a version specified. This uses the project version set by your `project()` command:

```cmake
include(CMakePackageConfigHelpers)
write_basic_package_version_file(
    MyLibConfigVersion.cmake
    VERSION ${PROJECT_VERSION}
    COMPATIBILITY AnyNewerVersion
    )
```

(You can also leave out the `VERSION` argument entirely; it defaults to the project version.)

You have two choices next. You need to make a `MyLibConfig.cmake`, but you can do it either by exporting your targets directly to it, or by writing it by hand, then including the targets file. The latter option is what you'll need if you have any dependencies, even just OpenMP, so I'll illustrate that method.

First, make an install targets file (very similar to the one you made in the build directory):

```cmake
install(EXPORT MyLibTargets
        FILE MyLibTargets.cmake
        NAMESPACE MyLib::
        DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
        )
```

This file will take the targets you exported and put them in a file. If you have no dependencies, just use `MyLibConfig.cmake` instead of `MyLibTargets.cmake` here. Then write a custom `MyLibConfig.cmake` file in your source tree somewhere. If you want to capture configure time variables, you can use a `.in` file, and you will want to use the `@var@` syntax. The contents then look like this:

```cmake
include(CMakeFindDependencyMacro)

# Capturing values from configure (optional)
set(my-config-var @my-config-var@)

# Same syntax as find_package
find_dependency(MYDEP REQUIRED)

# Any extra setup

# Add the targets file
include("${CMAKE_CURRENT_LIST_DIR}/MyLibTargets.cmake")
```

Now, you can use configure file (if you used a `.in` file) and then install the resulting file.
Since we've made a `ConfigVersion` file, this is a good place to install it too.

```cmake
configure_file(MyLibConfig.cmake.in MyLibConfig.cmake @ONLY)
install(FILES "${CMAKE_CURRENT_BINARY_DIR}/MyLibConfig.cmake"
              "${CMAKE_CURRENT_BINARY_DIR}/MyLibConfigVersion.cmake"
        DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
        )
```

That's it! Now once you install a package, there will be files in `${CMAKE_INSTALL_LIBDIR}/cmake/MyLib` (usually `lib/cmake/MyLib`) that CMake will search for (specifically, `MyLibConfig.cmake` and `MyLibConfigVersion.cmake`), and the targets file that config uses should be there as well.

When CMake searches for a package, it will look in the current install prefix and several standard places. You can also point CMake at the package manually, by adding the install prefix to `CMAKE_PREFIX_PATH`, or by setting `MyLib_DIR` to the directory containing the config file (or `MyLib_ROOT`, CMake 3.12+), and CMake gives the user nice help output if the configure file is not found.

The [CMakePackageConfigHelpers](https://cmake.org/cmake/help/latest/module/CMakePackageConfigHelpers.html) module mentioned above has additional tools to help write a more relocatable `Config.cmake` file.
Refer to the CMake documentation on [configure_package_config_file](https://cmake.org/cmake/help/latest/module/CMakePackageConfigHelpers.html#command:configure_package_config_file) (used instead of `configure_file`) and the `@PACKAGE_INIT@` substitution string to get

- a set of automatically defined `PACKAGE_<var>` variables (for relative path versions of `<var>`) and
- a `set_and_check()` alternative to `set()` to automatically check for path existence.
