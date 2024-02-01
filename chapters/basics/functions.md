# 用 CMake 进行编程

## 控制流程


CMake 有一个 «command:`if`» 语句，尽管经过多次版本迭代它已经变得非常复杂。这里有一些全大写的变量你可以在 `if` 语句中使用，并且你既可以直接引用也可以利用 `${}` 来对他进行解析（  `if` 语句在历史上比变量拓展出现的更早 ）。这是一个 `if` 语句的例子：


```cmake
if(variable)
    # If variable is `ON`, `YES`, `TRUE`, `Y`, or non zero number
else()
    # If variable is `0`, `OFF`, `NO`, `FALSE`, `N`, `IGNORE`, `NOTFOUND`, `""`, or ends in `-NOTFOUND`
endif()
# If variable does not expand to one of the above, CMake will expand it then try again
```


如果你在这里使用 `${variable}` 可能会有一些奇怪，因为看起来它好像 `variable` 被展开 ( expansion ) 了两次。在 CMake 3.1+ 版本中加入了一个新的特性 ( «policy:CMP0054» ) ，CMake 不会再展开已经被引号括起来的展开变量。也就是说，如果你的 CMake 版本大于 `3.1` ，那么你可以这么写：


```cmake
if("${variable}")
    # True if variable is not false-like
else()
    # Note that undefined variables would be `""` thus false
endif()
```

这里还有一些关键字可以设置，例如：

* 一元的: `NOT`, `TARGET`, `EXISTS` (文件), `DEFINED`, 等。

* 二元的: `STREQUAL`, `AND`, `OR`, `MATCHES` ( 正则表达式 ), `VERSION_LESS`, `VERSION_LESS_EQUAL` ( CMake 3.7+ ), 等。

* 括号可以用来分组


## «cmake:generator-expressions»


«cmake:generator-expressions» 语句十分强大，不过有点奇怪和专业 ( specialized ) 。大多数 CMake 命令在配置的时候执行，包括我们上面看到的 `if` 语句。但是如果你想要他们在构建或者安装的时候运行呢，应该怎么写？ 生成器表达式就是为此而生[^1]。它们在目标属性中被评估（ evaluate ）：

最简单的生成器表达式是信息表达式，其形式为 `$<KEYWORD>`；它会评估和当前配置相关的一系列信息。信息表达式的另一个形式是 `$<KEYWORD:value>`，其中 `KEYWORD` 是一个控制评估的关键字，而 `value` 则是被评估的对象（ 这里的 `value` 中也允许使用信息表达式，如下面的 `${CMAKE_CURRENT_SOURCE_DIR}/include` ）。如果 `KEYWORD` 是一个可以被评估为0或1的生成器表达式或者变量，如果（`KEYWORD`被评估）为1则 `value` 会在这里被保留下来，而反之则不会。你可以使用嵌套的生成器表达式，你也可以使用变量来使得自己更容易理解嵌套的变量。一些表达式也可以有多个值，值之间通过逗号分隔[^2]。


如果你有一个只想在配置阶段的 DEBUG 模式下开启的编译标志（ flag ），你可以这样做：

```
target_compile_options(MyTarget PRIVATE "$<$<CONFIG:Debug>:--my-flag>")
```

{% hint style='info' %}

译者注：这里有点迷惑性，这里其实包含了两种 generator-expression，分别是 configuration-expression 和 conditional-expression，前者使用的形式是 `$<CONFIG:cfgs>`，这里的 cfgs 是一个 List，如果 CONFIG 满足 cfgs 列表中的任何一个值，这个表达式会被评估（evaluate）为 1，否则为 0。后者使用的形式是 `$<condition:true_string>`，如果 condition 值为 1，则表达式被评估为 true_string，否则为空值。因此这里表达的含义是，如果这里是一个 DEBUG 的 configuration，就设置 --my-flag。可参见[官方文档](https://cmake.org/cmake/help/latest/manual/cmake-generator-expressions.7.html#genex:condition)。

{% endhint %}

这是一个相比与指定一些形如 `*_DEBUG` 这样的变量更加新颖并且更加优雅的方式，并且这对所有支持生成器表达式的设置都通用。需要注意的是，你永远不要在配置阶段（configuration phase）使用配置有关值（configure time value），因为在使用像 IDE 这种多配置生成器时你没法在配置阶段获取到这些值，只有在构建阶段使用生成器表达式或者形如 `*_<CONFIG>` 的变量才能获得。

一些生成器表达式的其他用途：

+ 限制某个项目的语言，例如可以限制其语言为 CXX 来避免它和 CUDA 等语言混在一起，或者可以通过封装它来使得他对不同的语言有不同的表现。
+ 获得与属性相关的配置，例如文件的位置。
+ 为构建和安装生成不同的位置。

最后一个是常见的。你几乎会在所有支持安装的软件包中看到如下代码：

{% hint style='info' %}

译者注：表示在目标对于直接 BUILD 使用的目标包含的头文件目录为 `${CMAKE_CURRENT_SOURCE_DIR}/include`，而安装的目标包含的头文件目录为 `include`，是一个相对位置（同时需要 install 对应的头文件才可以）。

{% endhint %}

```cmake
target_include_directories(
    MyTarget
  PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
    $<INSTALL_INTERFACE:include>
)
```

## 宏定义与函数

你可以轻松地定义你自己的 CMake «command:`function`» 或 «command:`macro`» 。函数和宏只有作用域上存在区别，宏没有作用域的限制。所以说，如果你想让函数中定义的变量对外部可见，你需要使用 `PARENT_SCOPE` 来改变其作用域。如果是在嵌套函数中，这会变得异常繁琐，因为你必须在想要变量对外的可见的所有函数中添加 `PARENT_SCOPE` 标志。但是这样也有好处，函数不会像宏那样对外“泄漏”所有的变量。接下来用函数举一个例子：

下面是一个简单的函数的例子：

```cmake
function(SIMPLE REQUIRED_ARG)
    message(STATUS "Simple arguments: ${REQUIRED_ARG}, followed by ${ARGN}")
    set(${REQUIRED_ARG} "From SIMPLE" PARENT_SCOPE)
endfunction()

simple(This Foo Bar)
message("Output: ${This}")
```

输出如下：

```
-- Simple arguments: This, followed by Foo;Bar
Output: From SIMPLE
```


如果你想要有一个指定的参数，你应该在列表中明确的列出，除此之外的所有参数都会被存储在 `ARGN` 这个变量中（  `ARGV` 中存储了所有的变量，包括你明确列出的 ）。CMake 的函数没有返回值，你可以通过设定变量值的形式来达到同样地目的。在上面的例子中，你可以通过指定变量名来设置一个变量的值。


## 参数的控制

你应该已经在很多 CMake 函数中见到过，CMake 拥有一个变量命名系统。你可以通过 «command:`cmake_parse_arguments`» 函数来对变量进行命名与解析。如果你想在低于 3.5 版本的CMake 系统中使用它，你应该包含 «module:CMakeParseArguments» 模块，此函数在 CMake 3.5 之前一直存在与上述模块中。这是使用它的一个例子：

```cmake
function(COMPLEX)
    cmake_parse_arguments(
        COMPLEX_PREFIX
        "SINGLE;ANOTHER"
        "ONE_VALUE;ALSO_ONE_VALUE"
        "MULTI_VALUES"
        ${ARGN}
    )
endfunction()

complex(SINGLE ONE_VALUE value MULTI_VALUES some other values)
```

在调用这个函数后，会生成以下变量：

```cmake
COMPLEX_PREFIX_SINGLE = TRUE
COMPLEX_PREFIX_ANOTHER = FALSE
COMPLEX_PREFIX_ONE_VALUE = "value"
COMPLEX_PREFIX_ALSO_ONE_VALUE = <UNDEFINED>
COMPLEX_PREFIX_MULTI_VALUES = "some;other;values"
```

如果你查看了官方文档，你会发现可以通过 set 来避免在 list 中使用分号，你可以根据个人喜好来确定使用哪种结构。你可以在上面列出的位置参数中混用这两种写法。此外，其他剩余的参数（因此参数的指定是可选的）都会被保存在 `COMPLEX_PREFIX_UNPARSED_ARGUMENTS` 变量中。

[^1]: 他们看起来像是在构建或安装时被评估的，但实际上他们只对每个构建中的配置进行评估。
[^2]: CMake 官方文档中将表达式分为信息表达式，逻辑表达式和输出表达式。
