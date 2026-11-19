# CMake 各个版本添加的新特性

CMake 修改记录的简化版本，这里仅挑了作者认为的重点。这里，每个版本的名称都由作者自行命名，不要太在意。

## [CMake 开发中][cmake master]：WIP

CMake 4.5 正在开发中，目前尚无重大更新。

## [CMake 4.4][]：诊断系统

此版本引入了结构化的诊断系统（取代了旧的警告变量与标志）、`SOURCES` 文件集类型、测试阶段的测试用例发现机制，以及一系列脚本编写方面的便利功能。

- 首次发布于 [2026 年 7 月 14 日](https://www.kitware.com/cmake-4-4-0-available-for-download/)
- 新增 `cmake_diagnostic()` 命令，支持按类别对警告进行结构化控制（`CMAKE_WARN_DEPRECATED`/`CMAKE_ERROR_DEPRECATED` 变量以及 `-W[no-][error=]dev` 标志现已弃用，由 `author` 类别取代）
- 新增用于指定目标源文件的 `SOURCES` 文件集（file set）类型
- 新增 `discover_tests()` 命令，用于注册在测试阶段发现的测试用例；Ninja 新增了 `test_prep/<test-name>` 目标，且 ctest 支持在 `--` 之后向测试转发额外参数
- `cmake_parse_arguments()` 新增 `PARSE_ARGN` 签名
- `list(FILTER)`、`list(SORT)` 和 `list(TRANSFORM)` 支持传入回调谓词/比较器
- `execute_process()` 新增 `ENVIRONMENT` 和 `ENVIRONMENT_MODIFICATION` 选项
- `cmake --install` 支持指定多个组件以及并行任务
- `cmake`、`ctest` 和 `cpack` 新增 `--presets-file` 选项（同时预设 schema 升级至 v12）
- `write_basic_package_version_file()` 新增 `SamePatchVersion`、`SameFullVersion` 和 `SemanticVersion` 兼容性模式
- 支持 CUDA 23（NVCC 13.3+）；`clang-cl` 支持 C++20 具名模块（named modules）
- FindPython 支持自由线程（free-threaded）Python 的稳定 ABI（Stable ABI）
- `macro()` 现在会保留参数中的反斜杠（CMP0219）

## [CMake 4.3][]：包规范

此版本新增了对通用包规范（Common Package Specification，CPS）的支持——这是一种与语言无关的包描述格式，软件包现在可以生成和消费该格式，从而替代手写的 CMake 配置文件。此外还新增了用于分析配置与构建步骤性能的插桩（instrumentation）框架。

- 首次发布于 [2026 年 3 月 17 日](https://www.kitware.com/cmake-4-3-0-available-for-download/)
- [`find_package`](https://cmake.org/cmake/help/latest/command/find_package.html) 现在可以搜索并导入 CPS 包
- [`install`](https://cmake.org/cmake/help/latest/command/install.html) 和 [`export`](https://cmake.org/cmake/help/latest/command/export.html) 新增 `PACKAGE_INFO` 模式，用于生成 CPS 包描述文件
- [`project`](https://cmake.org/cmake/help/latest/command/project.html) 新增 `COMPAT_VERSION` 和 `SPDX_LICENSE` 选项
- 新增 [cmake-instrumentation](https://cmake.org/cmake/help/latest/manual/cmake-instrumentation.7.html) 工具，可在配置/生成/构建/测试/安装阶段收集耗时与诊断数据，支持在 CDash 中查看或导出为 Google Trace Event 文件
- `cmake --build` 现在支持同时指定构建目录和 `--preset`
- `cmake --version` 支持输出 JSON 格式，并新增了 `cmake -E bin2c`
- 归档处理（`cmake -E tar`、`file(ARCHIVE_CREATE)`、CPack）新增多线程、压缩级别以及更多压缩算法支持
- `get_property`/`set_property` 支持 `FILE_SET` 作用域
- 新增字符串比较和 `$<STRING:...>` 生成器表达式，以及针对文件集和源文件的查询表达式
- FindRuby 和 FindSQLite3 现在提供导入目标

## [CMake 4.2][]：Emscripten

此版本新增了原生 Emscripten 交叉编译支持。此外还包含许多实用的小改进，例如 `find_package` 提供大小写匹配的版本变量、目标文件控制、直接操作缓存等。

- 首次发布于 [2025 年 11 月 19 日](https://www.kitware.com/cmake-4-2-0-available-for-download/)
- 文件 API 更新（2.9 版），提供关于导入目标/接口目标的更多信息
- 新增 Visual Studio 18 2026 生成器支持（弃用 Visual Studio 14 2015）
- 支持 Emscripten（WebAssembly）交叉编译
- 新增 `cmake -E copy_if_newer`（以及对应的目录版本）
- 新增 `set(CACHE{<variable>}`（以及 `unset`），可直接操作缓存变量
- 新增 `string(REGEX QUOTE)`（类似于 Python 中的 `re.escape`）
- 新增 `OBJECT_NAME` 和 `INSTALL_OBJECT_*` 等属性，用于控制生成的目标文件（object files）
- 所有查找模块均新增了大小写匹配的 `<PackageName>_VERSION` 变量
- NumPy 不再依赖 Development.Module（CMP0201）
- ExternalProject 支持设置环境变量

## [CMake 4.1][]：细节打磨

此版本改进了 pkg-config 集成、为查找命令引入了 `OPTIONAL` 关键字，并包含其他一些小改动。该版本主要专注于打磨各类边界情况。

- 首次发布于 [2025 年 8 月 5 日](https://www.kitware.com/cmake-4-1-0-available-for-download/)
- `cmake_pkg_config` 现已支持 `IMPORT` 和 `POPULATE`
- 改进了与查找命令相关的配置日志
- 新增 `CMAKE_FIND_REQUIRED` 变量，并为所有查找命令新增 `OPTIONAL` 关键字
- `CMAKE_<LANG>_COMPILER_ARCHITECTURE_ID` 现已公开，并已为大多数编译器填充该值
- FindBLAS 和 FindLAPACK 新增对 NVIDIA 的支持
- FindPython 系列模块在交叉编译时强制要求一致性（CMP0190）
- 引入受策略 CMP0192 和 CMP0193 控制的若干 GNUInstallDirs 变更

## [CMake 4.0][]：辞旧迎新

此版本移除了对将 CMake 策略版本设置为低于 3.5 的支持。这意味着 `cmake_minimum_required(VERSION 3.4)` 现在会报错，但类似 `cmake_minimum_required(VERSION 3.4...3.15)` 的版本范围写法仍然有效。将最低版本设置为低于 3.10 产生警告也已有一段时间了。对于尚未更新的第三方库，可以使用 `CMAKE_POLICY_VERSION_MINIMUM` 进行兼容变通。

- 首次发布于 [2025 年 3 月 27 日](https://www.kitware.com/cmake-4-0-0-available-for-download/)
- 新增 `CMAKE_POLICY_VERSION_MINIMUM` 变量以用于构建旧项目（移除了对 <3.5 的支持）
- 新增控制 `CMakeLists.txt` 文件名的标志（`--project-file`，仅供开发调试使用）
- 新增若干链接器特性，例如 `LINKER:` 前缀和 `CMAKE_LINK_WARNING_AS_ERROR`
- 支持为目标设置调试器工作目录
- 借助新增的 `Python_ARTIFACTS_PREFIX`，可在同一目录中多次调用 FindPython
- 生成器表达式支持转换为 `NATIVE_PATH`
- Visual Studio 2015/2017 生成器的平台选择行为现已与更新版本的生成器保持一致
- 简化了 macOS SDK 的选择逻辑，降低了隐式自动选择的程度

## [CMake 3.31][]：更完善的工作流预设

此版本新增了一系列小特性与补充功能，以及一些实验性的新技术。预设功能得到更新，其中包括用于工作流预设的更简短命令。

- 首次发布于 [2024 年 11 月 6 日](https://www.kitware.com/cmake-3-31-0-available-for-download/)
- 支持 LFortran 编译器
- 预设文件中支持 `$comment` 字段
- 新增 `cmake -LR <regex>` 用于搜索缓存
- 支持 `cmake --workflow <name>`（少写一个参数）
- 新增 `codegen` 目标以及 `add_custom_command` 中的 `CODEGEN` 选项
- 新增 `cmake_pkg_config` 命令，用于从 pkg-config 文件中提取值
- 新增 `CMAKE_HOST_EXECUTABLE_SUFFIX` 变量
- 改进了 CUDA 支持，包括获取宿主机编译器以及 OpenMP 支持
- 弃用对 CMake 3.10 及更早版本的支持
- 大量细节调整与清理
- [实验性](https://www.kitware.com/a-year-closer-to-standard-c-dependency-management/)支持 CPS（通用包规范）

## [CMake 3.30][]：C++26

此版本新增了 C++26 支持，并提供了获取编译器最新支持标准的方法。此外还包含许多未在下方逐一列出的小改动，例如更好的 TLS 支持、若干生成器表达式更新以及 schema 更新。

- 首次发布于 [2024 年 7 月 2 日](https://www.kitware.com/cmake-3-30-0-available-for-download/)
- 新增用于生成 `"` 字符的 `$<QUOTE>` 生成器表达式
- 完整实现了 C++26 编译特性支持（自 3.25 起已部分支持）
- `CMAKE_<LANG>_STANDARD_LATEST` 保存当前编译器支持的最新语言标准
- 支持自由线程（free-threaded）Python 3.13+（建议使用 3.30.3+）
- 改进了对 Windows 下 Python 调试构建的支持（新增变量和目标），且 `python_add_library` 现在会自动添加 `DEBUG_POSTFIX`
- 移除了 FindBoost 模块
- 移除了对 Visual Studio 2008 的支持

## [CMake 3.29][]：测试前构建

现在终于可以让 `test` 目标依赖于 `ALL` 了，这意味着运行 `cmake --build build -t test` 时会按需重新构建！不过需要显式启用该特性——将 `CMAKE_SKIP_TEST_ALL_DEPENDENCY` 设为 `FALSE`。此外，此版本还在脚本编写、链接器选择以及 Windows 下多种编译器组合的支持方面进行了多项改进。

- 首次发布于 [2024 年 3 月 21 日](https://www.kitware.com/cmake-3-29-0-available-for-download/)
- 新增链接器选择选项（`CMAKE_LINKER_TYPE`/`LINKER_TYPE`）
- `CMAKE_INSTALL_PREFIX` 现在可通过同名环境变量初始化
- `if` 命令支持检查文件权限
- 支持为测试选择启动器（`CMAKE_TEST_LAUNCHER`/`TEST_LAUNCHER`）
- 通过将 `CMAKE_SKIP_TEST_ALL_DEPENDENCY` 设为 `FALSE`，现在可以让测试依赖于 `all` 目标！
- 新增带退出码的脚本退出命令 `cmake_language(EXIT)`
- 支持在 Visual Studio 中选择 Intel OneAPI Fortran 编译器
- 支持在 Windows 上使用 Clang 编译 CUDA

## [CMake 3.28][]：C++20 模块

此版本新增了 [C++ 模块](https://cmake.org/cmake/help/latest/manual/cmake-cxxmodules.7.html)支持。虽然尚未包含 C++23 的 `import std`，但对于这一里程碑式的 C++20 特性而言仍是令人振奋的一步。当使用 C++20 及以上标准、足够新的编译器与受支持的生成器，且设置的 CMake 最低或最高版本包含 CMake 3.28 时，将默认启用模块扫描。

- 首次发布于 [2023 年 12 月 6 日](https://www.kitware.com/cmake-3-28-0-available-for-download/)
- Ninja 1.11+ 和 MSVC 17.4+ 支持 C++20 具名模块
- `HIP` 支持 NVIDIA 平台
- 新增对 Apple VisionOS 的支持
- 新增 `CMAKE_CROSSCOMPILING_EMULATOR` 环境变量
- 获取/设置 `TEST` 属性支持跨其他 `DIRECTORY` 操作
- 新增对作业服务器（job server）的部分支持
- 支持向 pkg-config 传递变量
- 生成器表达式现已支持短路求值（short-circuiting）

## [CMake 3.27][]：调试器

此版本新增了全新的 CMake 调试器！这有助于在 VS Code 等工具中更好地调试 CMake 代码。同时，此版本“移除”了 FindPythonLibs/FindPythonInterp/FindCUDA——若最低或最高版本设为 3.27 及以上，这些模块将不再可用。

- 首次发布于 [2023 年 7 月 19 日](https://www.kitware.com/cmake-3-27-0-available-for-download/)
- C++ 模块文件扩展名（`.ccm`、`.cxxm`、`.c++m`）现已被识别为 C++ 源文件
- 新增 `COMPILE_ONLY`、`LIST` 和 `PATH` 生成器表达式，以及若干更专用的表达式
- 新增 `SKIP_LINTING` 属性，并在 `<LANG>_CPPCHECK` 等代码检查属性中支持更多生成器表达式
- `find_package` 现在会搜索全大写的 `<PACKAGENAME>_ROOT` CMake 变量与环境变量
- 新增 `add_custom_command(... DEPENDS_EXPLICIT_ONLY` 及对应变量，用于控制 Ninja 的依赖关系
- CMake 构建的详细输出模式（verbose）现在会打印构建所用的工作目录和命令行
- 更好地支持多版本 MSVC
- 新增若干针对生成 `.cubin`/`.fatbin`/`.optixir` 的 CUDA 属性
- 将 `cmake_minimum_required` 设置为低于 3.5 现已弃用
- 半移除 FindCUDA，请改用 CUDA 语言支持与 FindCUDAToolkit
- 半移除 FindPythonLibs 和 FindPythonInterp，请改用 FindPython

## [CMake 3.26][]：日志与 Python

FindPython 迎来了两项重要更新：PyPy SOABI 支持与 LimitedAPI/StableABI 支持，大幅增强了 FindPython 的实用性。此外还有不少实用的修复与新增警告，例如当颠倒 `project()` 和 `cmake_minimum_required()` 的调用顺序时会发出警告。日志记录已从 `CMakeOutput.log` 和 `CMakeError.log` 迁移至全新的 `CMakeConfigureLog.yaml` 日志文件。

- 首次发布于 [2023 年 3 月 14 日](https://www.kitware.com/cmake-3-26-0-available-for-download/)
- FindPython 可以生成正确的 PyPy SOABI（终于！）
- FindPython 通过新标志支持 LimitedAPI/StableABI
- CMake 在输出目录中新增了记录配置阶段检查的 YAML 日志（同时新增 `message(CONFIGURE_LOG ...)`）
- 为 Microsoft ARM 汇编器新增 `ASM_MARMASM` 语言支持
- 新增表示 VS 版本号的 `CMAKE_VS_VERSION_BUILD_NUMBER` 变量
- `USE_FOLDERS` 现在默认开启
- 新增 `"<LANG>_CLANG_TIDY_EXPORT_FIXES_DIR"`，用于指定 clang-tidy 修复建议的输出目录
- CMake 的命令行复制工具支持仅在文件内容不同时更新
- `target_compile_options` 生成的编译选项现在会排在 `target_compile_features` / `CMAKE_<LANG>_STANDARD` 之后

## [CMake 3.25][]：块作用域和 SYSTEM

新增块作用域指令，可有选择地控制变量和策略，对 SYSTEM 也有更多的控制。可以在`find_`指令中使用 `VALIDATOR` 选项，并且工作流程也进行了升级。

- 首次发布于 [2022年11月16日](https://www.kitware.com/cmake-3-25-0-available-for-download/)
- 支持 C++26
- CUDA 的 nvcc 可以使用 LTO
- 新增了工作流预设和包预设。
- `SYSTEM` 可作为目录属性添加到 `add_subdirectory` 和 `FetchContent`
- `block()/endblock()` 用于策略/变量范围， `return()` 中新增 `PROPOGATE` 选项
- 添加了 `BSD` 和 `LINUX` 变量
- `find_*` 新增 `VALIDATOR` 选项。
- 对 `try_*` 系列命令进行了多项改进
- 新增的 `SYSTEM` 目标/目录属性和 `EXPORT_NO_SYSTEM`，同样用于 FetchContent 。

## [CMake 3.24][]：包查找器

一个很棒的版本。软件包编写者正在实现`find_package`和`FetchContent`的集成，这可以完成“丢失时下载”的工作，并且可以由软件包编写者配置。类似地，作为错误的警告可以由包设置，也可以由打包器删除（最好不要这样做，除非当前项目作为主项目构建！）。

- 首次发布于 [2022年8月4日](https://blog.kitware.com/cmake-3-24-0-is-available-for-download/)
- `--fresh` 选项在运行时可删除旧缓存。
- `find_package` 和 `FetchContent` 现在集成在一起了 —— 可以选择下载缺失的依赖项。
- `find_package` 新增 `GLOBAL` 选项。
- `CMAKE_PROJECT_TOP_LEVEL_INCLUDES` 允许用户（像打包器一样）注入项目代码。
- 生成器表达式可管理 `PATH`。
- 新增 `CMAKE_COLOR_DIAGNOSTICS` 环境变量和变量，取代 `CMAKE_COLOR_MAKEFILE`。
- 可以禁用 `find_*` 搜索安装前缀（目录）。
- 新增 `COMPILE_WARNING_AS_ERROR` 属性和 `CMAKE_` 变量，可使用 `--compile-no-warning-as-error`禁用。
- CUDA 支持对当前检测到的 GPU 进行 `native`  编译。
- `SYSTEM` 的包含路径可以在 MSVC 生成器上使用。
- 更好地支持 MSVC，XCode 等 IDE 。
- 支持 `LLVMFlang` 编译器。

## [CMake 3.23][]：纯头文件库

一个可靠的版本，只关注头文件库，更多的用户控件，CMake 预设，以及更好的 CUDA 支持。纯头文件库有一些强大的新特性，比如：各种 `*_SETS` 目标属性。有一些新的控件，可以限制 `find_` 查找路径，以及从现有目标中删除 `SYSTEM`。还可以获得了扩展的调试特性，以及将所有链接强制指向目标。预设可以包括其他文件。CUDA 和C# 部分进行了更新，并添加了几个编译器。

- 首次发布于 [2022年3月29日](https://blog.kitware.com/cmake-3-23-0-is-available-for-download/)
- CMake 预设的改进，可以包含其他文件。
- 两个新的编译器，以及更好的 C# 支持。
- `FILE_SET` 可用于 `install` 和 `target_sources` 纯头文件库。
- `<INTERFACE_>HEADER_SETS`, `<INTERFACE_>HEADER_DIRS` 为目标头文件。
- 新增 `CUDA_ARCHITECTURES` 对 all 和 all-major.a 的支持
- 可以为 `find_*` 或 find 模块启用 DEBUG 消息。
- `define_property()` 新增了 `INITIALIZE_FROM_VARIABLE` 选项。
- `CMAKE_<SYSTEM_>IGNORE_PREFIX_PATH` 可以控制 `find_*` 的查找路径。
- 新增 `<CMAKE_>LINK_LIBRARIES_ONLY_TARGETS` 强制只链接目标（非常适合查找错误！）
- `IMPORTED_NO_SYSTEM` 可强制从目标中删除 SYSTEM 的新属性。
- `FindGTest` 在找到 `GMock` 目标的情况下，会添加 `GMock` 目标。

## [CMake 3.22][]：方便的环境变量

一个较小的版本，在常见的构建方面进行了一些不错的改进。可以在开发环境中设置 `CMAKE_BUILD_TYPE` 来设置默认的构建类型，还有其他几个新环境变量和变量的添加。与标准相关的编译器标志进行了改进。`cmake_host_system_information` 在操作系统信息方面得到了进一步的改进（从 3.10 开始）。

- 首次发布于 [2021年11月18日](https://blog.kitware.com/cmake-3-22-0-available-for-download/)
- 新的默认环境变量 `CMAKE_BUILD_TYPE` 和 `CMAKE_CONFIGURATION_TYPES`
- 新增环境变量 `CMAKE_INSTALL_MODE` 用于安装类型（symlink）
- 新增 `CMAKE_REQUIRE_FIND_PACKAGE_<PackageName> `变量，将可选查找转换为必选查找
- 新增针对编译器的 `CMAKE_<LANG>_EXTENSIONS_DEFAULT` 变量
- `CMakeDependentOption` 可使用正常的条件语法
- CTest 可以修改环境变量
- 一些生成器可以在使用 MSVC 时包含外部（系统）头文件

## [CMake 3.21][]：配色

不同的消息类型有不同的颜色！现在有变量可以查看是否在顶级项目中。大量有关持续清理和特化的新特性，如添加HIP语言和C17和C23支持。继续改进预设。

- 首次发布于 [2021年7月14日](https://blog.kitware.com/cmake-3-21-0-available-for-download/)
- 初步支持 MSVC 2022
- 为 make 和 ninja 添加了 `CMAKE_<LANG>_LINKER_LAUNCHER`
- HIP 作为语言添加
- 新增 C17 和 C23 支持
- 新增 `--install-prefix <dir>` 和 `--toolchain <file>`
- 消息根据消息类型着色！
- 支持 MSYS，包括 `FindMsys`
- `file(` 指令更新，添加了 `EXPAND_TILDE` 属性
- 支持向 `install` 添加运行时的依赖项和工件
- 新增 `PROJECT_IS_TOP_LEVEL` 和 `<PROJECT-NAME>_IS_TOP_LEVEL`
- `find_` 指令在缓存方面的改进

## [CMake 3.20][]：文档

CMake 文档通过添加 “new in” 标签来快速查看添加的内容，无需切换文档版本，提高了工作效率！新增 C++23 的支持。源文件必须列出扩展名，并且始终遵循设置的 LANGUAGE 规则。还做了相当多的清理工作（为了使
工程部署的阻碍最小化，最好使用版本 `...3.20` 对源码进行测试），继续改进预设。

- 首次发布于 [2021年3月23日](https://blog.kitware.com/cmake-3-20-0-available-for-download/)
- 支持 C++23
- 新增 CUDAARCHS 环境变量，用于设置 CUDA 架构
- 支持新的 `IntelLLVM` 编译器（OneAPI 2021.1）和 `NVHPC`的 NVIDIA HPC SDK
- 一些扩展生成器表达式支持自定义命令/目标，可在安装时重命名
- 新增的 `cmake_path` 命令可用于路径
- `try_run` 新增了 `WORKING_DIRECTORY` 选项
- `file(GENERATE` 添加了很多特性
- 一些功能或特性的移除，如 `cmake-server`, `WriteCompilerDetectionHeader`（若策略设置为3.20+），以及一些可用新方法替代的东西。
- 源文件必须包含扩展名

## [CMake 3.19][]：预设

可以以 JSON 的方式添加预设，用户将获得预设的默认值。`find_package` 支持版本范围，特殊的查找模块，比如：FindPython，有对版本范围的自定义支持。添加了许多新的权限控制，进一步的普及生成器表达式。

- 首次发布于 [2020年11月18日](https://blog.kitware.com/cmake-3-19-0-available-for-download/)
- [CMake预设文件](https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html) —— 可以为每个生成器的项目设置默认值，或者用户可以进行预设。即使当前项目没有使用 `CMakePresets.json` ，也可将`CMakeUserPresets.json` 添加到 `.gitignore` 中。
- XCode 12+ 中引入了新的构建系统
- 支持 MSVC 对 Android 的构建
- 新增 `cmake -E create_hardlink`
- `add_test` 正确地支持测试名称中的空格
- 可将 `cmake_language` 中标记为 `DEFER` 的目录放在最后进行处理
- 大量新 `file` 选项，如临时下载和 `ARCHIVE_CREATE` 的 `COMPRESSION_LEVEL` 
- `find_package` 支持版本范围
- `DIRECTORY` 可以在属性命令中包含二进制目录
- `string` 新增 `JSON` 模式
- 新 `OPTIMIZE_DEPENDENCIES` 属性和 `CMAKE_*` 变量可智能地删除静态库和对象库的依赖项。
- PCH 支持 `PCH_INSTANTIATE_TEMPLATES` 属性和 `CMAKE_*` 变量。
- 检查模块支持 `CUDA` 和 `ISPC` 语言
- FindPython：新增 `Python*_LINK_OPTIONS`
- ctest 的 `compute-sanitizer` 支持 CUDA 的 memcheck

## [CMake 3.18][]：CUDA与Clang & CMake宏特性

CUDA 现在支持 Clang （不可分离编译）。新增了 CUDA_ARCHITECTURES 属性，可以更好地支持针对 CUDA 硬件。cmake_language 命令支持从字符串中使用 cmake 命令和表达式。还有许多其他元特性的变化，可以使新功能可用：通过变量调用函数，解析字符串，并使用字符串配置文件。还有许多其他漂亮的小功能添加和功能修复，下面是其中的一些。

- 首次发布于 [2020年7月15日](https://blog.kitware.com/cmake-3-18-0-available-for-download/)
- `cmake` 命令可使用 `cat` 合并多个文件
- 新增 `cmake` 命令的分析模式
- `cmake_language` 新增 `CALL` 和 `EVAL` 选项
- 若需多次导出，可使用 `export` 的 `APPEND` 选项（CMake 3.18+）
- 可以使用 `file()` 进行打包
- 若需要替换文件中的字符串，`file(CONFIGURE` 是比 `configure_file` 更好的方式
- 其他 `find_*` 命令新增了 `find_package` 的 `REQUIRED` 标志
- 为 `list(SORT` 新增了 `NATURAL` 比较模式
- 新增处理 DIRECTORY 作用域属性的多个选项
- 新增 `CUDA_ARCHITECTURES`
- 新增 `LINK_LANGUAGE` 生成器表达式（包括 `DEVICE`/`HOST` 版本）
- 源目录可以成为 `FetchContent` 的子目录

## [CMake 3.17][]：原生支持CUDA

添加了 FindCUDAToolkit，允许在不启用 CUDA 语言的情况下，查找和使用 CUDA 工具包！CUDA 现在更具可配置性，例如：链接到动态库。其他功能做了很多优化，比如：FindPython。并且，可以一次性遍历多个列表。

- 首次发布于 [2020年3月20日](https://blog.kitware.com/cmake-3-17-0-available-for-download/)
- `CUDA_RUNTIME_LIBRARY` 终于可以设置为 Shared！
- 新增 FindCUDAToolkit
- `cmake -E rm` 替换旧的删除命令
- 添加 CUDA 元特性，如`cuda_std_03`等。
- `--debug-find` 可跟踪包的搜索
- ExternalProject 可以禁用递归签出
- FindPython 更好地与 Conda 集成
- DEPRECATION 可以应用于目标
- 新增 rm 命令
- 几个新的环境变量
- foreach 新增 `ZIP_LISTS` 选项（一次性遍历多个列表）

## [CMake 3.16][]：统一构建

添加了统一构建模式，允许源文件合并成单独的构建文件。增加了对预编译头文件的支持（可能是为 C++20 的模块做准备），完成了对许多小功能的修复，特别是对较新的特性，如 FindPython、FindDoxygen 等。

- 首次发布于 [2019年11月26日](https://blog.kitware.com/cmake-3-16-0-available-for-download/)
- 新增对 Objective C 和 Objective C++ 语言的支持
- 使用 `target_precompile_headers` 支持预编译头文件
- 支持使用 “Unity” 或 “Jumbo” 构建时(合并源文件)使用 [`CMAKE_UNITY_BUILD`](https://cmake.org/cmake/help/latest/variable/CMAKE_UNITY_BUILD.html) 
- CTest：展开列表，可跳过基于正则表达式的方式
- 控制 RPath 的几个新特性。
- 生成器表达式可以在更多地方使用，比如构建和安装路径
- 可以通过新变量显式地控制查找位置

## [CMake 3.15][]：升级CLI

这个版本有许多较小改进，包括对CMake命令行的改进，比如：通过环境变量控制默认生成器（现在很容易将默认生成器改为 Ninja）。`--build` 模式支持多个目标，添加了 `--install` 模式。CMake支持多级日志记录。可以使用一些方便的工具来测试生成器表达式。FindPython 模块持续改进，FindBoost 与 Boost 1.70 的新 CONFIG 模块有了更多的内联。`export(PACKAGE)` 发生了巨大变化，不再将默认目录设置为 `$HOME/.cmake` (若 cmake 最小版本为 3.15+)，若用户若想使用它，需要额外的设置步骤。

- 首次发布于 [2019年7月17日](https://blog.kitware.com/cmake-3-15-0-available-for-download/)
- 新增控制默认生成器的环境变量 [`CMAKE_GENERATOR`](https://cmake.org/cmake/help/latest/envvar/CMAKE_GENERATOR.html)
- 命令行可构建多个目标，`cmake . --build --target a b`
- `--target` 可缩写为 `-t`
- 项目安装支持命令行选项 `cmake . --install`，该过程不使用构建系统
- 支持日志级别参数 `--loglevel`，为 `message` 指令添加 `NOTICE`，`VERBOSE`，`DEBUG `和  `TRACE `选项
- [`list`](https://cmake.org/cmake/help/latest/command/list.html) 指令新增了 `PREPEND`、`POP_FRONT `和 `POP_BACK` 选项
- [`execute_process`](https://cmake.org/cmake/help/latest/command/execute_process.html) 指令新增了 `COMMAND_ECHO`  选项([`CMAKE_EXECUTE_PROCESS_COMMAND_ECHO`](https://cmake.org/cmake/help/latest/variable/CMAKE_EXECUTE_PROCESS_COMMAND_ECHO.html)) 可以在运行命令之前自动显示具体命令
- Ninja 的几个改进，包括对 SWIFT 语言的支持
- 改进编译器和列表的生成器表达式

## [CMake 3.14][]：文件工具 (AKA [CMake π](https://blog.kitware.com/kitware-gets-mathematical-with-cmake-π-on-pi-day/))

进行了很多小清理，包括几个用于文件的工具。生成器表达式可以在更多的地方使用，使用 list 要优于使用空变量。很多的 find 包可以产生目标。Visual Studio 16 2019 生成器与旧版本略有不同。不支持 Windows XP 和Vista。

- 首次发布于 [2019年3月14日](https://blog.kitware.com/cmake-3-14-0-available-for-download/)
- `--build` 命令添加了 `-v/--verbose` 选项。若构建工具支持，可以使用冗余构建
- FILE指令新增了 `CREATE_LINK`，`READ_SYMLINK` 和 `SIZE` 选项
- [`get_filename_component`](https://cmake.org/cmake/help/latest/command/get_filename_component.html) 新增了 `LAST_EXT`  和 `NAME_WLE` 用于获取文件*最后的*扩展名，比如可以从文件名  `version.1.2.zip` ，获取后缀名 `.zip` （非常方便!）
- 可以在 [`if`](https://cmake.org/cmake/help/latest/command/if.html) 语句中使用 `DEFINED CACHE{VAR}`，查看是否在 CACHE 中定义了变量。
- 新增 `BUILD_RPATH_USE_ORIGIN`，以改进对构建目录中 RPath 的处理。
- CMake 服务器模式使用一个文件 API 所取代。从长远来看，这会影响 IDE。

## [CMake 3.13][]：连接控制

可以在Windows创建符号链接了！新增了许多新函数，响应了 CMake 的主流请求，如 `add_link_options`, `target_link_directories` 和 `target_link_options`。可以在源目录之外对目标进行更多的修改，可以更好的实现文件分离。`target_sources` *终于*可以正确地处理相对路径（策略76）了。

- 首次发布于 [2018年11月20日](https://blog.kitware.com/cmake-3-13-0-available-for-download/)
- 新增 `ctest --progress` 选项，输出实时测试进度
- 新增 `target_link_options` 和 `add_link_options`
- 新增 `target_link_directories`
- 创建符号链接 `-E create_symlink`，只支持 Windows
- Windows 支持 IPO
- 可对源目录和构建目录使用 `-S` 和 `-B`
- 可对当前目标外的目录使用 `target_link_libraries` 和 `install`
- 新增 `STATIC_LIBRARY_OPTIONS` 属性
- `target_sources` 现在相对于当前源目录（CMP0076）
- 若使用 Xcode，可以实验性地设置 schema 字段

## [CMake 3.12][]：版本范围和CONFIGURE_DEPENDS

非常牛的版本，包含了许多长期要求添加的小功能。其中一个是新增了版本范围，现在可以更容易地设置最低和最高的 CMake 版本了。也可以在一组使用 `GLOB` 获取的文件上设置 `CONFIGURE_DEPENDS`，构建系统将检查这些文件，并在需要时重新运行！还可以对 `find_package` 的搜索路径使用通用的 `PackageName_ROOT`  。对 string 和 list 大量的功能添加、模块更新、全新的 Python 查找模块(2 和 3 版本都有)等等。

- 首次发布于[2018年7月17日](https://blog.kitware.com/cmake-3-12-0-available-for-download/)
- 支持 `cmake_minimum_required` 的范围表示（向后兼容）
- 使用命令行 `--build` 构建时，支持 `-j,--parallel` 进行并行构建（传递给构建工具）
- 支持编译选项中的 `SHELL:` 字符串（不删除）
- 新增 `FindPython` 模块
- 新增 `string(JOIN`，`list(JOIN` 和 `list(TRANSFORM`
- 新增 `file(TOUCH`  和 `file(GLOB CONFIGURE_DEPENDS`
- 支持 C++20
- CUDA 作为语言的改进：支持 CUDA 7 和 7.5
- 支持 macOS 的 OpenMP (仅限命令行)
- 新增了几个新属性和属性初始化器
- CPack 可读取 `CMAKE_PROJECT_VERSION` 变量

## [CMake 3.11][]：更快 & IMPORTED INTERFACE

这个版本运行起来 [应该会][fastercmake] 快很多，还可以直接将 INTERFACE 目标添加到 IMPORTED 库(内部的 `Find*.cmake`  脚本会更加清晰)。

- 首次发布于 [2018年3月28日](https://blog.kitware.com/cmake-3-11-0-available-for-download/)
- Fortran 支持编译器启动器
- Xcode 和 Visual Studio 支持 `COMPILE_LANGUAGE` 的生成器表达式
- 可以直接将 INTERFACE 目标添加到 IMPORTED INTERFACE 库中(Wow!)
- 对源文件属性进行了扩展
- `FetchContent` 模块现在允许在配置时下载 (Wow)

## [CMake 3.10][]：CppCheck

CMake 现在使用 C++11 编译器构建，许多改进有助于编写可读性更好的代码。

- 首次发布于[2017年11月20日](https://blog.kitware.com/cmake-3-10-0-available-for-download/)
- 支持 Fortran 编译器 flang 
- 将编译器启动器添加到 CUDA
- `configure_file` 支持 `#cmakedefines` 
- 新增 `include_guard()`，确保CMake源文件只包含一次
- 新增 `string(PREPEND`
- 新增 `*_CPPCHECK` 属性
- 目录添加了 `LABELS` 属性
- 极大地扩展了 FindMPI 模块
- 优化了 FindOpenMP 模块
- `GoogleTest` 可动态发现测试用例
- `cmake_host_system_information` 可获取更多信息。

## [CMake 3.9][]：IPO

这个版本对 CUDA 支持进行了大量修复，包括对 `PTX` 和 MSVC 生成器的支持。过程间优化(IPO)已正确支持了。

甚至有更多模块提供导入的目标，包括 MPI。

- 首次发布于[2017年7月18日](https://blog.kitware.com/cmake-3-9-0-available-for-download/)
- CUDA 支持 Windows
- 优化部分情况下对对象库的支持
- `project` 新增 `DESCRIPTION` 关键字
- `separate_arguments` 新增 `NATIVE_COMMAND` 模式
- `INTERPROCEDURAL_OPTIMIZATION` 强制执行(以及添加 `CMAKE_*` 初始化器，新增 CheckIPOSupported，支持 Clang 和 GCC )
- 新增了`GoogleTest`模块
- 对`FindDoxygen`进行了大幅度改进

## [CMake 3.8][]：C# & CUDA

CUDA 作为一种语言加入了 CMake，使用 `cxx_std_11` 作为编译器元特性。若使用 CMake 3.8+，新的生成器表达式真的很好用!

- 首次发布于[2017年4月10日](https://blog.kitware.com/cmake-3-8-0-available-for-download/)
- 原生支持 C# 语言
- 原生支持 CUDA 语言
- 新增元特性 `cxx_std_11`(以及14和17)
- 优化 `try_compile` 对语言的支持
- 新增 `BUILD_RPATH` 属性
- `COMPILE_FLAGS` 支持生成器表达式
- 新增 `*_CPPLINT` 
- 新增 `$<IF:cond,true-value,false-value>` (wow!)
- 新增 `source_group(TREE` (终于可以在 IDE 中显示项目的文件夹结构了!)

## [CMake 3.7][]：Android & CMake 的服务器模式

可以使用交叉编译，构建在 Android 平台运行的程序。if 的新选项可使代码可读性更好。新增的服务器模式是为了提高与 IDE 的集成(但 CMake 3.14+ 使用另一种方式取而代之)。优化了对 VIM 编辑器的支持。

- 首次发布于 [November 11, 2016](https://blog.kitware.com/cmake-3-7-0-available-for-download/)
- `cmake_parse_arguments` 新增了 `PARSE_ARGV` 模式
- 改进了在 32 位工程在 64 位环境中的构建
- if 增加了很多好用的比较选项，比如 `VERSION_GREATER_EQUAL` (真的需要这么久吗?)
- 新增 `LINK_WHAT_YOU_USE`
- 大量与文件和目录相关的自定义属性
- 新增 CMake 服务器模式
- 新增 `--trace-source="filename"`，用于监控某些文件

## [CMake 3.6][]：Clang-Tidy

这个版本增加了 Clang-Tidy 支持，添加了更多的工具和对原有功能的改进。 取消了在 Unix 系统上搜索 `$PATH` 的问题，取而代之的是使用 `$CMAKE_PREFIX_PATH`。

- 首次发布于 [2016年7月7日](https://blog.kitware.com/cmake-3-6-0-available-for-download/)
- 为工程安装时添加 `EXCLUDE_FROM_ALL`
- 新增 `list(FILTER`
- 工具链添加了 `CMAKE_*_STANDARD_INCLUDE_DIRECTORIES`和`CMAKE_*_STANDARD_LIBRARIES`
- 改进了 Try-compile 功能
- 新增 `*_CLANG_TIDY` 属性
- 外部项目可以是浅克隆，以及其他改进

## [CMake 3.5][]：ARM

这个版本将 CMake 扩展到更多的平台，并且可以使用命令行来控制警告信息。

- 首次发布于 [2016年3月8日](https://blog.kitware.com/cmake-3-5-0-available-for-download/)
- 多个输入文件可以对应多个 `cmake -E` 命令。
- 内置 `cmake_parse_arguments` 解析指令
- Boost、GTest 等库支持导入目标
- 支持 ARMCC，优化对 iOS 的支持
- XCode 反斜杠问题修复

## [CMake 3.4][]：Swift & CCache

这个版本增加了许多有用的工具，对 Swift 语言的支持，以及常用功能的改进。也开始支持编译器启动器，比如  CCache。

- 首次发布于 [2015年11月12日](https://blog.kitware.com/cmake-3-4-0-released/)
- 支持 `Swift` 语言
- `get_filename_component` 添加`BASE_DIR` 选项
- 新增 `if(TEST ...)` 
- 新增 `string(APPEND ...)` 
- 为 make 和 ninja 添加了新的内置变量 `CMAKE_*_COMPILER_LAUNCHER`
- `TARGET_MESSAGES` 允许 Makefile 在目标完成后打印消息
- 导入目标开始出现在官方的 `Find*.cmake` 文件中

## [CMake 3.3][]：if 中添加 IN_LIST

if中添加了 `IN_LIST` 选项，并且可以使用环境变量 `$PATH` (详见 CMake 3.6) 对库文件进行搜索，添加了 INTERFACE 库的依赖关系，还有其他一些改进。随着支持的语言越来越多， `COMPILE_LANGUAGE` 支持生成器表达式就很有必要了。并且，Makefile 在并行执行时的输出更好看了。

- 首次发布于[2015年7月23日](https://blog.kitware.com/cmake-3-3-0-released/)
- `if` 支持 `IN_LIST` 关键字
- 新增 `*_INCLUDE_WHAT_YOU_USE` 属性
- `COMPILE_LANGUAGE` 支持生成器表达式(只有某些生成器支持)

## [CMake 3.2][]：UTF8

一个小版本，主要是添加了小功能和对之前功能缺陷的修复。还有一些内部变化有，我认为对 Windows 和 UTF8 支持更好这个很重要。

- 首次发布于 [2015年3月11日](https://blog.kitware.com/cmake-3-2-1-released/)
- 可以在循环中使用 `continue()`
- 新增文件和目录锁

## [CMake 3.1][]：支持 C++11 和编译特性

支持 C++11 的第一个版本，并针对 CMake 3.0 新特性进行了修复。如若需要使用旧版 CMake，该版本推荐作为最低。

- 首次发布于 [2014年12月17日](https://blog.kitware.com/cmake-3-1-0-released/)
- 支持 C++11
- 支持编译特性
- 源文件可以通过 `target_sources` 在创建目标之后添加
- 优化了生成器表达式和 INTERFACE 目标

## [CMake 3.0][]：接口库

这个版本添加了大量内容，主要是为了填充目标接口。一些需要的功能遗弃了，并在 CMake 3.1 中重新实现。

- 首次发布于 [2014年6月10日](https://blog.kitware.com/cmake-3-0-0-available-for-download/)
- 更新了文档
- 添加了 INTERFACE 库类型
- 支持项目版本关键字 VERSION
- 导出构建树更容易
- 括号参数和支持注释(未广泛使用)
- 以及其他很多改进

[releases]: https://cmake.org/cmake/help/latest/release/index.html
[cmake 3.0]: https://cmake.org/cmake/help/latest/release/3.0.html
[cmake 3.1]: https://cmake.org/cmake/help/latest/release/3.1.html
[cmake 3.2]: https://cmake.org/cmake/help/latest/release/3.2.html
[cmake 3.3]: https://cmake.org/cmake/help/latest/release/3.3.html
[cmake 3.4]: https://cmake.org/cmake/help/latest/release/3.4.html
[cmake 3.5]: https://cmake.org/cmake/help/latest/release/3.5.html
[cmake 3.6]: https://cmake.org/cmake/help/latest/release/3.6.html
[cmake 3.7]: https://cmake.org/cmake/help/latest/release/3.7.html
[cmake 3.8]: https://cmake.org/cmake/help/latest/release/3.8.html
[cmake 3.9]: https://cmake.org/cmake/help/latest/release/3.9.html
[cmake 3.10]: https://cmake.org/cmake/help/latest/release/3.10.html
[cmake 3.11]: https://cmake.org/cmake/help/latest/release/3.11.html
[cmake 3.12]: https://cmake.org/cmake/help/latest/release/3.12.html
[cmake 3.13]: https://cmake.org/cmake/help/latest/release/3.13.html
[cmake 3.14]: https://cmake.org/cmake/help/latest/release/3.14.html
[cmake 3.15]: https://cmake.org/cmake/help/latest/release/3.15.html
[cmake 3.16]: https://cmake.org/cmake/help/latest/release/3.16.html
[cmake 3.17]: https://cmake.org/cmake/help/latest/release/3.17.html
[cmake 3.18]: https://cmake.org/cmake/help/latest/release/3.18.html
[cmake 3.19]: https://cmake.org/cmake/help/latest/release/3.19.html
[cmake 3.20]: https://cmake.org/cmake/help/latest/release/3.20.html
[cmake 3.21]: https://cmake.org/cmake/help/latest/release/3.21.html
[cmake 3.22]: https://cmake.org/cmake/help/latest/release/3.22.html
[cmake 3.23]: https://cmake.org/cmake/help/latest/release/3.23.html
[cmake 3.24]: https://cmake.org/cmake/help/latest/release/3.24.html
[cmake 3.25]: https://cmake.org/cmake/help/latest/release/3.25.html
[cmake 3.26]: https://cmake.org/cmake/help/latest/release/3.26.html
[cmake 3.27]: https://cmake.org/cmake/help/latest/release/3.27.html
[cmake 3.28]: https://cmake.org/cmake/help/latest/release/3.28.html
[cmake 3.29]: https://cmake.org/cmake/help/latest/release/3.29.html
[cmake 3.30]: https://cmake.org/cmake/help/latest/release/3.30.html
[cmake 3.31]: https://cmake.org/cmake/help/latest/release/3.31.html
[cmake 4.0]: https://cmake.org/cmake/help/latest/release/4.0.html
[cmake 4.1]: https://cmake.org/cmake/help/latest/release/4.1.html
[cmake 4.2]: https://cmake.org/cmake/help/latest/release/4.2.html
[cmake 4.3]: https://cmake.org/cmake/help/latest/release/4.3.html
[cmake 4.4]: https://cmake.org/cmake/help/latest/release/4.4.html
[cmake master]: https://cmake.org/cmake/help/git-master/release/index.html
[fastercmake]: https://blog.kitware.com/improving-cmakes-runtime-performance/
