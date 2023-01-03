# 打包

CMake有两种打包方式：一是使用`CPackConfig.cmake`文件；二是将 CPack 变量放置在 CMakeLists.txt 文件中。若想要包含主构建的相关变量（比如：版本号），可以使用配置文件的方式。这里，我将展示第二种方式：

```cmake
# Packaging support
set(CPACK_PACKAGE_VENDOR "Vendor name")
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "Some summary")
set(CPACK_PACKAGE_VERSION_MAJOR ${PROJECT_VERSION_MAJOR})
set(CPACK_PACKAGE_VERSION_MINOR ${PROJECT_VERSION_MINOR})
set(CPACK_PACKAGE_VERSION_PATCH ${PROJECT_VERSION_PATCH})
set(CPACK_RESOURCE_FILE_LICENSE "${CMAKE_CURRENT_SOURCE_DIR}/LICENCE")
set(CPACK_RESOURCE_FILE_README "${CMAKE_CURRENT_SOURCE_DIR}/README.md")
```

这些是生成工件包时最常见的变量。工件包使用CMake的安装机制，已经安装的东西都会显示出来。

当然，还可以制作源码包。可以将相应的正则表达式添加到 `CMAKE_SOURCE_IGNORE_FILES` 中，以确保只打包期望的文件（排除构建目录或git信息）；否则，`package_source` 会将源目录中的所有内容打包在一起。这里，也可以根据自己的喜欢的文件类型，对源码包生成器进行设置：

```cmake
set(CPACK_SOURCE_GENERATOR "TGZ;ZIP")
set(CPACK_SOURCE_IGNORE_FILES
    /.git
    /dist
    /.*build.*
    /\\\\.DS_Store
)
```

注意，这种方式无法在Windows系统中正常运行，但是生成的源码包可以在Windows系统中正常使用。

最后，需要包含一下CPack模块:

```cmake
include(CPack)
```
