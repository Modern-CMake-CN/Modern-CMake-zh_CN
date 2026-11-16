# Boost 库

自 Boost 1.70 起，Boost 就自带了 CMake 配置文件 `BoostConfig.cmake`。CMake 过去也曾提供 [FindBoost] 模块，但由于未能跟上更新节奏，已在 CMake 3.30 中被禁用（策略 [CMP0167]）；在当前的 CMake 中，`find_package(Boost)` 会直接使用 Boost 安装的配置文件。配置模式带来的一大好处在于，Boost 会自行描述其目标与依赖关系，因此即便 Boost 版本比 CMake 版本更新也毫无影响。

在搜索 Boost 之前，可以通过设置一组变量来自定义选择哪种变体的库；以下是最常用的三个变量：

```cmake
set(Boost_USE_STATIC_LIBS OFF)
set(Boost_USE_MULTITHREADED ON)
set(Boost_USE_STATIC_RUNTIME OFF)
```

导入目标位于 `Boost::` 命名空间。`Boost::headers` 是纯头文件部分（历史上曾称为 `Boost::boost`）。诸如 `Boost::filesystem` 等编译生成的库同样可用，并会按需自动引入其依赖项。

下面的例子中使用了 Boost.Filesystem 库：

```cmake
find_package(Boost 1.70 REQUIRED COMPONENTS filesystem)
message(STATUS "Boost version: ${Boost_VERSION}")

target_link_libraries(MyExeOrLibrary PUBLIC Boost::filesystem)
```

[cmp0167]: https://cmake.org/cmake/help/latest/policy/CMP0167.html
[findboost]: https://cmake.org/cmake/help/v3.29/module/FindBoost.html
