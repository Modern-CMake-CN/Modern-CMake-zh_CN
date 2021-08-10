# 在 CMake 中运行其他的程序

## 在配置时运行一条命令

在配置时运行一条命令是相对比较容易的。可以使用 [`execute_process`][execute_process] 来运行一条命令并获得他的结果。一般来说，在 CMkae 中避免使用硬编码路径是一个好的习惯，你也可以使用 `${CMAKE_COMMAND}` , `find_package(Git)` , 或者`find_program` 来获取命令的运行权限。可以使用 `RESULT_VARIABLE` 变量来检查返回值，使用 `OUTPUT_VARIABLE` 来获得命令的输出。 

下面是一个更新所有 git 子模块的例子：

```cmake
find_package(Git QUIET)

if(GIT_FOUND AND EXISTS "${PROJECT_SOURCE_DIR}/.git")
    execute_process(COMMAND ${GIT_EXECUTABLE} submodule update --init --recursive
                    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
                    RESULT_VARIABLE GIT_SUBMOD_RESULT)
    if(NOT GIT_SUBMOD_RESULT EQUAL "0")
        message(FATAL_ERROR "git submodule update --init --recursive failed with ${GIT_SUBMOD_RESULT}, please checkout submodules")
    endif()
endif()
```

## 在构建时运行一条命令

在构建时运行一条命令有点难。主要是目标系统使这变的很难，你希望你的命令在什么时候运行？它是否会产生另一个目标需要的输出？记住这些需求，然后我们来看一个关于调用 Python 脚本生成头文件的例子：

```cmake
find_package(PythonInterp REQUIRED)
add_custom_command(OUTPUT "${CMAKE_CURRENT_BINARY_DIR}/include/Generated.hpp"
    COMMAND "${PYTHON_EXECUTABLE}" "${CMAKE_CURRENT_SOURCE_DIR}/scripts/GenerateHeader.py" --argument
    DEPENDS some_target)

add_custom_target(generate_header ALL
    DEPENDS "${CMAKE_CURRENT_BINARY_DIR}/include/Generated.hpp")

install(FILES ${CMAKE_CURRENT_BINARY_DIR}/include/Generated.hpp DESTINATION include)
```

在这里，当你在 `add_custom_target` 命令中添加 `ALL` 关键字，头文件的生成过程会在 `some_target` 这些依赖目标完成后自动执行。当你把这个目标作为另一个目标的依赖，你也可以不加 `ALL` 关键字，那这样他会在被依赖目标构建时会自动执行。或者，你也可以显示的直接构建 `generate_header` 这个目标。

{% hint style='info' %}

译者注：这里翻译的有一些拗口，后续会改善。

{% endhint %}

## CMake 中包含的常用的工具

在编写跨平台的 CMake 工程时，一个有用的工具是 `cmake -E <mode>`（在 `CMakeLists.txt` 中被写作 `${CMAKE_COMMAND} -E`）。通过指定后面的 `<mode>` 允许 CMake 在不显式调用系统工具的情况下完成一系列事情，例如 `copy(复制)`，`make_directory(创建文件夹)`，和 `remove(移除)` 。**这都是构建时经常使用的命令。** 需要注意的是，一个非常有用的 mode——`create_symlink`，只有在基于 Unix 的系统上可用，但是在 CMake 3.13 后的 Windows 版本中也存在此 `mode`。[点击这里查看对应文档](https://cmake.org/cmake/help/latest/manual/cmake.1.html#command-line-tool-mode)。

[execute_process]: https://cmake.org/cmake/help/latest/command/execute_process.html
