# CUDA

使用 CUDA 有两种方式：CMake 3.8（Windows为3.9）中引入的新方法，应该比旧的、笨拙的方法更受欢迎 —— 因为可能会在旧包中使用这种方法，所以这里只是提一下。与旧语言不同，CUDA 的支持一直在快速发展，构建 CUDA 非常困难，所以建议*使用最新版本*的CMake！CMake 3.17 和 3.18 有很多直接针对 CUDA 的改进。

对于 CUDA 和现代 CMake 来说，一个很好的参考是CMake开发者 Robert Maynard 在 GTC 2017 使用的[演讲ppt](http://on-demand.gputechconf.com/gtc/2017/presentation/S7438-robert-maynard-build-systems-combining-cuda-and-machine-learning.pdf)。


## 启用 CUDA 语言

有两种方法可以启用CUDA。若CUDA不是可选的:

```cmake
project(MY_PROJECT LANGUAGES CUDA CXX)
```

可能需要在这里将 `CXX` 也添上。

若 CUDA 的支持是可选的，可以将其放在条件语句中：

```cmake
enable_language(CUDA)
```

要检查 CUDA 是否可用，可使用checklanguage：

```cmake
include(CheckLanguage)
check_language(CUDA)
```

可以通过检查 `CMAKE_CUDA_COMPILER`（CMake 3.11之前没有）来查看 CUDA 开发包是否存在。

可以检查 `CMAKE_CUDA_COMPILER_ID`这样的变量（对于nvcc，其值为 `"NVIDIA"`，Clang 是在 CMake 3.18 中支持的）。可以用 `CMAKE_CUDA_COMPILER_VERSION` 检查CUDA版本。

## CUDA 的变量

许多名称中带有`CXX`的变量都有`CUDA`版本。例如，要设置CUDA所需的C++标准，

```cmake
if(NOT DEFINED CMAKE_CUDA_STANDARD)
    set(CMAKE_CUDA_STANDARD 11)
    set(CMAKE_CUDA_STANDARD_REQUIRED ON)
endif()
```

若正在寻找CUDA的标准级别， CMake 3.17 中添加了一组新的编译器特性，比如：`cuda_std_11`。这些版本特性与`cxx`版本特性的使用方式相同。

### 添加库/可执行文件

这部分很简单；使用CUDA文件 `.cu`，*就像平常添加库一样*即可。

也可以使用分离编译的方式：

```cmake
set_target_properties(mylib PROPERTIES
                            CUDA_SEPARABLE_COMPILATION ON)
```

也可以直接使用 `CUDA_PTX_COMPILATION` 属性创建一个PTX（Parallel Thread eXecution）文件。

### 目标架构

构建CUDA代码时，应该以架构为目标。若没有也可以编译'ptx'，nvcc编译器会提供了基本的指令，但在运行时编译，这可能会使GPU kernel的加载速度慢得多。

所有Nvida显卡都有一个架构级别，比如：7.2。这时，有两个选择：

- 代码层：将向正在编译的代码报告一个版本（如：5.0），它将使用5.0之前的所有特性，但不会超过5.0（假设代码/标准库编写良好）。
- 目标架构：必须等于或大于架构版本。这需要有与目标显卡相同的主版本号，并且等于或小于目标显卡。所以使用架构为7.2的显卡时，在编译时将代码架构版本设置为7.0将是首选。最后，还可以生成PTX；这将在架构版本大于当前架构的所有显卡上工作，不过会在运行时对PTX进行编译。

CMake 3.18 中，设置目标架构变得非常容易。若 CMake 的版本范围为 3.18+，可以对目标上使用 `CMAKE_CUDA_ARCHITECTURES` 变量和 `CUDA_ARCHITECTURES` 属性。可以直接写值（不带`.`），比如：架构 5.0，可以写为 50。若设置为OFF，将不会传递任何架构信息。

### 使用目标

使用目标与 CXX 类似，但有一个问题。若目标包含编译器选项（或标志），那么大多数情况下，这些选项将无法正确使用（它们很难正确的封装在 CUDA 包装宏或函数中）。正确的编译器选项行应该如下所示:

```cmake
"$<$<BUILD_INTERFACE:$<COMPILE_LANGUAGE:CXX>>:-fopenmp>$<$<BUILD_INTERFACE:$<COMPILE_LANGUAGE:CUDA>>:-Xcompiler=-fopenmp>"
```

然而，不管是使用传统 CMake 的 `find_package` 方法，还是使用现代 CMake 的目标和继承方法，都不管用。这是我吃了不少苦头总结出来的。

目前，有一个合理的解决方案，*只要知道未别名的目标名称*即可。这是一个函数，若使用CUDA编译器，将通过包装编译选项（标志）来修复仅处理 C++ 的目标：

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

* `CMAKE_CUDA_TOOLKIT_INCLUDE_DIRECTORIES`：指示 CUDA 开发包内置的 Thrust 等工具的目录
* `CMAKE_CUDA_COMPILER`：NVCC 的具体路径

即使不启用CUDA语言，也可以使用 [`FindCUDAToolkit`](https://cmake.org/cmake/help/git-stage/module/FindCUDAToolkit.html)  来查找CUDA的各种目标和变量。

> ### 注意，FindCUDA已弃用，但对于低于 3.18 的 CMake，以下函数需要 FindCUDA：
>
> * CUDA 版本检查/选择版本
> * 架构检测（注意：3.12 部分修复了这个问题）
> * 为CUDA库连接非 `.cu` 文件

## FindCUDA [警告：不要使用] (仅供参考)

若想要支持旧版 CMake，建议至少在 CMake 文件夹中包含来自 CMake 3.9 版本的 FindCUDA（参见CLIUtils github组织中的[git库](https://github.com/CLIUtils/cuda_support)）。需要添加两个特性：`CUDA_LINK_LIBRARIES_KEYWORD` 和` cuda_select_nvcc_arch_flags`，以及较新的架构和 CUDA 版本。

要使用旧的CUDA支持方式，可以使用`find_package`：

```cmake
find_package(CUDA 7.0 REQUIRED)
message(STATUS "Found CUDA ${CUDA_VERSION_STRING} at ${CUDA_TOOLKIT_ROOT_DIR}")
```

可以用`CUDA_NVCC_FLAGS` （使用列表添加的方式，`list(APPEND`）控制CUDA标志，可以用`CUDA_SEPARABLE_COMPILATION` 控制分离编译。若想确保 CUDA 正常工作，需要将关键字添加到目标（CMake 3.9+）：

```cmake
set(CUDA_LINK_LIBRARIES_KEYWORD PUBLIC)
```

若想让用户检查当前硬件的架构标志，可以使用以下方式：

```cmake
cuda_select_nvcc_arch_flags(ARCH_FLAGS) # optional argument for arch to add
```
