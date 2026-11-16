# Packaging

There are two ways to instruct CMake to build your package; one is to use a CPackConfig.cmake file, and the other is to integrate the CPack variables into your CMakeLists.txt file. Since you want variables from your main build to be included, like version number, you'll want to make a configure file if you go that route. I'll show you the integrated version:

```cmake
# Packaging support
set(CPACK_PACKAGE_VENDOR "Vendor name")
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "Some summary")
set(CPACK_PACKAGE_VERSION_MAJOR ${PROJECT_VERSION_MAJOR})
set(CPACK_PACKAGE_VERSION_MINOR ${PROJECT_VERSION_MINOR})
set(CPACK_PACKAGE_VERSION_PATCH ${PROJECT_VERSION_PATCH})
set(CPACK_RESOURCE_FILE_LICENSE "${CMAKE_CURRENT_SOURCE_DIR}/LICENSE")
set(CPACK_RESOURCE_FILE_README "${CMAKE_CURRENT_SOURCE_DIR}/README.md")
```

These are the most common variables you'll need to make a binary package. A binary package uses the install mechanism of CMake, so anything that is installed will be present.

You can also make a source package. You should set `CPACK_SOURCE_IGNORE_FILES` to regular expressions that ensure you don't pick up any extra files (like the build directory or git details); otherwise `make package_source` will bundle up literally everything in the source directory. You can also set the source generator to make your favorite types of files for source packages:

```cmake
set(CPACK_SOURCE_GENERATOR "TGZ;ZIP")
set(CPACK_SOURCE_IGNORE_FILES
    /.git
    /dist
    /.*build.*
    /\\\\.DS_Store
)
```

Note that this will not work on Windows, but the generated source packages work on Windows.

Finally, you need to include the CPack module:

```cmake
include(CPack)
```
