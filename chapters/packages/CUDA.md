# CUDA

使用 CUDA 有两种方式：CMake 3.8（Windows为3.9）中引入的新方法，应该比旧的方法更受欢迎 —— 可能会在旧包中使用这种方法，所以本节会提一下。与旧语言不同，CUDA 的支持一直在快速发展，因为构建 CUDA 非常困难，所以建议*使用最新版本*的 CMake！CMake 3.17 和 3.18 有很多直接针对 CUDA 的改进。

对于 CUDA 和现代 CMake 来说，一个很好的参考是 CMake 开发者 Robert Maynard 在 GTC 2017 的 [演讲 ppt](https://web.archive.org/web/20240222053415/https://on-demand.gputechconf.com/gtc/2017/presentation/S7438-robert-maynard-build-systems-combining-cuda-and-machine-learning.pdf)。

## 启用 CUDA 语言

有两种方法可以启用 CUDA（若 CUDA 的支持不可选）：

```cmake
project(MY_PROJECT LANGUAGES CUDA CXX)
```

这里可能需要在将 `CXX` 一并列出。

若 CUDA 的支持可选，可以将其放在条件语句中：

```cmake
enable_language(CUDA)
```

要检查 CUDA 是否可用，可使用 `check_language`：

```cmake
include(CheckLanguage)
check_language(CUDA)
```

可以通过检查 `CMAKE_CUDA_COMPILER`（CMake 3.11 之前没有）来查看 CUDA 开发包是否存在。

可以检查  `CMAKE_CUDA_COMPILER_ID`（对于 nvcc，其值为 `"NVIDIA"`，Clang 将在 CMake 3.18 支持）。可以用 `CMAKE_CUDA_COMPILER_VERSION` 检查 CUDA 版本。

## CUDA 的变量

CMake 中许多名称中带有 `CXX` 的变量都有 `CUDA` 版本。例如，要设置 CUDA 所需的 C++ 标准，

```cmake
if(NOT DEFINED CMAKE_CUDA_STANDARD)
    set(CMAKE_CUDA_STANDARD 11)
    set(CMAKE_CUDA_STANDARD_REQUIRED ON)
endif()
```

若正在查找和设置 CUDA 的标准级别，CMake 3.17 中添加了一组新的编译器特性，比如：`cuda_std_11`。这些版本特性与 `cxx` 的版本特性使用方式相同。

### 添加库/可执行文件

这部分很简单；使用 CUDA 文件 `.cu`，*就像平常添加库一样*。

也可以使用分离编译的方式：

```cmake
set_target_properties(mylib PROPERTIES
                            CUDA_SEPARABLE_COMPILATION ON)
```

也可以直接使用 `CUDA_PTX_COMPILATION` 属性创建一个 PTX（Parallel Thread eXecution）文件。

### 目标架构

构建 CUDA 代码时，应该以架构为目标。若没有明确的架构信息，则会针对受支持的最低架构编译 PTX，nvcc 编译器会提供基本的指令，所以 PTX 还需要在运行时进行编译，这会使 GPU kernel 的加载速度慢得多。

所有 NVIDA 显卡都有一个架构级别，比如：7.2。在处理架构时，有两个选择：

- 代码层：将向正在编译的代码预报一个版本（如：5.0），这将使用 5.0 之前的所有特性，但不会超过 5.0（假设代码/标准库编写良好）。
- 目标架构：必须等于或大于架构版本。这需要有与目标显卡相同的主版本号，并且等于或小于目标显卡。所以使用架构为 7.2 的显卡时，在编译时将代码架构版本设置为 7.0 将是首选。最后，还可以生成 PTX；PTX 将在架构版本大于当前架构的所有显卡上工作，不过需要在运行时再对 PTX 进行编译。

CMake 3.18 中，设置目标架构变得非常容易。若 CMake 的版本范围为 3.18+，可以对目标使用 `CMAKE_CUDA_ARCHITECTURES` 变量和 `CUDA_ARCHITECTURES` 属性。允许直接写值（不带 `.`），比如：架构 5.0，可以就写为 50。这将同时针对真实架构（SASS）和虚拟架构（PTX）生成代码。传入 `'50-real'` 将仅针对 SASS 生成代码，而传入 `'50-virtual'` 则仅针对 PTX 生成代码。若设置为 OFF，将不会传递任何架构信息。

在 CMake 3.23 中，架构取值得到了扩展，支持对用户更友好的 `'all'` 和 `'all-major'`；CMake 3.24 又新增了 `'native'`。

### 使用目标

使用目标与 CXX 类似，但有一个问题。若目标包含编译器选项（或标志），大多数情况下，这些选项将无法正确使用（很难正确的封装在 CUDA 包装宏或函数中）。正确的编译器选项设置应该如下所示：

```cmake
set(opt "$<$<BUILD_INTERFACE:$<COMPILE_LANGUAGE:CXX>>:-fopenmp>$<$<BUILD_INTERFACE:$<COMPILE_LANGUAGE:CUDA>>:-Xcompiler=-fopenmp>")
```

然而，不管是使用传统 CMake 的 `find_package` 方法，还是使用现代 CMake 的目标和继承方法，都不好使。这是我吃了不少苦头总结出来的经验。

目前，有一个合适的解决方案，*只要知道未别名的目标名称*即可。这是一个函数，若使用 CUDA 编译器，可以通过包装编译选项（标志）来修复仅处理 C++ 的目标：

```cmake
function(CUDA_CONVERT_FLAGS EXISTING_TARGET)
    get_property(old_flags TARGET ${EXISTING_TARGET} PROPERTY INTERFACE_COMPILE_OPTIONS)
    if(NOT "${old_flags}" STREQUAL "")
        string(REPLACE ";" "," CUDA_flags "${old_flags}")
        set_property(TARGET ${EXISTING_TARGET} PROPERTY INTERFACE_COMPILE_OPTIONS
            "$<$<BUILD_INTERFACE:$<COMPILE_LANGUAGE:CXX>>:${old_flags}>$<$<BUILD_INTERFACE:$<COMPILE_LANGUAGE:CUDA>>:-Xcompiler=${CUDA_flags}>"
            )
    endif()
endfunction()
```

### 内置变量

即使不启用 CUDA 语言，也可以使用 [`FindCUDAToolkit`](https://cmake.org/cmake/help/latest/module/FindCUDAToolkit.html) 来查找 CUDA 的各种目标和变量。

```cmake
cmake_minimum_required(VERSION 3.17)
project(example LANGUAGES CXX)

find_package(CUDAToolkit REQUIRED)
add_executable(uses_cublas source.cpp)
target_link_libraries(uses_cublas PRIVATE CUDA::cublas)
```

使用 `find_package(CUDAToolkit)` 提供的变量：

- `CUDAToolkit_BIN_DIR`：存放 `nvcc` 可执行文件的目录
- `CUDAToolkit_INCLUDE_DIRS`：包含内置 Thrust 等工具头文件的目录列表
- `CUDAToolkit_LIBRARY_DIR`：存放 CUDA 运行时库的目录

启用 `CUDA` 语言提供的变量：

- `CMAKE_CUDA_COMPILER`：NVCC 的具体路径
- `CMAKE_CUDA_TOOLKIT_INCLUDE_DIRECTORIES`：指示 CUDA 开发包内置 Thrust 等工具的目录

:::{warning}

传统的 FindCUDA 模块已被弃用多年，并最终在 CMake 3.27 中移除（策略 [CMP0146](https://cmake.org/cmake/help/latest/policy/CMP0146.html)）；在任何现代 CMake 版本中，调用 `find_package(CUDA)` 都会直接报错。在 CMake 3.18 之前，以下功能确实仍需要依赖 FindCUDA：

- CUDA 版本检查/选择版本
- 架构检测（注意：3.12 部分修复了这个问题）
- 为 CUDA 库连接非 `.cu` 文件

:::

## FindCUDA [警告：已在 CMake 3.27 中移除] (仅供参考)

下面的做法仅在低于 3.27 版本的 CMake 上有效，因为在此之后该模块已不复存在。若受困于必须支持如此老旧的 CMake，建议至少在 CMake 文件夹中包含来自 CMake 3.9 版本的 FindCUDA（参见 CLIUtils github 组织中的 [git库](https://github.com/CLIUtils/cuda_support)）。需要添加两个特性：`CUDA_LINK_LIBRARIES_KEYWORD` 和` cuda_select_nvcc_arch_flags`，以及较新的架构和 CUDA 版本。

要使用旧版 CUDA 支持方式，可以使用 `find_package`：

```cmake
find_package(CUDA 7.0 REQUIRED)
message(STATUS "Found CUDA ${CUDA_VERSION_STRING} at ${CUDA_TOOLKIT_ROOT_DIR}")
```

可以用 `CUDA_NVCC_FLAGS`（使用列表添加的方式，`list(APPEND)`）控制 CUDA 标志，通过 `CUDA_SEPARABLE_COMPILATION` 控制分离编译。若想确保 CUDA 的正常工作，需要将关键字添加到目标中（CMake 3.9+）：

```cmake
set(CUDA_LINK_LIBRARIES_KEYWORD PUBLIC)
```

若想让用户检查当前硬件的架构标志，可以使用以下方式：

```cmake
cuda_select_nvcc_arch_flags(ARCH_FLAGS) # 可传入可选参数以指定要添加的架构
```
