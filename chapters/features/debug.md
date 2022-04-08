# 调试代码

你可能需要对你的 CMake 构建过程或你的 C++ 代码进行调试。本文将介绍这两者。

## 调试 CMake

首先，让我们来盘点一下调试 CMakeLists 和其他 CMake 文件的方法。

### 打印变量

通常我们使用的打印语句如下：

```cmake
message(STATUS "MY_VARIABLE=${MY_VARIABLE}")
```

然而，通过一个内置的模组 `CMakePrintHelpoers` 可以更方便的打印变量：

```cmake
include(CMakePrintHelpers)
cmake_print_variables(MY_VARIABLE)
```

如何你只是想要打印一个变量，那么上述方法已经很好用了！如何你想要打印一些关于某些目标 (或者是其他拥有变量的项目，比如 `SOURCES`、`DIRECTORIES`、`TESTS` , 或 `CACHE_ENTRIES` - 全局变量好像因为某些原因缺失了) 的变量，与其一个一个打印它们，你可以简单的列举并打印它们：

```cmake
cmake_print_properties(
    TARGETS my_target
    PROPERTIES POSITION_INDEPENDENT_CODE
)
```


### 跟踪运行

你可能想知道构建项目的时候你的 CMake 文件究竟发生了什么，以及这些都是如何发生的？用 `--trace-source="filename"` 就很不错，它会打印出你指定的文件现在运行到哪一行，让你可以知道当前具体在发生什么。另外还有一些类似的选项，但这些命令通常给出一大堆输出，让你找不着头脑。

例子：

```bash
cmake -S . -B build --trace-source=CMakeLists.txt
```

如果你添加了 `--trace-expand` 选项，变量会直接展开成它们的值。


## 以 debug 模式构建

对于单一构建模式的生成器 (single-configuration generators)，你可以使用参数 `-DCMAKE_BUILD_TYPE=Debug` 来构建项目，以获得调试标志 (debugging flags)。对于支持多个构建模式的生成器 (multi-configuration generators)，像是多数IDE，你可以在 IDE 里打开调试模式。这种模式有不同的标志（变量以 `_DEBUG` 结尾，而不是 `_RELEASE` 结尾），以及生成器表达式的值 `CONFIG:Debug` 或 `CONFIG:Release`。

如果你使用了 debug 模式构建，你就可以在上面运行调试器了，比如gdb或lldb。
