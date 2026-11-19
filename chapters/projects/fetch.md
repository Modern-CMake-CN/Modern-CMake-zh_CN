# 获取软件包（FetchContent） (CMake 3.14+)

有时你想要在配置的时候下载数据或者是包，而不是在编译的时候下载。这种方法已经被第三方包重复“发明”了好几次。最终，这种方法在 CMake 中以 [FetchContent] 模块的形式出现。

[FetchContent] 模块有出色的文档，我在此不会赘述。我会阐述这样几个步骤：

- 使用 `FetchContent_Declare(MyName)` 来从 URL、Git 仓库等地方获取数据或者是软件包。
- 使用 `FetchContent_MakeAvailable(MyName)` 使其可用；如果它是一个带有 `CMakeLists.txt` 的软件包，这会将它添加到你的构建中（就像 `add_subdirectory` 所做的那样）。

比如，下载 Catch2 ：

```cmake
FetchContent_Declare(
  catch
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG        v3.15.0
)

FetchContent_MakeAvailable(catch)
```

如果你正在维护较旧的代码，你可能还会遇到早期那种手动检查 `MyName_POPULATED` 并调用 `FetchContent_Populate(MyName)` 的写法；该用法已在 CMake 3.30 中被弃用（见 [CMP0169](https://cmake.org/cmake/help/latest/policy/CMP0169.html)），并且在当前版本的 CMake 中会产生警告，因此直接使用 `FetchContent_MakeAvailable` 即可。

可以在这里[查看](https://gitlab.com/CLIUtils/modern-cmake/-/tree/master/examples/fetch)例子。

[fetchcontent]: https://cmake.org/cmake/help/latest/module/FetchContent.html
