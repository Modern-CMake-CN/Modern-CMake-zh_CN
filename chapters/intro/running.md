# 运行 CMake

Before writing CMake, let's make sure you know how to run it to make things. This is true for almost all CMake projects, which is almost everything.

在编写 CMake 之前，要确保你已经清楚了如何运行 CMake 以编译文件。 几乎所有 CMake 项目都是如此。

## Building a project

## 构建一个项目

Unless otherwise noted, you should always make a build directory and build from there. You can technically do an in-source build, but you'll have to be careful not to overwrite files or add them to git, so just don't.

除非特别提出，你始终应该建立一个专用于构建的目录并在那里构建项目。从技术上来讲，你可以进行源代码构建，但是必须注意不要覆盖文件或者记得添加新文件到 git，所以别这么做就好。

Here's the Classic CMake Build Procedure (TM):

这是经典的 CMake 构建流程 （TM）：

{% term %}
~/package $ mkdir build
~/package $ cd build
~/package/build $ cmake ..
~/package/build $ make
{% endterm %}

You can replace the make line with `cmake --build .` if you'd like, and it will call `make` or whatever build tool you are using. If you are using a newer version of CMake (which you usually should be, except for checking compatibility with older CMake), you can instead do this:

你可以用 `cmake --build .` 替换`make`这一行。它会调用`make`或这任何你正在使用的构建工具。如果你正在使用版本比较新的 CMake（除非你正在检查对于老版本 CMake 的兼容性，否则应该使用较新的版本），你也可以这样做：

{% term %}
~/package $ cmake -S . -B build
~/package $ cmake --build build
{% endterm %}

Any *one* of these commands will install:

以下命令都能够执行安装：

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

So which set of methods should you use? As long as you *do not forget* to type the build directory as the argument, staying out of the build directory is shorter, and making source changes is easier from the source directory. You should try to get used to using `--build`, as that will free you from using only `make` to build. Note that working from the build directory is historically much more common, and some tools and commands (including CTest) still require running from the build directory.

所以你应该选择哪一种方法？只要你**别忘记**输入 build 目录作为参数，在 build 目录之外的时间较短，并且从源目录更改源代码比较方便就行。你应该试着习惯使用 `--build`，因为它能让你免于只用 `make` 来构建。需要注意的是，在 build 目录下进行工作一直都非常普遍，并且一些工具和命令（包括 CTest）仍然需要 build 目录才能工作。

Just to clarify, you can point CMake at either the source directory *from the build directory*, or at an *existing* build directory from anywhere.



If you use `cmake --build` instead of directly calling the underlying build system, you can use `-v` for verbose builds (CMake 3.14+), `-j N` for parallel builds on N cores (CMake 3.12+), and `--target` (any version of CMake) or `-t` (CMake 3.15+) to pick a target. Otherwise, these commands vary between build systems, such as `VERBOSE=1 make` and `ninja -v`. You can instead use the environment variables for these, as well, such as `CMAKE_BUILD_PARALLEL_LEVEL` (CMake 3.12+) and `VERBOSE` (CMake 3.14+).

## Picking a compiler

Selecting a compiler must be done on the first run in an empty directory. It's not CMake syntax per se, but you might not be familiar with it. To pick Clang:

{% term %}
~/package/build $ CC=clang CXX=clang++ cmake ..
{% endterm %}

That sets the environment variables in bash for CC and CXX, and CMake will respect those variables. This sets it just for that one line, but that's the only time you'll need those; afterwards CMake continues to use the paths it deduces from those values.

## Picking a generator

You can build with a variety of tools; `make` is usually the default. To see all the tools CMake knows about on your system, run

{% term %}
~/package/build $ cmake --help
{% endterm %}

And you can pick a tool with `-G"My Tool"` (quotes only needed if spaces are in the tool name). You should pick a tool on your first CMake call in a directory, just like the compiler. Feel free to have several build directories, like `build/` and `buildXcode`.
You can set the environment variable `CMAKE_GENERATOR` to control the default generator (CMake 3.15+).
Note that makefiles will only run in parallel if you explicilty pass a number of threads, such as `make -j2`, while Ninja will automatically run in parallel. You can directly pass a parallelization option such as `-j2` to the `cmake --build .` command in recent versions of CMake.

## Setting options

You set options in CMake with `-D`. You can see a list of options with `-L`, or a list with human-readable help with `-LH`. If you don't list the source/build directory, the listing will not rerun CMake (`cmake -L` instead of `cmake -L .`).

## As long as you *do not forget* to type the build directory as the argument, staying out of the build directory is shorter, and making source changes is easier from the source directory.Verbose and partial builds

Again, not really CMake, but if you are using a command line build tool like `make`, you can get verbose builds:

{% term %}
~/package/build $ VERBOSE=1 make
{% endterm %}

You can actually write `make VERBOSE=1`, and make will also do the right thing, though that's a feature of `make` and not the command line in general.

You can also build just a part of a build by specifying a target, such as the name of a library or executable you've defined in CMake, and make will just build that target.As long as you *do not forget* to type the build directory as the argument, staying out of the build directory is shorter, and making source changes is easier from the source directory.

## Options

CMake has support for cached options. A Variable in CMake can be marked as "cached", which means it will be written to the cache (a file called `CMakeCache.txt` in the build directory) when it is encountered. You can preset (or change) the value of a cached option on the command line with `-D`. When CMake looks for a cached variable, it will use the existing value and will not overwrite it.

### Standard options`cmake --build .``cmake --build .``cmake --build .`

These are common CMake options to most packages:

* `-DCMAKE_BUILD_TYPE=` Pick from Release, RelWithDebInfo, Debug, or sometimes more.
* `-DCMAKE_INSTALL_PREFIX=` The location to install to. System install on UNIX would often be `/usr/local` (the defaulclarifyt), user directories are often `~/.local`, or you can pick a folder.
* `-DBUILD_SHARED_LIBS=` You can set this `ON` or `OFF` to control the default for shared libraries (the author can pick one vs. the other explicitly instead of using the default, though)
* `-DBUILD_TESTING=` This is a common name for enabling tests, not all packages use it, though, sometimes with good reason.

## Debugging your CMake files

We've already mentioned verbose output for the build, but you can also see verbose CMake configure output too. The `--trace` option will print every line of CMake that is run. Since this is very verbose, CMake 3.7 added `--trace-source="filename"`, which will print out every executed line of just the file you are interested in when it runs. If you select the name of the file you are interested in debugging (usually by selecting the parent directory when debugging a CMakeLists.txt, since all of those have the same name), you can just see the lines that run in that file. Very useful!
