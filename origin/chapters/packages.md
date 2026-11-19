# Finding Packages

There are two ways to find packages in CMake: "Module" mode and "Config" mode.

In Module mode, `find_package(XYZ)` looks for a file named `FindXYZ.cmake`, either shipped with CMake itself or provided by your project (via `CMAKE_MODULE_PATH`). Find modules exist because the package being searched for doesn't know anything about CMake; the module pokes around the system looking for the right files. The following pages cover several of the most useful find modules CMake ships with.

In Config mode, the package itself ships an `XYZConfig.cmake` (or `xyz-config.cmake`) file describing exactly how to use it, as shown in the previous chapter. This is the preferred mechanism for packages that support CMake; CMake searches the standard install locations, and you can point it at unusual ones with `CMAKE_PREFIX_PATH` or `XYZ_DIR`.

By default, `find_package` tries Module mode first, then falls back to Config mode; you can restrict it to one or the other with the `MODULE` or `CONFIG` keywords. Either way, a well-behaved package provides imported targets, usually namespaced like `XYZ::XYZ` — linking to those with `target_link_libraries` is the modern interface, rather than using `XYZ_INCLUDE_DIRS`/`XYZ_LIBRARIES` style variables.
