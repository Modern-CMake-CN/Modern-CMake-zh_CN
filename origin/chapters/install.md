# Exporting and Installing

There are three good ways and one bad way to allow others use your library:

## Find module (the bad way)

If you are the library author, don't make a `Find<mypackage>.cmake` script! These were designed for libraries whose authors did not support CMake. Use a `Config<mypackage>.cmake` instead as listed below.

## Add Subproject

A package can include your project in a subdirectory, and then use `add_subdirectory` on the subdirectory. This useful for header-only and quick-to-compile libraries. Note that the install commands may interfere with the parent project, so you can add `EXCLUDE_FROM_ALL` to the `add_subdirectory` command; the targets you explicitly use will still be built.

In order to support this as a library author, make sure you use `CMAKE_CURRENT_SOURCE_DIR` instead of `PROJECT_SOURCE_DIR` (and likewise for other variables, like binary dirs). You can check `CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME` to only add options or defaults that make sense if this is a project.

Also, since namespaces are a good idea, and the usage of your library should be consistent with the other methods below, you should add

```cmake
add_library(MyLib::MyLib ALIAS MyLib)
```

to standardise the usage across all methods. This ALIAS target will not be exported below.


## Exporting

The third way is `*Config.cmake` scripts; that will be the topic of the next chapter in this session.
