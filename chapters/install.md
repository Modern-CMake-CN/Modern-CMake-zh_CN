# 导出与安装

让别人使用库有三种好方法和一种坏方法:

## 查找模块（不好的方式）

`Find<mypackage>.cmake` 脚本是为那些不支持 CMake 的库所设计，所以已经使用 CMake 的库，无需不要创建这个脚本文件！可以使用 `Config<mypackage>.cmake`，具体方式如下所示。

## 添加子项目

可以将项目作为一个子目录放置于包中，接着使用 `add_subdirectory` 添加相应的子目录，这适用于纯头文件和快速编译的库。还需要注意的是，安装命令可能会干扰父项目，因此可以使用 `add_subdirectory` 的`EXCLUDE_FROM_ALL`选项；当显式使用的目标时，仍然会进行构建。

作为库的作者，请使用 `CMAKE_CURRENT_SOURCE_DIR` 而非 `PROJECT_SOURCE_DIR` (对于其他变量也是如此，比如`CMAKE_CURRRENT_BINARY_DIR`)。通过检查 `CMAKE_PROJECT_NAME` 和 `PROJECT_NAME` 的内容是否相同 （STREQUAL），可以只添加对项目有意义的选项或默认值。

此外，使用命名空间也是不错的方式。使用库的方式应该与下面的一致，应该对所有方法的使用进行标准化。

```cmake
add_library(MyLib::MyLib ALIAS MyLib)
```

这里的 ALIAS（别名）目标不会在后面导出。


## 导出

第三种方法是 `*Config.cmake` 脚本，这将是下一章的主题。
