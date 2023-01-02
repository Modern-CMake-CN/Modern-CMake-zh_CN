# 安装

进行安装时，安装命令会将文件或目标“安装”到安装树中。简单的目标安装命令:

```cmake
install(TARGETS MyLib
        EXPORT MyLibTargets
        LIBRARY DESTINATION lib
        ARCHIVE DESTINATION lib
        RUNTIME DESTINATION bin
        INCLUDES DESTINATION include
        )
```

当有一个库、静态库或程序要安装时，才需要不同的目的地。由于目标不安装INCLUDES目录，所以INCLUDES目标是特殊的。它只在导出的目标上设置包含目标(通常已经由target_include_directories设置，因此检查MyLibTargets文件，若想要干净的cmake文件，需要确认没有多次包含INCLUDES目录)。

通常给定CMake访问版本是个好主意，这样`find_package`就可以指定版本信息:

```cmake
include(CMakePackageConfigHelpers)
write_basic_package_version_file(
    MyLibConfigVersion.cmake
    VERSION ${PACKAGE_VERSION}
    COMPATIBILITY AnyNewerVersion
    )
```

接下来有两个选择。需要创建`MyLibConfig.cmake`，可以直接将目标在这个文件中导出，或者手动写入，然后包含目标文件。若有依赖项(可能只是OpenMP)，则需要添加相应的选项。

首先，创建一个安装目标文件(非常类似于在build目录中创建的文件):

```cmake
install(EXPORT MyLibTargets
        FILE MyLibTargets.cmake
        NAMESPACE MyLib::
        DESTINATION lib/cmake/MyLib
         )
```

该文件将获取导出目标，并将其放入文件中。若没有依赖项，只需使用`MyLibConfig.cmake`代替`MyLibTargets.cmake` 即可。然后，源树的某处，创建一个自定义`MyLibConfig.cmake`文件。若想要捕获配置时的变量，可以使用`.in`文件，并且可以使用`@var@`语法。具体方式如下所示:

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

现在，可以使用配置文件(若使用`.in`文件)，然后安装已生成的文件。因为已经创建了`ConfigVersion`文件，所以可以在这里安装它。

```cmake
configure_file(MyLibConfig.cmake.in MyLibConfig.cmake @ONLY)
install(FILES "${CMAKE_CURRENT_BINARY_DIR}/MyLibConfig.cmake"
              "${CMAKE_CURRENT_BINARY_DIR}/MyLibConfigVersion.cmake"
        DESTINATION lib/cmake/MyLib
        )
```

就是这样！现在，当安装了一个包，在`lib/cmake/MyLib`中就提供CMake搜索所需的文件(特别是`MyLibConfig。cmake`和`MyLibConfigVersion.cmake`)，配置时使用的目标文件应该也在那里。

当CMake搜索一个包时，它将在当前安装目录和几个标准位置中进行查找查找。也可以手动将相应的目录添加到搜索路径中，包括`MyLib_PATH`。若没有找到配置文件，CMake会输出相应的信息，告知用户当前的情况。
