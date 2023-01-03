# 安装

进行安装时，比如执行 `make install`，安装命令会将文件或目标“安装”到安装树中。简单使用目标安装指令的方式:

```cmake
install(TARGETS MyLib
        EXPORT MyLibTargets
        LIBRARY DESTINATION lib
        ARCHIVE DESTINATION lib
        RUNTIME DESTINATION bin
        INCLUDES DESTINATION include
        )
```

当有一个库、静态库或程序要安装时，才需要将不同的文件安装到不同的目的地。由于目标不安装包含目录，所以 包含（INCLUDES）目标是特殊的。只能在导出的目标上设置包含目录（通常由`target_include_directories`设置，若想要清理cmake文件，需要检查MyLibTargets文件，确定没有多次包含同一个包含目录）。

给定 CMake 可访问的版本是个不错的方式。使用 `find_package` 时，可以这样指定版本信息:

```cmake
include(CMakePackageConfigHelpers)
write_basic_package_version_file(
    MyLibConfigVersion.cmake
    VERSION ${PACKAGE_VERSION}
    COMPATIBILITY AnyNewerVersion
    )
```

接下来有两个选择。创建`MyLibConfig.cmake`，可以直接将目标导出放在这个文件中，或者手动写入，然后包目标文件。若有依赖项（可能只是OpenMP），则需要添加相应的选项。下面是个例子：

首先，创建一个安装目标文件（类似于在构建目录中创建的文件）：

```cmake
install(EXPORT MyLibTargets
        FILE MyLibTargets.cmake
        NAMESPACE MyLib::
        DESTINATION lib/cmake/MyLib
         )
```

该文件将获取导出目标，并将其放入文件中。若没有依赖项，只需使用 `MyLibConfig.cmake` 代替 `MyLibTargets.cmake` 即可。然后，在源码树的某处，创建一个自定义 `MyLibConfig.cmake` 文件。若想要捕获配置时的变量，可以使用 `.in` 文件，并且可以使用 `@var@` 语法。具体方式如下所示：

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

现在，可以使用配置文件（若使用 `.in` 文件），然后安装已生成的文件。因为创建了`ConfigVersion`文件，所以可以在这里安装它。

```cmake
configure_file(MyLibConfig.cmake.in MyLibConfig.cmake @ONLY)
install(FILES "${CMAKE_CURRENT_BINARY_DIR}/MyLibConfig.cmake"
              "${CMAKE_CURRENT_BINARY_DIR}/MyLibConfigVersion.cmake"
        DESTINATION lib/cmake/MyLib
        )
```

就是这样！现在，当包安装完成后，`lib/cmake/MyLib` 中就出现了 CMake 搜索所需的文件（特别是`MyLibConfig.cmake`和`MyLibConfigVersion.cmake`），配置时使用的目标文件应该也在那里。

当 CMake 搜索包时，将在当前安装目录，以及几个标准位置中进行查找。可以手动将相应的目录添加到搜索路径中，包括 `MyLib_PATH`。若没有找到配置文件，CMake会输出相应的信息，告知用户当前的情况。
