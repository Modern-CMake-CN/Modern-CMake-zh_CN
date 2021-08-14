# C++11 及后续版本

CMake 中支持 C++11，但是这是针对于 CMake 2.8 及以后的版本来说的。这是为什么？很容易可以猜到， C++11 在 2009年——CMake 2.0 发布的时候还不存在。只要你使用 CMake 的是 CMake 3.1 或者更新的版本，你将会得到 C++11 的完美支持，不过这里有两种不同的方式来启用支持。 并且你将看到，在 CMake 3.8+ 中对 C++11 有着更好的支持。我将会在 CMake 3.8+ 的基础上讲解，因为这才叫做 Modern CMake。 


## CMake 3.8+: 元编译器选项

只要你使用新版的 CMake 来组织你的项目，那你就能够使用最新的方式来启用 C++ 的标准。这个方式功能强大，语法优美，并且对最新的标准有着很好的支持。此外，它对目标 (target) 进行混合标准与选项设置有着非常优秀的表现。假设你有一个名叫 `myTarget` 的目标，它看起来像这样：

```cmake
target_compile_features(myTarget PUBLIC cxx_std_11)
set_target_properties(myTarget PROPERTIES CXX_EXTENSIONS OFF)
```

对于第一行，我们可以在 `cxx_std_11`、`cxx_std_14` 和 `cxx_std_17` 之间选择。第二行是可选的，但是添加了可以避免 CMake 对选项进行拓展。如果不添加它，CMake 将会添加选项 `-std=g++11` 而不是 `-std=c++11` 。第一行对 `INTERFACE` 这种目标 (target) 也会起作用，第二行只会对实际被编译的目标有效。

如果在目标的依赖链中有目标指定了更高的 C++ 标准，上述代码也可以很好的生效。这只是下述方法的一个更高级的版本，因此可以很好的生效。

## CMake 3.1+: 编译器选项

你可以指定开启某个特定的编译器选项。这相比与直接指定 C++ 编译器的版本更加细化，尽管去指定一个包使用的所有编译器选项可能有点困难，除非这个包是你自己写的或者你的记忆力非凡。最后 CMake 会检查你编译器支持的所有选项，并默认设置使用其中每个最新的版本。因此，你不必指定所有你需要的选项，只需要指定那些和默认有出入的。设置的语法和上一部分相同，只是你需要挑选一个列表里面存在的选项而不像是 `cxx_std_*` 。这里有包含[所有选项的列表](https://cmake.org/cmake/help/latest/prop_gbl/CMAKE_CXX_KNOWN_FEATURES.html)。

如果你需要可选的选项，在 CMake 3.3+ 中你可以使用列表 `CMAKE_CXX_COMPILE_FEATURES` 及 `if(... INLIST ...) ` 来查看此选项是否在此项目中被选用，然后来决定是否添加它。可以 [在此](https://cmake.org/cmake/help/latest/manual/cmake-compile-features.7.html) 查看一些其他的使用情况。


## CMake 3.1+: 全局设置以及属性设置

这是支持 C++ 标准的另一种方式，（在目标及全局级别）设置三个特定属性的值。这是全局的属性：

```cmake
set(CMAKE_CXX_STANDARD 11 CACHE STRING "The C++ standard to use")
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
```

第一行设置了 C++ 标准的级别， 第二行告诉 CMake 使用上述设置， 最后一行关闭了拓展，来明确自己使用了 `-std=c++11` 还是 `-std=g++11` 。这个方法中可以在最终包 (final package) 中使用，但是不推荐在库中使用。你应该总是把它设置为一个缓存变量，这样你就可以很容易地重写其内容来尝试新的标准（或者如果你在库中使用它的话，这是重写它的唯一方式。**不过再重申一遍**，不要在库中使用此方式）。你也可以对目标来设置这些属性：

```cmake
set_target_properties(myTarget PROPERTIES
    CXX_STANDARD 11
    CXX_STANDARD_REQUIRED YES
    CXX_EXTENSIONS NO
)
```

这种方式相比于上面来说更好，但是仍然没法对 `PRIVATE` 和 `INTERFACE` 目标的属性有明确的控制，所以他们也仍然只对最终目标 (final targets) 有用。

你可以在 [Craig Scott's useful blog post][crascit] 这里找到更多关于后面两种方法的信息。 

{% hint style='danger' %}

不要自己设置手动标志。如果这么做，你必须对每个编译器的每个发行版设置正确的标志，你无法通过不支持的编译器的报错信息来解决错误，并且 IDE 可能不会去关心手动设置的标志。
{% endhint %}

[crascit]: https://crascit.com/2015/03/28/enabling-cxx11-in-cmake/
