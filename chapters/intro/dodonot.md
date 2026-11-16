# CMake 行为准则(Do's and Don'ts)

接下来的两个列表很大程度上基于优秀的 gist [Effective Modern CMake]. 那个列表更长且更详细，也非常欢迎你去仔细阅读它。

## CMake 应避免的行为

- **不要使用具有全局作用域的函数**：这包含 `link_directories`、 `include_directories` 等相似的函数。
- **不要添加非必要的 PUBLIC 要求**：你应该避免把一些不必要的东西强加给用户（-Wall）。相比于 **PUBLIC**，更应该把他们声明为 **PRIVATE**。
- **不要在file函数中添加 GLOB 文件**：如果不重新运行 CMake，Make 或者其他的工具将不会知道你是否添加了某个文件。值得注意的是，CMake 3.12 添加了一个 `CONFIGURE_DEPENDS` 标志能够使你更好的完成这件事。
- **不要直接链接到已构建的文件**：如果可以的话，总是显式地将库链接到目标上。
- **当链接库文件时，不要省略 PUBLIC 或 PRIVATE 关键字**：这将会导致后续所有的链接都是缺省的。

## CMake 应遵守的规范

- **把 CMake 程序视作代码**：它是代码。它应该和其他的代码一样，是整洁并且可读的。
- **建立目标的观念**：你的目标应该代表一系列的概念。为任何需要保持一致的东西指定一个 （导入型）INTERFACE 目标，然后每次都链接到该目标。
- **导出你的接口**：你的 CMake 项目应该可以直接构建或者安装。
- **为库书写一个 Config.cmake 文件**：这是库作者为支持客户的体验而应该做的。
- **声明一个 ALIAS 目标以保持使用的一致性**：使用 `add_subdirectory` 和 `find_package` 应该提供相同的目标和命名空间。
- **将常见的功能合并到有详细文档的函数或宏中**：函数往往是更好的选择。
- **使用小写的函数名**： CMake 的函数和宏的名字可以定义为大写或小写，但是一般都使用小写，变量名用大写。
- **使用 `cmake_policy` 和/或 限定版本号范围**： 每次改变版本特性 (policy) 都要有据可依。应该只有不得不使用旧特性时才降低特性 (policy) 版本。

## 在 2026 年选择最低版本

在本地开发时你应该**运行**哪个最低版本的 CMake？对于使用你代码的用户，你又应该**支持**哪个最低版本？既然你正在阅读本书，你应该能够获取到最近几个版本的 CMake 发行版；请直接安装新版本，这会让你的开发工作轻松得多。至于项目所支持的最低版本，有两种选择方式：一种是基于新增的功能特性（这是开发者关心的），另一种是基于常见的系统预装 CMake 版本（这是用户关心的）。

切勿选择比你所支持的最老编译器还要古老的 CMake 最低版本。CMake 的版本始终应当至少与最初支持该最老编译器的 CMake 版本一样新。

### 如何选择最低版本——操作系统支持：

- 3.19：首个支持 Apple Silicon 的版本。
- 3.22：Ubuntu 22.04、Amazon Linux 2023。
- 3.25：Debian 12（以及 Debian 11 backports）。
- 3.26：Rocky Linux 9、AlmaLinux 9（当前小版本更新中已升至 3.31）。
- 3.28：Ubuntu 24.04。
- 3.30：Rocky Linux 10、AlmaLinux 10、CentOS Stream 10（当前更新中已升至 3.31）。
- 3.31：Debian 13（以及 Debian 12 backports）。
- latest（最新版）：pip / conda-forge / Homebrew / Chocolatey 等。

### 如何选择最低版本——功能特性：

- 3.11：`IMPORTED INTERFACE` 设置、构建提速、FetchContent、IDE 中的 `COMPILE_LANGUAGE` 支持
- 3.12：C++20、`cmake --build build -j N`、`SHELL:`、FindPython
- 3.14/3.15：命令行接口（CLI）增强、FindPython 更新
- 3.16：Unity 构建（Unity builds）/ 预编译头（precompiled headers）、CUDA 元特性（meta features）
- 3.17/3.18：更多 CUDA 支持、元编程（metaprogramming）、FindPython 更新
- 3.19：预设（Presets）
- 3.20：C++23、`cmake_path`
- 3.24：包查找器（Package finder）集成机制
- 3.25：用于作用域控制的 `block()`（Blocks for scoping）
- 3.28：C++20 模块（modules）
- 3.29：测试前自动构建目标（Build before test target）
- 3.30：完整的 C++26 支持

[effective modern cmake]: https://gist.github.com/mbinna/c61dbb39bca0e4fb7d1f73b0d66a4fd1
