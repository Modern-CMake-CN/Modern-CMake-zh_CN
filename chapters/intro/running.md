# 运行 CMake

在编写 CMake 之前，要确保你已经清楚了如何运行 CMake 来构建文件。 几乎所有 CMake 项目都一样。

## 构建项目

除非另行说明，你始终应该建立一个专用于构建的目录并在那里构建项目。从技术上来讲，你可以进行内部构建（即在源代码目录下执行 CMake 构建命令），但是必须注意不要覆盖文件或者把它们添加到 git，所以别这么做就好。

这是经典的 CMake 构建流程 （TM）：

{% term %}
~/package $ mkdir build
~/package $ cd build
~/package/build $ cmake ..
~/package/build $ make
{% endterm %}

你可以用 `cmake --build .` 替换 `make` 这一行。它会调用 `make` 或这任何你正在使用的构建工具。如果你正在使用版本比较新的 CMake（除非你正在检查对于老版本 CMake 的兼容性，否则应该使用较新的版本），你也可以这样做：

{% term %}
~/package $ cmake -S . -B build
~/package $ cmake --build build
{% endterm %}

以下**任何一条**命令都能够执行安装：

{% term %}
# From the build directory (pick one)
~/package/build $ make install
~/package/build $ cmake --build . --target install
~/package/build $ cmake --install . # CMake 3.15+ only

# From the source directory (pick one)
~/package $ make -C build install
~/package $ cmake --build build --target install
~/package $ cmake --install build # CMake 3.15+ only
{% endterm %}

所以你应该选择哪一种方法？只要你**别忘记**输入构建目录作为参数，在构建目录之外的时间较短，并且从源代码目录更改源代码比较方便就行。你应该试着习惯使用 `--build`，因为它能让你免于只用 `make` 来构建。需要注意的是，在构建目录下进行工作一直都非常普遍，并且一些工具和命令（包括 CTest）仍然需要在 build 目录中才能工作。

额外解释一下，你可以指定 CMake 工作在**来自构建目录**的源代码目录，也可以工作在任何**现有**的构建目录。

如果你使用 `cmake --build` 而不是直接调用更底层的构建系统（译者注：比如直接使用 `make`），你可以用 `-v` 参数在构建时获得详细的输出（CMake 3.14+），用 `-j N` 指定用 N 个 CPU 核心并行构建项目（Cmake 3.12+），以及用 `--target`（任意版本的 CMake）或 `-t`（CMake 3.15+）来选择一个目标进行部分地构建。这些命令因不同的构建系统而异，例如 `VERBOSE=1 make` 和 `ninja -v`。你也可以使用环境变量替代它们，例如 `CMAKE_BUILD_PARALLEL_LEVEL` (CMake 3.12+) 和 `VERBOSE` (CMake 3.14+)。

## 指定编译器

指定编译器必须在第一次运行时在空目录中进行。这种命令并不属于 CMake 语法，但你仍可能不太熟悉它。如果要选择 Clang：

{% term %}
~/package/build $ CC=clang CXX=clang++ cmake ..
{% endterm %}

这条命令设置了 bash 里的环境变量 CC 和 CXX，并且 CMake 会使用这些参数。这一行命令就够了，你也只需要调用一次；之后 CMake 会继续使用从这些变量里推导出来的路径。

## 指定生成器

你可以选择的构建工具有很多；通常默认的是 `make`。要显示在你的系统上 CMake 可以调用的所有构建工具，运行：

{% term %}
~/package/build $ cmake --help
{% endterm %}

你也可以用 `-G"My Tool"`（仅当构建工具的名字中包含空格时才需要引号）来指定构建工具。像指定编译器一样，你应该在一个目录中第一次调用 CMake 时就指定构建工具。如果有好几个构建目录也没关系，比如 `build/` 和 `buildXcode`。你可以用环境变量 `CMAKE_GENERATOR` 来指定默认的生成器（CMake 3.15+）。需要注意的是，makefiles 只会在你明确地指出线程数目之时才会并行运行，比如 `make -j2`，而 Ninja 却会自动地并行运行。在较新版本的 CMake 中，你能直接传递并行选项，比如`-j2`，到命令 `cmake --build `。

## 设置选项

在 CMake 中，你可以使用 `-D` 设置选项。你能使用 `-L` 列出所有选项，或者用 `-LH` 列出人类更易读的选项列表。如果你没有列出源代码目录或构建目录，这条命令将不会重新运行 CMake（使用 `cmake -L` 而不是 `cmake -L .`）。

## 详细和部分的构建

同样，这不属于 CMake，如果你正使用像 `make` 一样的命令行构建工具，你能获得详细的输出：

{% term %}
~/package/build $ VERBOSE=1 make96

我们已经提到了在构建时可以有详细输出，但你也可以看到详细的 CMake 配置输出。`--trace` 选项能够打印出运行的 CMake 的每一行。由于它过于冗长，CMake 3.7 添加了 `--trace-source="filename"` 选项，这让你可以打印出你想看的特定文件运行时执行的每一行。如果你选择了要调试的文件的名称（在调试一个 CMakeLists.txt 时通常选择父目录，因为它们名字都一样），你就会只看到这个文件里运行的那些行。这很实用！


{% endterm %}

实际上你写成 `make VERBOSE=1`，make 也能正确工作，但这是 `make` 的一个特性而不是命令行的惯用写法。

你也可以通过指定一个目标来仅构建一部分，例如指定你已经在 CMake 中定义的库或可执行文件的名称，然后 make 将会只构建这一个目标。

## 选项

CMake 支持缓存选项。CMake 中的变量可以被标记为 "cached"，这意味着它会被写入缓存（构建目录中名为 `CMakeCache.txt` 的文件）。你可以在命令行中用 `-D` 预先设定（或更改）缓存选项的值。CMake 查找一个缓存的变量时，它就会使用已有的值并且不会覆盖这个值。

### 标准选项

大部分软件包中都会用到以下的 CMake 选项：

* `-DCMAKE_BUILD_TYPE=` 从 Release， RelWithDebInfo， Debug， 或者可能存在的更多参数中选择。
* `-DCMAKE_INSTALL_PREFIX=` 这是安装位置。UNIX 系统默认的位置是 `/usr/local`，用户目录是 `~/.local`，也可以是你自己指定的文件夹。
* `-DBUILD_SHARED_LIBS=` 你可以把这里设置为 `ON` 或 `OFF` 来控制共享库的默认值（不过，你也可以明确选择其他值而不是默认值）
* `-DBUILD_TESTING=` 这是启用测试的通用名称，当然不会所有软件包都会使用它，有时这样做确实不错。

## 调试你的 CMake 文件

我们已经提到了在构建时可以有详细输出，但你也可以看到详细的 CMake 配置输出。`--trace` 选项能够打印出运行的 CMake 的每一行。由于它过于冗长，CMake 3.7 添加了 `--trace-source="filename"` 选项，这让你可以打印出你想看的特定文件运行时执行的每一行。如果你选择了要调试的文件的名称（在调试 CMakeLists.txt 时通常选择父目录，因为它的名字在任何项目中都一样），你就会只看到这个文件里运行的那些行。这很实用！
