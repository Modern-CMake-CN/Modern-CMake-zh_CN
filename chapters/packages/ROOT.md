
# ROOT

[ROOT](https://root.cern/) 是用于高能物理学的 C++ 工具包，里面东西超级多。CMake 确实有很多使用它的方法，不过其中许多/大多数的例子可能是错误的。这里，说一下我推荐的方式。

最新版本的 ROOT，对 CMake 的支持*改进了很多* —— 使用 6.16+ 就变得很容易！若需要支持 6.14 或更早版本，可以继续往下阅读。6.20 版中有进一步的改进，更像一个合适的 CMake 项目，具有为目标导出 C++ 标准特性等功能。

## 查找 ROOT

ROOT 6.10+ 支持配置文件查找的方式，所以可以这样做：

[import:'find_package', lang:'cmake'](../../examples/root-simple/CMakeLists.txt)

尝试找到 ROOT 包。若没有设置 ROOT 的路径，可以将 `-DROOT_DIR=$ROOTSYS/cmake` 传递给 CMake，从而找到ROOT。(实际上，应该使用 `source thisroot.sh` 的方式）


## 正确的方式（使用目标）

ROOT 6.12 及更早版本，没有为导入的目标添加包含目录。ROOT 6.14+ 已经修正了这个错误，所需的目标属性已经变得更好用了。这种方法使得 ROOT 变得越来越容易使用（有关旧版 ROOT 的内容，请参阅本节页末尾的示例）。

链接时，只需选择想要使用的库：

[import:'add_and_link', lang:'cmake'](../../examples/root-simple/CMakeLists.txt)

若想查看默认列表，可以在命令行上运行 `root-config --libs`。若已使用 Homebrew 安装了 ROOT 6.18，那么就会显示如下信息：

* `ROOT::Core`
* `ROOT::Gpad`
* `ROOT::Graf3d`
* `ROOT::Graf`
* `ROOT::Hist`
* `ROOT::Imt`
* `ROOT::MathCore`
* `ROOT::Matrix`
* `ROOT::MultiProc`
* `ROOT::Net`
* `ROOT::Physics`
* `ROOT::Postscript`
* `ROOT::RIO`
* `ROOT::ROOTDataFrame`
* `ROOT::ROOTVecOps`
* `ROOT::Rint`
* `ROOT::Thread`
* `ROOT::TreePlayer`
* `ROOT::Tree`

## 旧的全局方式

ROOT 提供了一个配置 ROOT 项目的[工具](https://root.cern.ch/how/integrate-root-my-project-cmake)，可以使用 `include("${ROOT_USE_FILE}")` 激活它。这将自动创建不美观的目录群和全局变量。这个工具的确可以节省一些配置时间，但若想通过修改这一过程来解决一些棘手的问题，则需要花费大量的时间。若不需要创建库，那么直接使用脚本也无所谓。这里，包含目录和编译连接标志使用的是全局设置，但仍然需要为目标手动链接 `${ROOT_LIBRARIES}`，可能还需要 `ROOT_EXE_LINKER_FLAGS`（例如使用 macOS 操作系统时，必须在链接之前使用 `separate_arguments`，若有多个标志，就会报错）。另外，在 6.16 之前，必须手动修复一个空格错误。

就像下面这样：

[import:'core', lang:'cmake'](../../examples/root-usefile/CMakeLists.txt)

## 组件

CMake 查找 ROOT 时，允许指定相应的组件。CMake 会将列出的内容添加到 `${ROOT_LIBRARIES}`，因此若想使用相应的组件来构建自己的目标，使用这种方式可以避免多次引用。不过，这并没有解决依赖关系的问题；只使用 `RooFit` 而没有 `RooFitCore` 也是错误的。若链接的是 `ROOT::RooFit`，而不是`${ROOT_LIBRARIES}`，则无需链接`RooFitCore`。

## 生成字典

生成字典是 ROOT 解决 C++ 中缺少反射特性的一种方式。需要 ROOT 了解自定义类的细节，这样 ROOT 就可以保存它，并且可以在 Cling 解释器中显示相应的方法，等等。源代码需要进行如下修改来支持生成字典：

* 类定义应该以 `ClassDef(MyClassName, 1)` 结束
* 类实现中应该有 `ClassImp(MyClassName)`

ROOT 提供了  `rootcling ` 和 `genreflex`（`rootcling` 的遗留接口），这两个二进制文件可生成构建字典所需的源文件，还定义了一个CMake函数 `root_generate_dictionary`，其在构建过程中会使用 `rootling` 。

要加载函数，首先要包含 ROOT 的宏：
```cmake
include("${ROOT_DIR}/modules/RootNewMacros.cmake")
# For ROOT versions than 6.16, things break 
# if nothing is in the global include list!
if (${ROOT_VERSION} VERSION_LESS "6.16")
    include_directories(ROOT_NONEXISTENT_DIRECTORY_HACK)
endif()
```

为了修复 `RootNewMacros.cmake` 文件中的错误，这里需要 `if(…)`。若没有全局包含目录或 `inc` 文件夹，该错误会导致字典生成失败。这里我包含了一个不存在的目录，只是为了让字典能够顺利生成， `ROOT_NONEXISTENT_DIRECTORY_HACK` 目录其实并不存在。

`rootcling` 使用带有 [特定公式][linkdef-root] 的特殊头文件来确定为哪部分用于生成字典。文件名可以有前缀，但**必须**以 `LinkDef.h` 结尾。编写完成了这个头文件，就可以调用字典中生成的函数了。

### 手动生成字典
有时，可能想让 ROOT 生成字典，然后自己将源文件添加到库目标中。可以用字典名来调用 `root_generate_dictionary` 函数（例如：`G__Example`），任何需要的头文件（以 `LINKDEF.h` 结尾的头文件）可在 `LINKDEF` 后列出：

```cmake
root_generate_dictionary(G__Example Example.h LINKDEF ExampleLinkDef.h)
```

该命令将创建三个文件:
* `${NAME}.cxx`：创建库时，这个文件应该包含在源代码中。
* `lib{NAME}.rootmap`（移除 `G__` 前缀）：纯文本的 rootmap 文件
* `lib{NAME}_rdict.pcm`（移除`G__` 前缀）：[ROOT 预编译的模块文件][ROOT pre-compiled module file]
目标名（`${NAME}`）由字典名决定；若字典名以 `G__` 为前缀，会将前缀删除。否则，直接使用目标名。

最后两个输出文件在生成库后产生。可以通过 `CMAKE_LIBRARY_OUTPUT_DIRECTORY` 进行检查（不会获取本地目标的设置信息）。设置了 libdir，但没有设置（全局）安装位置时，还需要将 `ARG_NOINSTALL` 设置为 `TRUE`。

### 使用现有目标构建字典
可以通过 `MODULE` 参数，要求 ROOT 来执行相应的操作，而不是手动将生成的内容添加到库源代码中。此参数应该指定构建目标名：

```cmake
add_library(Example)
root_generate_dictionary(G__Example Example.h MODULE Example LINKDEF ExampleLinkDef.h)
```

字典全名（例如：`G__Example`）不应该与 `MODULE` 参数相同。


[linkdef-root]: https://root.cern.ch/selecting-dictionary-entries-linkdefh
[ROOT pre-compiled module file]: https://inspirehep.net/literature/1413967

---

# 使用旧版 ROOT

若有必要使用旧版 ROOT，就需要像这样编写 CMake 脚本：

```cmake
# ROOT targets are missing includes and flags in ROOT 6.10 and 6.12
set_property(TARGET ROOT::Core PROPERTY
    INTERFACE_INCLUDE_DIRECTORIES "${ROOT_INCLUDE_DIRS}")

# Early ROOT does not include the flags required on targets
add_library(ROOT::Flags_CXX IMPORTED INTERFACE)


# ROOT 6.14 and earlier have a spacing bug in the linker flags
string(REPLACE "-L " "-L" ROOT_EXE_LINKER_FLAGS "${ROOT_EXE_LINKER_FLAGS}")

# Fix for ROOT_CXX_FLAGS not actually being a CMake list
separate_arguments(ROOT_CXX_FLAGS)
set_property(TARGET ROOT::Flags_CXX APPEND PROPERTY
    INTERFACE_COMPILE_OPTIONS ${ROOT_CXX_FLAGS})

# Add definitions
separate_arguments(ROOT_DEFINITIONS)
foreach(_flag ${ROOT_EXE_LINKER_FLAG_LIST})
    # Remove -D or /D if present
    string(REGEX REPLACE [=[^[-//]D]=] "" _flag ${_flag})
    set_property(TARGET ROOT::Flags APPEND PROPERTY INTERFACE_LINK_LIBRARIES ${_flag})
endforeach()

# This also fixes a bug in the linker flags
separate_arguments(ROOT_EXE_LINKER_FLAGS)
set_property(TARGET ROOT::Flags_CXX APPEND PROPERTY
    INTERFACE_LINK_LIBRARIES ${ROOT_EXE_LINKER_FLAGS})

# Make sure you link with ROOT::Flags_CXX too!
```
