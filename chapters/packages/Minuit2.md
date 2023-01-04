# Minuit2

Minuit2 在独立模式下可用，用于 ROOT 不可用或未启用 Minuit2 构建的情况。本节会介绍推荐的用法，以及讨论一下集成设计方面的事宜。

## 用法

Minuit2 可以以标准的 方式使用 CMake，无论是使用 ROOT 源码，还是使用单独发行的源码包：

```cmake
# Check for Minuit2 in ROOT if you want
# and then link to ROOT::Minuit2 instead

add_subdirectory(minuit2) # or root/math/minuit2
# OR
find_package(Minuit2 CONFIG) # Either build or install

target_link_libraries(MyProgram PRIVATE Minuit2::Minuit2)
```


## 开发

Minuit2 是将现代 CMake（CMake 3.1+）构建，集成到现有框架的解决方案。同时，也是一个很好的例子。

要处理两个不同的 CMake 系统，主 `CMakeLists.txt` 定义一些公共选项，然后使用 `Standalone.cmake` （不作为 ROOT 的一部分构建的情况下）。

ROOT 案例中最困难的部分是，Minuit2 需要 `math/minuit2` 目录之外的文件。这个问题，通过使用`copy_standalone.cmake` 解决了。文件中使用一个函数，该函数接受一个文件名列表，然后返回原始源中的文件名列表；或者将文件复制到本地源中，并返回列表的新位置；亦或者，若原始源不存在（独立模式），则只返回列表的新位置。

```bash
# Copies files into source directory
cmake /root/math/minuit2 -Dminuit2-standalone=ON

# Makes .tar.gz from source directory
make package_source

# Optional, clean the source directory
make purge
```

但这仅适用于使用源码包的开发人员 —— 普通用户*不会选择该选项*，也不会创建源码的副本。

可以使用`make install` 或 `make package` （生成工件包），而无需从 ROOT 源内部或从独立发行包中添加 `standalone` 选项。

[Minuit2]: https://root.cern.ch
