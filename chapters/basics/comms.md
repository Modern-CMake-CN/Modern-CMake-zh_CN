# 与你的代码交互

## 通过 CMake 配置文件

CMake 允许你在代码中使用 `configure_file` 来访问 CMake 变量。该命令将一个文件（ 一般以 `.in` 结尾 ）的内容复制到另一个文件中，并替换其中它找到的所有 CMake 变量。如果你想要在你的输入文件中避免替换掉使用  `${}` 包含的内容，你可以使用 `@ONLY` 关键字。还有一个关键字 `COPY_ONLY` 可以用来作为 `file(COPY` 的替代字。

{% hint style='info' %}

译者注：这里原文讲的有些太略，后续补充内容。

{% endhint %}

这个功能在 CMake 中使用的相当频繁，例如在下面的 `Version.h.in`  中：

#### Version.h.in

```cpp
#pragma once

#define MY_VERSION_MAJOR @PROJECT_VERSION_MAJOR@
#define MY_VERSION_MINOR @PROJECT_VERSION_MINOR@
#define MY_VERSION_PATCH @PROJECT_VERSION_PATCH@
#define MY_VERSION_TWEAK @PROJECT_VERSION_TWEAK@
#define MY_VERSION "@PROJECT_VERSION@"
```

#### CMake lines:
```cmake
configure_file (
    "${PROJECT_SOURCE_DIR}/include/My/Version.h.in"
    "${PROJECT_BINARY_DIR}/include/My/Version.h"
)
```

在构建你的项目时，你也应该包括二进制头文件路径。如果你想要在头文件中包含一些 `true/false` 类型的变量，CMake 对 C 语言有特有的 `#cmakedefine` 和 `#cmakedefine01` 替换符来完成上述需求。


你也可以使用（ 并且是常用 ）这个来生成 `.cmake` 文件，例如配置文件（ 见 [installing](https://cliutils.gitlab.io/modern-cmake/chapters/install/installing.html) ）。

## 读入文件

另外一个方向也是行得通的， 你也可以从源文件中读取一些东西（ 例如版本号 ）。例如，你有一个仅包含头文件的库，你想要其在无论有无 CMake 的情况下都可以使用，上述方式将是你处理版本的最优方案。可以像下面这么写：


```cmake
# Assuming the canonical version is listed in a single line
# This would be in several parts if picking up from MAJOR, MINOR, etc.
set(VERSION_REGEX "#define MY_VERSION[ \t]+\"(.+)\"")

# Read in the line containing the version
file(STRINGS "${CMAKE_CURRENT_SOURCE_DIR}/include/My/Version.hpp"
    VERSION_STRING REGEX ${VERSION_REGEX})

# Pick out just the version
string(REGEX REPLACE ${VERSION_REGEX} "\\1" VERSION_STRING "${VERSION_STRING}")

# Automatically getting PROJECT_VERSION_MAJOR, My_VERSION_MAJOR, etc.
project(My LANGUAGES CXX VERSION ${VERSION_STRING})
```

如上所示， `file(STRINGS file_name variable_name REGEX regex)` 选择了与正则表达式相匹配的行，并且使用了相同的正则表达式来匹配出其中版本号的部分。
