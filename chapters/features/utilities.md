# CCache 和一些其他的实用工具

在过去的一些版本中，一些能够帮助你写好代码的实用工具已经被添加到了 CMake 中。往往是通过为目标指定属性，或是设定形如 `CMAKE_*` 的初始化变量的值的形式启用相应工具。这个启用的规则不只是对某个特定的工具（program）起作用，一些行为相似的工具都符合此规则。

当需要启用多个工具时，所有的这些变量都通过 `;` 分隔（CMake 中列表的分隔标准）来描述你在目标源程序上需要使用的工具( program) 以及选项。

## CCache[^1]

通过设置变量 `CMAKE_<LANG>_COMPILER_LAUNCHER` 或设置目标的 `<LANG>_COMPILER_LAUNCHER` 属性来使用一些像 CCache 的方式来“封装”目标的编译。在 CMake 的最新版本中拓展了对 CCache 的支持。在使用时，可以这么写：


```cmake
find_program(CCACHE_PROGRAM ccache)
if(CCACHE_PROGRAM)
    set(CMAKE_CXX_COMPILER_LAUNCHER "${CCACHE_PROGRAM}")
    set(CMAKE_CUDA_COMPILER_LAUNCHER "${CCACHE_PROGRAM}") # CMake 3.9+
endif()
```


## 一些实用工具

设置以下属性或是在命令行中设置以 `CMAKE_*` 为起始的变量来启动这些功能。它们大部分只在 make 或 ninja 生成器生成 C 和 CXX 项目时起作用。

* `<LANG>_CLANG_TIDY`: CMake 3.6+
* `<LANG>_CPPCHECK`
* `<LANG>_CPPLINT`
* `<LANG>_INCLUDE_WHAT_YOU_USE`

## Clang tidy[^2]

这是在命令行中运行 clang-tidy的方法，使用的是一个列表（记住，用分号分隔的字符串是一个列表）。

这是一个使用 Clang-Tidy 的简单例子：

```term
~/package # cmake -S . -B build-tidy -DCMAKE_CXX_CLANG_TIDY="$(which clang-tidy);-fix"
~/package # cmake --build build -j 1
```

这里的 `-fix` 部分是可选的，将会修改你的源文件来尝试修复 clang-tidy 警告 (warning) 的问题。如果你在一个 git 仓库中工作的话，使用 `-fix` 是相当安全的，因为你可以看到代码中哪部分被改变了。不过，请确保**不要同时运行你的 makefile/ninja 来进行构建**！如果它尝试修复一个相同的头文件两次，可能会出现预期外的错误。

如果你想明确的使用目标的形式来确保自己对某些特定的目标调用了 clang-tidy，为可以设置一个变量（例如像 `DO_CLANG_TIDY`，而不是名为 `CMAKE_CXX_CLANG_TIDY` 的变量），然后在创建目标时，将它添加为目标的属性。你可以通过以下方式找到路径中的 clang-tidy：

```cmake
find_program(
    CLANG_TIDY_EXE
    NAMES "clang-tidy"
    DOC "Path to clang-tidy executable"
)
```

## Include what you use[^3]

这是一个使用 `include what you use` 的例子。首先，你需要确保系统中有这个工具，例如在一个 docker 容器中或者通过 macOS 上的 brew 利用 `brew install include-what-you-use` 来安装它。然后，你可以通过此方式使用此工具，而不需要修改你的源代码：

```term
~/package # cmake -S . -B build-iwyu -DCMAKE_CXX_INCLUDE_WHAT_YOU_USE=include-what-you-use
```

最后，你可以重定向输出到文件，然后选择是否应用此修复：

```term
~/package # cmake --build build-iwyu 2> iwyu.out
~/package # fix_includes.py < iwyu.out
```

（你应该先检查一下这些修复的正确性，或者在修复后对代码进行润色！）

## Link what you use

这是一个布尔类型的目标属性，`LINK_WHAT_YOU_USE`，它将会在链接时检查与目标不相干的文件。

## Clang-format[^4]

不幸的是，Clang-format 并没有真正的与 CMake 集成。你可以制作一个自定义的目标（参考 [这篇文章](https://arcanis.me/en/2015/10/17/cppcheck-and-clang-format)，或者你可以尝试自己手动的去运行它。）一个有趣的项目/想法 [在这里](https://github.com/kbenzie/git-cmake-format)，不过我还没有亲自尝试过。它添加了一个格式化 (format) 的目标，并且你甚至没法提交没有格式化过的文件。

下面的两行可以在一个 git 仓库中，在 `bash ` 中使用 clang-format 工具（假设你有一个 `.clang-format` 文件）：

```term
gitbook $ git ls-files -- '*.cpp' '*.h' | xargs clang-format -i -style=file
gitbook $ git diff --exit-code --color
```



{% hint style='info' %}

译者注：以下所有的脚注说明都为译者添加，原文并不包含此信息。脚注的说明资料均来自于互联网。
{% endhint %}



[^1]: Ccache（或 ”ccache“）是一个编译器缓存。它通过缓存之前的编译文件并且利用之前已经完成的编译过程来[加速重编译]((https://ccache.dev/performance.html))。Ccache是一个免费的软件，基于 [GNU General Public License version 3](http://www.gnu.org/licenses/gpl.html) 或之后更新的许可协议发布。可以查看这里的 [许可协议页面](https://ccache.dev/license.html) 。
[^2]: **clang-tidy** 是一个基于 clang 的 C++ 代码分析工具。它意图提供一个可扩展的框架，用于诊断和修复典型的编程错误，如样式违规、接口误用、或通过静态分析推断出的错误。**clang-tidy** 是一个模块化的程序，为编写新的检查规则提供了方便的接口。
[^3]: 一个与 **clang** 一起使用，用于分析 C 和 C++ 源文件中 **#include** 的工具。
[^4]:  ClangFormat 描述了一套建立在 [LibFormat](https://clang.llvm.org/docs/LibFormat.html) 之上的工具。它可以以各种方式支持你的工作流程，包括独立的工具和编辑器的集成。
