# C++ 标准

CMake 对选择 C++ 标准有着非常出色的支持，最高已覆盖到 C++26。推荐的做法有两种：按目标设置的编译特性（compile features），以及相关的标准变量与属性。这两种方式在本书要求的最低 CMake 版本之前就早已存在，按需选用即可。

## 元编译器选项

功能最强大、语法最优美，且对目标 (target) 进行混合标准与选项设置表现最好的方式，是使用 `target_compile_features` 配合 `cxx_std_*` 元特性。假设你有一个名叫 `myTarget` 的目标，它看起来像这样：

```cmake
target_compile_features(myTarget PUBLIC cxx_std_11)
set_target_properties(myTarget PROPERTIES CXX_EXTENSIONS OFF)
```

对于第一行，我们可以在 `cxx_std_11`、`cxx_std_14`、`cxx_std_17`（均为 CMake 3.8+）、`cxx_std_20`（CMake 3.12+）、`cxx_std_23`（CMake 3.20+）和 `cxx_std_26`（CMake 3.25+）之间选择。第二行是可选的，但是添加了可以避免 CMake 对选项进行拓展。如果不添加它，CMake 将会添加选项 `-std=gnu++11` 而不是 `-std=c++11` 。第一行对 `INTERFACE` 这种目标 (target) 也会起作用，第二行只会对实际被编译的目标有效。

如果在目标的依赖链中有目标指定了更高的 C++ 标准，上述代码也可以很好的生效；所指定的标准会被视为最低要求，最终会采用所有请求中最高的标准。

:::{note}

CMake 3.1 最初支持细粒度的编译特性（如 `cxx_constexpr`），允许你按需请求单个语言特性而非整个标准（参见[完整列表](https://cmake.org/cmake/help/latest/prop_gbl/CMAKE_CXX_KNOWN_FEATURES.html)）。但这种做法难以扩展；CMake 在 C++14 之后就停止了添加细粒度特性，如今[官方文档](https://cmake.org/cmake/help/latest/manual/cmake-compile-features.7.html)也引导你改用 `cxx_std_*` 元特性。

:::

## 全局设置以及属性设置

这是支持 C++ 标准的另一种方式，（在目标及全局级别）设置三个特定属性的值。这是全局的属性：

```cmake
set(CMAKE_CXX_STANDARD 11 CACHE STRING "The C++ standard to use")
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
```

第一行设置了 C++ 标准的级别， 第二行告诉 CMake 使用上述设置， 最后一行关闭了拓展，来明确自己使用了 `-std=c++11` 还是 `-std=gnu++11` 。这个方法中可以在最终包 (final package) 中使用，但是不推荐在库中使用。你应该总是把它设置为一个缓存变量，这样你就可以很容易地重写其内容来尝试新的标准（或者如果你在库中使用它的话，这是重写它的唯一方式。**不过再重申一遍**，不要在库中使用此方式）。你也可以对目标来设置这些属性：

```cmake
set_target_properties(myTarget PROPERTIES
    CXX_STANDARD 11
    CXX_STANDARD_REQUIRED YES
    CXX_EXTENSIONS NO
)
```

这种方式相比于上面来说更好，但是仍然没法对 `PRIVATE` 和 `INTERFACE` 目标的属性有明确的控制，所以他们也仍然只对最终目标 (final targets) 有用。

你可以在 [Craig Scott's useful blog post][crascit] 这里找到更多关于这些方法的信息。

:::{danger}

不要自己设置手动标志。如果这么做，你必须对每个编译器的每个发行版设置正确的标志，你无法通过不支持的编译器的报错信息来解决错误，并且 IDE 可能不会去关心手动设置的标志。

:::

[crascit]: https://crascit.com/2015/03/28/enabling-cxx11-in-cmake/
