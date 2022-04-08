# CMake 中一些有用的模组

在 CMake 的 «cmake:modules» 集合了很多有用的模组，但是有一些模块相比于其他的更有用。以下是一些比较出彩的：

## «module:CMakeDependentOption»

这增加了命令 `cmake_dependent_option` ，它根据另外一组变量是否为真来（决定是否）开启一个选项。下面是一个例子：

```cmake
include(CMakeDependentOption)
cmake_dependent_option(BUILD_TESTS "Build your tests" ON "VAL1;VAL2" OFF)
```

如上代码是下面的一个缩写：

```cmake
if(VAL1 AND VAL2)
    set(BUILD_TESTS_DEFAULT ON)
else()
    set(BUILD_TESTS_DEFAULT OFF)
endif()

option(BUILD_TESTS "Build your tests" ${BUILD_TESTS_DEFAULT})

if(NOT BUILD_TESTS_DEFAULT)
    mark_as_advanced(BUILD_TESTS)
endif()
```

需要注意的是，如果你使用了 `include(CTest)` ，用 `BUILD_TESTING` 来检测是否启用是更好的方式，因为它就是为此功能而生的。这里只是一个 `CMakeDependentOption` 的例子。

## «module:CMakePrintHelpers»

这个模块包含了几个方便的输出函数。`cmake_print_properties` 可以让你轻松的打印属性，而 `cmake_print_variables` 将打印出你给它任意变量的名称和值。


## «module:CheckCXXCompilerFlag»

这个模块允许你检查编译器是否支持某个标志，例如：

```cmake
include(CheckCXXCompilerFlag)
check_cxx_compiler_flag(-someflag OUTPUT_VARIABLE)
```

需要注意的是 `OUTPUT_VARIABLE` 也会出现在打印的配置输出中，所以请选个不错的变量名。

这只是许多类似模块中的一个，例如 `CheckIncludeFileCXX`、`CheckStructHasMember`、`TestBigEndian` 以及`CheckTypeSize`，它们允许你检查系统的信息（并且你可以在代码中使用这些信息）。

## «command:`try_compile`»/«command:`try_run`»

准确的说，这不是一个模块，但是它们对上述列出的许多模块至关重要。通过它你可以在配置时尝试编译（也可能是运行）一部分代码。这可以让你在配置时获取关于系统能力的信息。基本的语法如下：

```cmake
try_compile(
  RESULT_VAR
    bindir
  SOURCES
    source.cpp
)
```

这里有很多可以添加的选项，例如 `COMPILE_DEFINITIONS`。在 CMake 3.8+ 中， 这将默认遵循 CMake 中 C/C++/CUDA 的标准设置。如果你使用的是 `try_run` 而不是 `try_compile`，它将运行生成的程序并将运行结果存储在 `RUN_OUTPUT_VARIABLE` 中。

## «module:FeatureSummary»

这是一个十分有用但是也有些奇怪的模块。它能够让你打印出找到的所有软件包以及你明确设定的所有选项。它和  «command:`find_package`» 有一些联系。像其他模块一样，你首先要包括模块：

```cmake
include(FeatureSummary)
```

然后，对于任何你已经运行或者将要运行的  «command:`find_package`» ，你可以这样拓展它的默认信息：

```cmake
set_package_properties(OpenMP PROPERTIES
    URL "http://www.openmp.org"
    DESCRIPTION "Parallel compiler directives"
    PURPOSE "This is what it does in my package")
```

你也可以将包的 `TYPE` 设置为 `RUNTIME`、`OPTIONAL`、`RECOMMENDED` 或者 `REQUIRED`。但是你不能降低包的类型，如果你已经通过 «command:`find_package`» 添加了一个 `REQUIRED` 类型的包，你将会看到你不能改变它的 `TYPE`：

并且，你可以添加任何选项让其成为 `feature summary` 的一部分。如果你添加的选项名与包的名字一样，他们之间会互相产生影响：

```cmake
add_feature_info(WITH_OPENMP OpenMP_CXX_FOUND "OpenMP (Thread safe FCNs only)")
```

然后，你可以将所有特性 (features) 的集合打印到屏幕或日志文件中：

```cmake
if(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME)
    feature_summary(WHAT ENABLED_FEATURES DISABLED_FEATURES PACKAGES_FOUND)
    feature_summary(FILENAME ${CMAKE_CURRENT_BINARY_DIR}/features.log WHAT ALL)
endif()
```

你可以建立一个 `WHAT` 目标来集合任何你想查看的特性 (features)，或者直接使用 `ALL` 目标也行。 
