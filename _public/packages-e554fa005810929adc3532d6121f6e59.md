# 查找包

CMake 中有两种方式查找包：“模块”模式（Module）和“配置”模式（Config）。

在模块模式下，`find_package(XYZ)` 会查找名为 `FindXYZ.cmake` 的文件，该文件可能由 CMake 自身附带，也可能由你的项目（通过 `CMAKE_MODULE_PATH`）提供。查找模块之所以存在，是因为被搜索的包本身并不了解 CMake，需要由查找模块在系统中四处探查以找到合适的文件。接下来的几节将介绍 CMake 自带的几个最实用的查找模块。

在配置模式下，包自身会附带一个 `XYZConfig.cmake`（或 `xyz-config.cmake`）文件，准确描述如何使用该包，正如上一章所示。对于支持 CMake 的包而言，这是首选机制；CMake 会搜索标准的安装位置，你也可以通过 `CMAKE_PREFIX_PATH` 或 `XYZ_DIR` 将其指向非常规安装位置。

默认情况下，`find_package` 会先尝试模块模式，随后回退到配置模式；你可以使用 `MODULE` 或 `CONFIG` 关键字将其限制为仅使用其中一种。无论采用哪种方式，设计良好的包都会提供导入目标（通常带有类似 `XYZ::XYZ` 的命名空间）—— 使用 `target_link_libraries` 链接这些目标才是现代接口，而非使用 `XYZ_INCLUDE_DIRS`/`XYZ_LIBRARIES` 风格的变量。
