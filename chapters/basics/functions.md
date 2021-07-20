# Programming in CMake

## Control flow

CMake has an «command:`if`» statement, though over the years it has become rather complex. There are a series of all caps keywords you can use inside an if statement, and you can often refer to variables by either directly by name or using the `${}` syntax (the if statement historically predates variable expansion). An example if statement:

```cmake
if(variable)
    # If variable is `ON`, `YES`, `TRUE`, `Y`, or non zero number
else()
    # If variable is `0`, `OFF`, `NO`, `FALSE`, `N`, `IGNORE`, `NOTFOUND`, `""`, or ends in `-NOTFOUND`
endif()
# If variable does not expand to one of the above, CMake will expand it then try again
```

Since this can be a little confusing if you explicitly put a variable expansion, like `${variable}`, due to the potential expansion of an expansion, a policy («policy:CMP0054») was added in CMake 3.1+ that keeps a quoted expansion from being expanded yet again. So, as long as the minimum version of CMake is 3.1+, you can do:

```cmake
if("${variable}")
    # True if variable is not false-like
else()
    # Note that undefined variables would be `""` thus false
endif()
```

There are a variety of keywords as well, such as:

* Unary: `NOT`, `TARGET`, `EXISTS` (file), `DEFINED`, etc.
* Binary: `STREQUAL`, `AND`, `OR`, `MATCHES` (regular expression), `VERSION_LESS`, `VERSION_LESS_EQUAL` (CMake 3.7+), etc.
* Parentheses can be used to group


## «cmake:generator-expressions»

«cmake:generator-expressions» are really powerful, but a bit odd and specialized. Most CMake commands happen at configure time, include the if statements seen above. But what if you need logic to occur at build time or even install time? Generator expressions were added for this purpose.[^1] They are evaluated in target properties.

The simplest generator expressions are informational expressions, and are of the form `$<KEYWORD>`; they evaluate to a piece of information relevant for the current configuration. The other form is `$<KEYWORD:value>`, where `KEYWORD` is a keyword that controls the evaluation, and value is the item to evaluate (an informational expression keyword is allowed here, too). If KEYWORD is a generator expression or variable that evaluates to 0 or 1, `value` is substituted
if 1 and not if 0. You can nest generator expressions, and you can use variables to make reading nested variables bearable. Some
expressions allow multiple values, separated by commas.[^2]

If you want to put a compile flag only for the DEBUG configuration, for example, you could do:

```
target_compile_options(MyTarget PRIVATE "$<$<CONFIG:Debug>:--my-flag>")
```

This is a newer, better way to add things than using specialized `*_DEBUG` variables, and generalized to all the things generator expressions support. Note that you should never, never use the configure time value for the current configuration, because multi-configuration generators like IDEs do not have a "current" configuration at configure time, only at build time through generator expressions and custom `*_<CONFIG>` variables.

Other common uses for generator expressions:

* Limiting an item to a certain language only, such as CXX, to avoid it mixing with something like CUDA, or wrapping it so that it is different depending on target language.
* Accessing configuration dependent properties, like target file location.
* Giving a different location for build and install directories.

That last one is very common. You'll see something like this in almost every package that supports installing:

```cmake
target_include_directories(
    MyTarget
  PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
    $<INSTALL_INTERFACE:include>
)
```

## Macros and Functions

You can define your own CMake «command:`function`» or «command:`macro`» easily. The only difference between a function and a macro is scope; macros don't have one. So, if you set a variable in a function and want it to be visible outside, you'll need `PARENT_SCOPE`. Nesting functions therefore is a bit tricky, since you'll have to explicitly set the variables you want visible to the outside world to `PARENT_SCOPE` in each function. But, functions don't "leak" all their variables like macros do. For the
following examples, I'll use functions.

An example of a simple function is as follows:

```cmake
function(SIMPLE REQUIRED_ARG)
    message(STATUS "Simple arguments: ${REQUIRED_ARG}, followed by ${ARGN}")
    set(${REQUIRED_ARG} "From SIMPLE" PARENT_SCOPE)
endfunction()

simple(This Foo Bar)
message("Output: ${This}")
```

The output would be:

```
-- Simple arguments: This, followed by Foo;Bar
Output: From SIMPLE
```

If you want positional arguments, they are listed explicitly, and all other arguments are collected in `ARGN` (`ARGV` holds all arguments, even the ones you list). You have to work around the fact that CMake does not have return values by setting variables. In the example above, you can explicitly give a variable name to set.

## Arguments

CMake has a named variable system that you've already seen in most of the build in CMake functions. You can use it with the «command:`cmake_parse_arguments`» function. If you want to support a version of CMake less than 3.5, you'll want to also include the «module:CMakeParseArguments» module, which is where it used to live before becoming a built in command. Here is an example of how to use it:

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

Inside the function after this call, you'll find:

```cmake
COMPLEX_PREFIX_SINGLE = TRUE
COMPLEX_PREFIX_ANOTHER = FALSE
COMPLEX_PREFIX_ONE_VALUE = "value"
COMPLEX_PREFIX_ALSO_ONE_VALUE = <UNDEFINED>
COMPLEX_PREFIX_MULTI_VALUES = "some;other;values"
```

If you look at the official page, you'll see a slightly different method using set to avoid explicitly writing the semicolons in the list; feel free to use the structure you like best. You can mix it with the positional arguments listed above; any remaining arguments (therefore optional positional arguments) are in `COMPLEX_PREFIX_UNPARSED_ARGUMENTS`.


[^1]: They act as if they are evaluated at build/install time, though actually they are evaluated for each build configuration.
[^2]: The CMake docs splits expressions into Informational, Logical, and Output.
