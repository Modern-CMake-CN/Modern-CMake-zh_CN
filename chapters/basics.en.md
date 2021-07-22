# Introduction to the basics


## Minimum Version

Here's the first line of every `CMakeLists.txt`, which is the required name of
the file CMake looks for:

```cmake
cmake_minimum_required(VERSION 3.1)
```

Let's mention a bit of CMake syntax. The command name
«command:`cmake_minimum_required`» is case insensitive, so the common practice
is to use lower case. [^1] The `VERSION` is a special keyword for this
function. And the value of the version follows the keyword. Like everywhere in
this book, just click on the command name to see the official documentation,
and use the dropdown to switch documentation between CMake versions.

This line is special! [^2] The version of CMake will also dictate the policies,
which define behavior changes. So, if you set `minimum_required` to `VERSION
2.8`, you'll get the wrong linking behavior on macOS, for example, even in the
newest CMake versions. If you set it to 3.3 or less, you'll get the wrong
hidden symbols behaviour, etc. A list of policies and versions is available at
«cmake:policies».

Starting in CMake 3.12, this supports a range, such as `VERSION 3.1...3.15`;
this means you support as low as 3.1 but have also tested it with the new
policy settings up to 3.15. This is much nicer on users that need the better
settings, and due to a trick in the syntax, it's backward compatible with older
versions of CMake (though actually running CMake 3.1-3.11 will only set the 3.1
version of the policies in this example, since those versions didn't treat this
specially). New versions of policies tend to be most important for macOS and
Windows users, who also usually have a very recent version of CMake.

This is what new projects should do:

```cmake
cmake_minimum_required(VERSION 3.7...3.21)

if(${CMAKE_VERSION} VERSION_LESS 3.12)
    cmake_policy(VERSION ${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION})
endif()
```

If CMake version is less than 3.12, the if block will be true, and the policy
will be set to the current CMake version. If CMake is 3.12 or higher, the if
block will be false, but the new syntax in `cmake_minimum_required` will be
respected and this will continue to work properly!

WARNING: MSVC's CMake server mode [originally had a
bug](https://github.com/fmtlib/fmt/issues/809) in reading this format, so if
you need to support non-command line Windows builds for older MSVC versions,
you will want to do this instead:

```cmake
cmake_minimum_required(VERSION 3.7)

if(${CMAKE_VERSION} VERSION_LESS 3.21)
    cmake_policy(VERSION ${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION})
else()
    cmake_policy(VERSION 3.21)
endif()
```


{% hint style='info' %}
If you really need to set to a low value here, you can use
«command:`cmake_policy`» to conditionally increase the policy level or set a
specific policy. Please at least do this for your macOS users!
{% endhint %}


## Setting a project

Now, every top-level CMake file will have the next line:

```cmake
project(MyProject VERSION 1.0
                  DESCRIPTION "Very nice project"
                  LANGUAGES CXX)
```

Now we see even more syntax. Strings are quoted, whitespace doesn't matter, and
the name of the project is the first argument (positional). All the keyword
arguments here are optional. The version sets a bunch of variables, like
`MyProject_VERSION` and `PROJECT_VERSION`. The languages are `C`, `CXX`,
`Fortran`, `ASM`, `CUDA` (CMake 3.8+), `CSharp` (3.8+), and `SWIFT` (CMake
3.15+ experimental). `C CXX` is the default. In CMake 3.9, `DESCRIPTION` was
added to set a project description, as well. The documentation for
«command:`project`» may be helpful.

{% hint style='info' %}
You can add
[comments](https://cmake.org/cmake/help/latest/manual/cmake-language.7.html#comments)
with the `#` character. CMake does have an inline syntax for comments too, but
it's rarely used.
{% endhint %}

There's really nothing special about the project name. No targets are added at this point.

## Making an executable

Although libraries are much more interesting, and we'll spend most of our time
with them, let's start with a simple executable.

```cmake
add_executable(one two.cpp three.h)
```

There are several things to unpack here. `one` is both the name of the executable file generated, and the name of the CMake target created (you'll hear a lot more about targets soon, I promise). The source file list comes next, and you can list as many as you'd like. CMake is smart, and will only compile source file extensions. The headers will be, for most intents and purposes, ignored; the only reason to list them is to get them to show up in IDEs. Targets show up as folders in many IDEs. More about the general build system and targets is available at «cmake:buildsystem».


## Making a library

Making a library is done with «command:`add_library`», and is just about as simple:

```cmake
add_library(one STATIC two.cpp three.h)
```

You get to pick a type of library, STATIC, SHARED, or MODULE. If you leave this choice off, the value of `BUILD_SHARED_LIBS` will be used to pick between STATIC and SHARED.

As you'll see in the following sections, often you'll need to make a fictional target, that is, one where nothing needs to be compiled, for example, for a header-only library. That is called an INTERFACE library, and is another choice; the only difference is it cannot be followed by filenames.

You can also make an `ALIAS` library with an existing library, which simply gives you a new name for a target. The one benefit to this is that you can make libraries with `::` in the name (which you'll see later). [^3]

## Targets are your friend

Now we've specified a target, how do we add information about it? For example, maybe it needs an include directory:

```cmake
target_include_directories(one PUBLIC include)
```

«command:`target_include_directories» adds an include directory to a target. `PUBLIC` doesn't mean much for an executable; for a library it lets CMake know that any targets that link to this target must also need that include directory. Other options are `PRIVATE` (only affect the current target, not dependencies), and `INTERFACE` (only needed for dependencies).

We can then chain targets:

```cmake
add_library(another STATIC another.cpp another.h)
target_link_libraries(another PUBLIC one)
```

«command:`target_link_libraries`» is probably the most useful and confusing command in CMake. It takes a target (`another`) and adds a dependency if a target is given. If no target of that name (`one`) exists, then it adds a link to a library called `one` on your path (hence the name of the command). Or you can give it a full path to a library. Or a linker flag. Just to add a final bit of confusion, classic CMake allowed you to skip the keyword selection of `PUBLIC`, etc. If this was done on a target, you'll get an error if you try to mix styles further down the chain.

Focus on using targets everywhere, and keywords everywhere, and you'll be fine.

Targets can have include directories, linked libraries (or linked targets), compile options, compile definitions, compile features (see the C++11 chapter), and more. As you'll see in the two including projects chapters, you can often get targets (and always make targets) to represent all the libraries you use. Even things that are not true libraries, like OpenMP, can be represented with targets. This is why Modern CMake is great!


## Dive in

See if you can follow the following file. It makes a simple C++11 library and a program using it. No dependencies. I'll discuss more C++ standard options later, using the CMake 3.8 system for now.

```cmake
cmake_minimum_required(VERSION 3.8)

project(Calculator LANGUAGES CXX)

add_library(calclib STATIC src/calclib.cpp include/calc/lib.hpp)
target_include_directories(calclib PUBLIC include)
target_compile_features(calclib PUBLIC cxx_std_11)

add_executable(calc apps/calc.cpp)
target_link_libraries(calc PUBLIC calclib)

```


[^1]: In this book, I'll mostly avoid showing you the wrong way to do things; you can find plenty of examples of that online. I'll mention alternatives occasionally, but these are not recommended unless they are absolutely necessary; often they are just there to help you read older CMake code.

[^2]: You will sometimes see `FATAL_ERROR` here, that was needed to support nice failures when running this in CMake <2.6, which should not be a problem anymore.

[^3]: The `::` syntax was originally intended for `INTERFACE IMPORTED` libraries, which were explicitly supposed to be libraries defined outside the current project. But, because of this, most of the `target_*` commands don't work on `IMPORTED` libraries, making them hard to set up yourself. So don't use the `IMPORTED` keyword for now, and use an `ALIAS` target instead; it will be fine until you start exporting targets. This limitation was fixed in CMake 3.11.
