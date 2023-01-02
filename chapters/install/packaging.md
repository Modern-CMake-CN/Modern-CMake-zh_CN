# 打包

CMake有两种方法构建包：一个是使用CPackConfig；二是将CPack变量集成到CMakeLists.txt文件中。若想要包含主版本中的变量，比如版本号，可以使用配置文件的方式。我将向展示直接集成的版本:

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

这些是生成二进制包时最常见的变量。二进制包使用CMake的安装机制，因此已安装的包都会显示出来。

当然，还可以制作源码包。可以将`CMAKE_SOURCE_IGNORE_FILES`设置为正则表达式，以确保获取期望的文件(如构建目录或git信息);否则，`package_source`会将源目录中的所有内容打包在一起。设置源码包生成器，可以生成相应文件类型的源码包:

```cmake
set(CPACK_SOURCE_GENERATOR "TGZ;ZIP")
set(CPACK_SOURCE_IGNORE_FILES
    /.git
    /dist
    /.*build.*
    /\\\\.DS_Store
)
```

注意，这无法在Windows上工作，但是生成的源码包可以在Windows上工作。

最后，包含CPack模块:

```cmake
include(CPack)
```
