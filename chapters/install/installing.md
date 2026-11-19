# 安装

进行安装时，比如执行 `make install`，安装命令会将文件或目标“安装”到安装树中。不要硬编码 `lib` 这样的目标路径（例如在使用 `lib64` 的发行版上这会出错），而应使用标准的 [GNUInstallDirs](https://cmake.org/cmake/help/latest/module/GNUInstallDirs.html) 模块，它提供了类似 `CMAKE_INSTALL_LIBDIR` 这样带有适配当前平台默认值的缓存变量。简单使用目标安装指令的方式:

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

当有一个库、静态库或程序要安装时，才需要将不同的文件安装到不同的目的地；从 CMake 3.14 开始，你可以完全省略它们，CMake 会自动采用这些合理的默认值。由于目标不安装包含目录，所以 包含（INCLUDES）目标是特殊的。只能在导出的目标上设置包含目录（通常由`target_include_directories`设置，若想要清理 cmake 文件，需要检查 MyLibTargets 文件，确定没有多次包含同一个包含目录）。

给定 CMake 可访问的版本是个不错的方式。使用 `find_package` 时可以指定版本信息，这里使用的是你在 `project()` 命令中设置的项目版本：

```cmake
include(CMakePackageConfigHelpers)
write_basic_package_version_file(
    MyLibConfigVersion.cmake
    VERSION ${PROJECT_VERSION}
    COMPATIBILITY AnyNewerVersion
    )
```

（你也可以完全省略 `VERSION` 参数，它默认就是项目版本。）

接下来有两个选择。创建`MyLibConfig.cmake`，可以直接将目标导出放在这个文件中，或者手动写入，然后包目标文件。若有依赖项（可能只是 OpenMP），则需要添加相应的选项。下面是个例子：

首先，创建一个安装目标文件（类似于在构建目录中创建的文件）：

```cmake
install(EXPORT MyLibTargets
        FILE MyLibTargets.cmake
        NAMESPACE MyLib::
        DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
        )
```

该文件将获取导出目标，并将其放入文件中。若没有依赖项，只需使用 `MyLibConfig.cmake` 代替 `MyLibTargets.cmake` 即可。然后，在源码树的某处，创建一个自定义 `MyLibConfig.cmake` 文件。若想要捕获配置时的变量，可以使用 `.in` 文件，并且可以使用 `@var@` 语法。具体方式如下所示：

```cmake
include(CMakeFindDependencyMacro)

# 捕获配置阶段的变量值（可选）
set(my-config-var @my-config-var@)

# 语法与 find_package 相同
find_dependency(MYDEP REQUIRED)

# 其他额外配置

# 引入目标文件
include("${CMAKE_CURRENT_LIST_DIR}/MyLibTargets.cmake")
```

现在，可以使用配置文件（若使用 `.in` 文件），然后安装已生成的文件。因为创建了`ConfigVersion`文件，所以可以在这里安装它。

```cmake
configure_file(MyLibConfig.cmake.in MyLibConfig.cmake @ONLY)
install(FILES "${CMAKE_CURRENT_BINARY_DIR}/MyLibConfig.cmake"
              "${CMAKE_CURRENT_BINARY_DIR}/MyLibConfigVersion.cmake"
        DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
        )
```

就是这样！现在，当包安装完成后，`${CMAKE_INSTALL_LIBDIR}/cmake/MyLib`（通常是 `lib/cmake/MyLib`）中就出现了 CMake 搜索所需的文件（特别是`MyLibConfig.cmake`和`MyLibConfigVersion.cmake`），配置时使用的目标文件应该也在那里。

当 CMake 搜索包时，将在当前安装目录，以及几个标准位置中进行查找。你也可以手动为 CMake 指定包的位置：将安装前缀添加到 `CMAKE_PREFIX_PATH`，或者将 `MyLib_DIR` 设置为包含该配置文件的目录（或者在 CMake 3.12+ 中设置 `MyLib_ROOT`）。若没有找到配置文件，CMake 会输出相应的信息，告知用户当前的情况。

上文提到的 [CMakePackageConfigHelpers](https://cmake.org/cmake/help/latest/module/CMakePackageConfigHelpers.html) 模块还提供了额外的工具，可以帮助编写更具可重定位性的 `Config.cmake` 文件。请参阅 CMake 文档中关于 [configure_package_config_file](https://cmake.org/cmake/help/latest/module/CMakePackageConfigHelpers.html#command:configure_package_config_file)（用于替代 `configure_file`）和 `@PACKAGE_INIT@` 替换字符串的说明，以获得：

- 一组自动定义的 `PACKAGE_<var>` 变量（对应 `<var>` 的相对路径版本），以及
- 用于替代 `set()` 的 `set_and_check()`，可自动检查路径是否存在。
