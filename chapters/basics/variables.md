# 变量与缓存

## 本地变量
我们首先讨论变量。你可以这样声明一个本地 ( local ) 变量：

```CMake
set(MY_VARIABLE "value")
```

变量名通常全部用大写，变量值跟在其后。你可以通过 `${}` 来解析一个变量，例如 `${MY_VARIABLE}`.[^1] CMake 有作用域的概念，在声明一个变量后，你只可以它的作用域内访问这个变量。如果你将一个函数或一个文件放到一个子目录中，这个变量将不再被定义。你可以通过在变量声明末尾添加 `PARENT_SCOPE` 来将它的作用域置定为当前的上一级作用域。

列表就是简单地包含一系列变量：

```cmake
set(MY_LIST "one" "two")
```

你也可以通过 `;` 分隔变量，这和空格的作用是一样的：

```cmake
set(MY_LIST "one;two")
```

有一些和 `list( ` 进行协同的命令， `separate_arguments` 可以把一个以空格分隔的字符串分割成一个列表。需要注意的是，在 CMake 中如果一个值没有空格，那么加和不加引号的效果是一样的。这使你可以在处理知道不可能含有空格的值时不加引号。

当一个变量用 `${}` 括起来的时候，空格的解析规则和上述相同。对于路径来说要特别小心，路径很有可能会包含空格，因此你应该总是将解析变量得到的值用引号括起来，也就是，应该这样 `"${MY_PATH}"` 。

## 缓存变量

CMake 提供了一个缓存变量来允许你从命令行中设置变量。CMake 中已经有一些预置的变量，像 `CMAKE_BUILD_TYPE` 。如果一个变量还没有被定义，你可以这样声明并设置它。

```cmake
set(MY_CACHE_VARIABLE "VALUE" CACHE STRING "Description")
```

这么写**不会覆盖**已定义的值。这是为了让你只能在命令行中设置这些变量，而不会在 CMake 文件执行的时候被重新覆盖。如果你想把这些变量作为一个临时的全局变量，你可以这样做：

```cmake
set(MY_CACHE_VARIABLE "VALUE" CACHE STRING "" FORCE)
mark_as_advanced(MY_CACHE_VARIABLE)
```

第一行将会强制设置该变量的值，第二行将使得用户运行 `cmake -L ..` 或使用 GUI 界面的时候不会列出该变量。此外，你也可以通过 `INTERNAL` 这个类型来达到同样的目的（尽管在技术上他会强制使用 STRING 类型，这不会产生任何的影响）：

```cmake
set(MY_CACHE_VARIABLE "VALUE" CACHE INTERNAL "")
```

因为 `BOOL` 类型非常常见，你可以这样非常容易的设置它：

 ```cmake
 option(MY_OPTION "This is settable from the command line" OFF)
 ```

对于 `BOOL` 这种数据类型，对于它的 `ON` 和 `OFF` 有几种不同的说辞 (wordings) 。

你可以查看 [cmake-variables] 来查看 CMake 中已知变量的清单。

## 环境变量

你也可以通过 `set(ENV{variable_name} value)` 和 `$ENV{variable_name}` 来设置和获取环境变量，不过一般来说，我们最好避免这么用。

## 缓存

缓存实际上就是个文本文件，`CMakeCache.txt` ，当你运行 CMake 构建目录时会创建它。 CMake 可以通过它来记住你设置的所有东西，因此你可以不必在重新运行 CMake 的时候再次列出所有的选项。

## 属性

CMake 也可以通过属性来存储信息。这就像是一个变量，但它被附加到一些其他的物体 (item) 上，像是一个目录或者是一个目标。一个全局的属性可以是一个有用的非缓存的全局变量。许多目标属性都是被以 `CMAKE_` 为前缀的变量来初始化的。例如你设置 `CMAKE_CXX_STANDARD` 这个变量，这意味着你之后创建的所有目标的 `CXX_STANDARD` 都将被设为`CMAKE_CXX_STANDARD` 变量的值。

你可以这样来设置属性：

```cmake
set_property(TARGET TargetName
             PROPERTY CXX_STANDARD 11)

set_target_properties(TargetName PROPERTIES
                      CXX_STANDARD 11)
```

第一种方式更加通用 ( general ) ，它可以一次性设置多个目标、文件、或测试，并且有一些非常有用的选项。第二种方式是为一个目标设置多个属性的快捷方式。此外，你可以通过类似于下面的方式来获得属性：

```cmake
get_property(ResultVariable TARGET TargetName PROPERTY CXX_STANDARD)
```

可以查看 [cmake-properties] 获得所有已知属性的列表。在某些情况下，你也可以自己定义一些属性[^2]。

[cmake-properties]: https://cmake.org/cmake/help/latest/manual/cmake-properties.7.html
[cmake-variables]: https://cmake.org/cmake/help/latest/manual/cmake-variables.7.html

[^1]:  `if` 的条件部分语法有一些奇怪，因为 `if` 语法比 `${}` 出现的更早，所以它既可以加 `${}` 也可以不加 `${}`。 
[^2]: 对于接口类的目标，可能对允许自定义的属性有一些限制。
