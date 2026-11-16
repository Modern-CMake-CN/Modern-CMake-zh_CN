# Exporting

:::{danger}

The default behavior for exporting changed in CMake 3.15. Since changing files in a user's home directory is considered "surprising" (and it is, which is why this chapter exists), it is no longer the default behavior. If you set a minimum or maximum CMake version of 3.15 or later, this will no longer happen unless you set `CMAKE_EXPORT_PACKAGE_REGISTRY` as shown below.

:::

There are three ways to access a project from another project: subdirectory, exported build directories, and installing. To use the build directory of one project in another project, you will need to export targets. Exporting targets is needed for a proper install; allowing the build directory to be used is just two added lines. It is not generally a way to work that I would recommend, but can be useful for development and as way to prepare the installation procedure discussed later.

You should make an export set, probably near the end of your main `CMakeLists.txt`:

```cmake
export(TARGETS MyLib1 MyLib2 NAMESPACE MyLib:: FILE MyLibTargets.cmake)
```

This puts the targets you have listed into a file in the build directory, and optionally prefixes them with a namespace. Now, to allow CMake to find this package, export the package into the `$HOME/.cmake/packages` folder:

```cmake
set(CMAKE_EXPORT_PACKAGE_REGISTRY ON)
export(PACKAGE MyLib)
```

Now, if you `find_package(MyLib)`, CMake can find the build folder. Look at the generated `MyLibTargets.cmake` file to help you understand exactly what is created; it's just a normal CMake file, with the exported targets.

Note that there's a downside: if you have imported dependencies, they will need to be imported before you `find_package`. That will be fixed in the next method.
