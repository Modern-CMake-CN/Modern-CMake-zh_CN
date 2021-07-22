# 获取软件包（FetchContent） (CMake 3.11+)

有时你想要在配置的时候下载数据或者是包，而不是在编译的时候下载。这种方法已经被第三方包重复“发明”了好几次。最终，这种方法在 CMake 3.11 中以 [FetchContent] 模块的形式出现。

[FetchContent] 模块有出色的文档，我在此不会赘述。我会阐述这样几个步骤：

* 使用 `FetchContent_Declare(MyName)` 来从 URL、Git 仓库等地方获取数据或者是软件包。
* 使用 `FetchContent_GetProperties(MyName)` 来获取 `MyName_*` 等变量的值，这里的 `MyName` 是上一步获取的软件包的名字。
* 检查 `MyName_POPULATED` 是否已经导出，否则使用 `FetchContent_Populate(MyName)` 来导出变量（如果这是一个软件包，则使用 `add_subdirectory("${MyName_SOURCE_DIR}" "${MyName_BINARY_DIR}")` ）

比如，下载 Catch2 ：

```cmake
FetchContent_Declare(
  catch
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG        v2.13.6
)

# CMake 3.14+
FetchContent_MakeAvailable(catch)
```

如果你不能使用 CMake 3.14+ ，可以使用适用于低版本的方式来加载：

```cmake
# CMake 3.11+
FetchContent_GetProperties(catch)
if(NOT catch_POPULATED)
  FetchContent_Populate(catch)
  add_subdirectory(${catch_SOURCE_DIR} ${catch_BINARY_DIR})
endif()
```

当然，你可以将这些语句封装到一个宏内：

```cmake
if(${CMAKE_VERSION} VERSION_LESS 3.14)
    macro(FetchContent_MakeAvailable NAME)
        FetchContent_GetProperties(${NAME})
        if(NOT ${NAME}_POPULATED)
    	    FetchContent_Populate(${NAME})
    	    add_subdirectory(${${NAME}_SOURCE_DIR} ${${NAME}_BINARY_DIR})
        endif()
    endmacro()
endif()
```

这样，你就可以在 CMake 3.11+ 里使用 CMake 3.14+ 的语法了。

可以在这里[查看](https://gitlab.com/CLIUtils/modern-cmake/-/tree/master/examples/fetch)例子。

[FetchContent]: https://cmake.org/cmake/help/latest/module/FetchContent.html
