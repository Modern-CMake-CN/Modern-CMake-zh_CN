# ROOT

[ROOT](https://root.cern/) 是用于高能物理学的 C++ 工具包，里面东西超级多。CMake 确实有很多使用它的方法，不过其中许多/大多数的例子可能是错误的。这里，说一下我推荐的方式。

最重要的是，当前任何版本的 ROOT（撰写本文时为 6.3x 系列）都表现得像一个规范的 CMake 项目：它提供导入目标、为这些目标导出 C++ 标准特性，并会自动加载其 CMake 宏。若确实必须支持非常古老的 ROOT 版本（6.20 之前），请参阅文末的附录。

## 查找 ROOT

ROOT 支持配置文件查找的方式，所以可以这样做：

```{literalinclude} ../../examples/root-simple/CMakeLists.txt
:start-after: [find_package]
:end-before: [find_package]
:language: cmake
```

尝试找到 ROOT 包。若没有设置 ROOT 的路径，可以将 `-DROOT_DIR=$ROOTSYS/cmake` 传递给 CMake，从而找到ROOT。(实际上，应该使用 `source thisroot.sh` 的方式）

## 正确的方式（使用目标）

ROOT 的导入目标携带了所需的包含目录、编译标志与依赖项。链接时，只需选择想要使用的库：

```{literalinclude} ../../examples/root-simple/CMakeLists.txt
:start-after: [add_and_link]
:end-before: [add_and_link]
:language: cmake
```

若想查看默认列表，可以在命令行上运行 `root-config --libs`。对于典型的 ROOT 安装，会显示如下信息：

- `ROOT::Core`
- `ROOT::Gpad`
- `ROOT::Graf3d`
- `ROOT::Graf`
- `ROOT::Hist`
- `ROOT::Imt`
- `ROOT::MathCore`
- `ROOT::Matrix`
- `ROOT::MultiProc`
- `ROOT::Net`
- `ROOT::Physics`
- `ROOT::Postscript`
- `ROOT::RIO`
- `ROOT::ROOTDataFrame`
- `ROOT::ROOTVecOps`
- `ROOT::Rint`
- `ROOT::Thread`
- `ROOT::TreePlayer`
- `ROOT::Tree`

## 旧的全局方式

ROOT 提供了一个配置 ROOT 项目的[工具](https://root.cern/manual/integrate_root_into_my_cmake_project/)，可以使用 `include("${ROOT_USE_FILE}")` 激活它。这将自动创建不美观的目录群和全局变量。这个工具的确可以节省一些配置时间，但若想通过修改这一过程来解决一些棘手的问题，则需要花费大量的时间。若不需要创建库，那么直接使用脚本也无所谓。这里，包含目录和编译连接标志使用的是全局设置，但仍然需要为目标手动链接 `${ROOT_LIBRARIES}`，可能还需要 `ROOT_EXE_LINKER_FLAGS`（例如使用 macOS 操作系统时，必须在链接之前使用 `separate_arguments`，若有多个标志，就会报错）。

就像下面这样：

```{literalinclude} ../../examples/root-usefile/CMakeLists.txt
:start-after: [core]
:end-before: [core]
:language: cmake
```

## 组件

CMake 查找 ROOT 时，允许指定相应的组件。CMake 会将列出的内容添加到 `${ROOT_LIBRARIES}`，因此若想使用相应的组件来构建自己的目标，使用这种方式可以避免多次引用。不过，这并没有解决依赖关系的问题；只使用 `RooFit` 而没有 `RooFitCore` 也是错误的。若链接的是 `ROOT::RooFit`，而不是`${ROOT_LIBRARIES}`，则无需链接`RooFitCore`。

## 生成字典

生成字典是 ROOT 解决 C++ 中缺少反射特性的一种方式。需要 ROOT 了解自定义类的细节，这样 ROOT 就可以保存它，并且可以在 Cling 解释器中显示相应的方法，等等。源代码需要进行如下修改来支持生成字典：

- 类定义应该以 `ClassDef(MyClassName, 1)` 结束
- 类实现中应该有 `ClassImp(MyClassName)`

ROOT 提供了  `rootcling ` 和 `genreflex`（`rootcling` 的遗留接口），这两个二进制文件可生成构建字典所需的源文件，还定义了一个CMake函数 `root_generate_dictionary`，其在构建过程中会使用 `rootling` 。定义该函数的宏文件会自动加载，因此只要运行了 `find_package(ROOT)`，该函数便立即可用。（只有非常古老的 ROOT 版本才需要手动包含宏文件；该文件在 6.20 中已重命名为 `RootMacros.cmake` 并改为自动加载 —— 详见文末附录。）

`rootcling` 使用带有 [特定公式][linkdef-root] 的特殊头文件来确定为哪部分用于生成字典。文件名可以有前缀，但**必须**以 `LinkDef.h` 结尾。编写完成了这个头文件，就可以调用字典中生成的函数了。

### 手动生成字典

有时，可能想让 ROOT 生成字典，然后自己将源文件添加到库目标中。可以用字典名来调用 `root_generate_dictionary` 函数（例如：`G__Example`），任何需要的头文件（以 `LINKDEF.h` 结尾的头文件）可在 `LINKDEF` 后列出：

```cmake
root_generate_dictionary(G__Example Example.h LINKDEF ExampleLinkDef.h)
```

该命令将创建三个文件:

- `${NAME}.cxx`：创建库时，这个文件应该包含在源代码中。
- `lib{NAME}.rootmap`（移除 `G__` 前缀）：纯文本的 rootmap 文件
- `lib{NAME}_rdict.pcm`（移除`G__` 前缀）：[ROOT 预编译的模块文件][root pre-compiled module file]

目标名（`${NAME}`）由字典名决定；若字典名以 `G__` 为前缀，会将前缀删除。否则，直接使用目标名。

最后两个输出文件在生成库后产生。可以通过 `CMAKE_LIBRARY_OUTPUT_DIRECTORY` 进行检查（不会获取本地目标的设置信息）。设置了 libdir，但没有设置（全局）安装位置时，还需要将 `ARG_NOINSTALL` 设置为 `TRUE`。

### 使用现有目标构建字典

可以通过 `MODULE` 参数，要求 ROOT 来执行相应的操作，而不是手动将生成的字典添加到库源代码中。此参数应该指定构建目标名：

```cmake
add_library(Example)
root_generate_dictionary(G__Example Example.h MODULE Example LINKDEF ExampleLinkDef.h)
```

字典全名（例如：`G__Example`）不应该与 `MODULE` 参数相同。

[linkdef-root]: https://root.cern/manual/io_custom_classes/#selecting-dictionary-entries-linkdefh
[root pre-compiled module file]: https://inspirehep.net/literature/1413967

---

## 使用旧版 ROOT

如果确实必须使用非常古老的 ROOT 版本（6.20 之前），在使用 `root_generate_dictionary` 之前需要手动加载字典宏：

```cmake
include("${ROOT_DIR}/modules/RootNewMacros.cmake")
# 对于早于 6.16 的 ROOT 版本，如果全局包含目录列表为空，
# 构建就会出错！
if (${ROOT_VERSION} VERSION_LESS "6.16")
    include_directories(ROOT_NONEXISTENT_DIRECTORY_HACK)
endif()
```

（`include_directories` 这一行是为了绕过 `RootNewMacros` 文件中的一个 bug：除非至少存在一个全局包含目录或 `inc` 文件夹，否则字典生成就会失败；这里列出的目录本身并不需要真实存在。）

此外，还需要自行修补缺失的目标属性和标志，写法如下：

```cmake
# 在 ROOT 6.10 和 6.12 中，ROOT 目标缺失了包含目录和编译标志
set_property(TARGET ROOT::Core PROPERTY
    INTERFACE_INCLUDE_DIRECTORIES "${ROOT_INCLUDE_DIRS}")

# 早期版本的 ROOT 没有在目标上包含所需的编译标志
add_library(ROOT::Flags_CXX IMPORTED INTERFACE)


# ROOT 6.14 及更早版本的链接器标志中存在空格 bug
string(REPLACE "-L " "-L" ROOT_EXE_LINKER_FLAGS "${ROOT_EXE_LINKER_FLAGS}")

# 修复 ROOT_CXX_FLAGS 实际上并不是 CMake 列表的问题
separate_arguments(ROOT_CXX_FLAGS)
set_property(TARGET ROOT::Flags_CXX APPEND PROPERTY
    INTERFACE_COMPILE_OPTIONS ${ROOT_CXX_FLAGS})

# 添加宏定义
separate_arguments(ROOT_DEFINITIONS)
foreach(_flag ${ROOT_DEFINITIONS})
    # 移除可能存在的 -D 或 /D 前缀
    string(REGEX REPLACE [=[^[-//]D]=] "" _flag ${_flag})
    set_property(TARGET ROOT::Flags_CXX APPEND PROPERTY INTERFACE_COMPILE_DEFINITIONS ${_flag})
endforeach()

# 这同样修复了链接器标志中的一个 bug
separate_arguments(ROOT_EXE_LINKER_FLAGS)
set_property(TARGET ROOT::Flags_CXX APPEND PROPERTY
    INTERFACE_LINK_LIBRARIES ${ROOT_EXE_LINKER_FLAGS})

# 请确保同时也链接了 ROOT::Flags_CXX！
```
