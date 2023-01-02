# 导出和安装

让别人使用你的库有三种好方法和一种坏方法:

## 查找模块(不好的方式)

作为库的作者，不要创建`Find<mypackage>.cmake`脚本！这个脚本是为那些不支持CMake的库设计的。可以使用`Config<mypackage>.cmake`，具体方式如下所示。

## 添加子项目

包可以将项目放在其子目录中，然后可以使用`add_subdirectory`添加子目录。这对于纯头文件和快速编译的库非常有用。注意，安装命令可能会干扰父项目，因此可以启用`add_subdirectory`的`EXCLUDE_FROM_ALL`选项;这样，当显式使用的目标时，仍然会进行构建。

作为库的作者，请使用`CMAKE_CURRENT_SOURCE_DIR`而非`PROJECT_SOURCE_DIR`(对于其他变量，如binary目录也是如此)。通过检查`CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME`，只添加对项目有意义的选项或默认值。

此外，还可以使用命名空间，而且库的使用应该与下面的其他方法一致

```cmake
add_library(MyLib::MyLib ALIAS MyLib)
```

标准化的使用方法。并且，这个ALIAS(别名)目标不会在后面导出。


## 导出

第三种方法是`*Config.cmake`脚本，这将是下一章的主题。
