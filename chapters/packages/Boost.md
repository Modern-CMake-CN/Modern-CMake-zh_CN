# Boost 库

CMake 提供 Boost 库的查找包，但其工作方式有一些奇怪。参见 [FindBoost] 获得完整的描述：这只是一个快速的概述，并提供一个示例。务必查看页面上使用 CMake 的最低版本，然后再查看有哪些选项。

首先，可以使用在搜索 Boost 之前设置的一组变量，自定义选定的 Boost 库的行为。可设置的变量随着 CMake 的发展变得越来越多，但这里仅设置三个常见的变量：

```cmake
set(Boost_USE_STATIC_LIBS OFF)
set(Boost_USE_MULTITHREADED ON)
set(Boost_USE_STATIC_RUNTIME OFF)
```

CMake 3.5 添加了导入目标。这些目标可以帮助你处理依赖关系，所以这也是添加Boost库的好方法。然而，CMake 在所有已知版本的 Boost 中都包含依赖信息，因此 CMake 的版本必须比 Boost 更新，这样CMake才能正常工作。最近的 [合并请求][MROldBoost] 中，CMake开始假设依赖项会从已知的上一个版本继承下来，并直接使用它（同时给出警告）。这个功能也反向移植到 CMake 3.9。

导入目标位于 `Boost::` 命名空间。只有 `Boost::boost` 有头文件，其他组件均是预编译的库文件。这里，可以根据需要包含相应的依赖项。

下面的例子使用了 `Boost::filesystem` 库：

```cmake
set(Boost_USE_STATIC_LIBS OFF)
set(Boost_USE_MULTITHREADED ON)
set(Boost_USE_STATIC_RUNTIME OFF)
find_package(Boost 1.50 REQUIRED COMPONENTS filesystem)
message(STATUS "Boost version: ${Boost_VERSION}")

# This is needed if your Boost version is newer than your CMake version
# or if you have an old version of CMake (<3.5)
if(NOT TARGET Boost::filesystem)
    add_library(Boost::filesystem IMPORTED INTERFACE)
    set_property(TARGET Boost::filesystem PROPERTY
        INTERFACE_INCLUDE_DIRECTORIES ${Boost_INCLUDE_DIR})
    set_property(TARGET Boost::filesystem PROPERTY
        INTERFACE_LINK_LIBRARIES ${Boost_LIBRARIES})
endif()

target_link_libraries(MyExeOrLibrary PUBLIC Boost::filesystem)
```



[FindBoost]: https://cmake.org/cmake/help/latest/module/FindBoost.html
[MROldBoost]: https://gitlab.kitware.com/cmake/cmake/merge_requests/1172
