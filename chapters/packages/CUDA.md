# CUDA

CUDA support is available in two flavors. The new method, introduced in CMake 3.8 (3.9 for Windows), should be strongly preferred over the old, hacky method - I only mention the old method due to the high chances of an old package somewhere having it. Unlike the older languages, CUDA support has been rapidly evolving, and building CUDA is hard, so I would recommend you *require a very recent version* of CMake! CMake 3.17 and 3.18 have a lot of improvements directly targeting CUDA.

A good resource for CUDA and Modern CMake is [this talk](http://on-demand.gputechconf.com/gtc/2017/presentation/S7438-robert-maynard-build-systems-combining-cuda-and-machine-learning.pdf) by CMake developer Robert Maynard at GTC 2017.


## Adding the CUDA Language

There are two ways to enable CUDA support. If CUDA is not optional:

```cmake
project(MY_PROJECT LANGUAGES CUDA CXX)
```

You'll probably want `CXX` listed here also. And, if CUDA is optional, you'll
want to put this in somewhere conditionally:

```cmake
enable_language(CUDA)
```

To check to see if CUDA is available, use CheckLanuage:

```cmake
include(CheckLanguage)
check_language(CUDA)
```

You can see if CUDA is present by checking `CMAKE_CUDA_COMPILER` (was missing
until CMake 3.11).

You can check variables like `CMAKE_CUDA_COMPILER_ID` (for nvcc, this is
`"NVIDIA"`, Clang was added in CMake 3.18).  You can check the version with
`CMAKE_CUDA_COMPILER_VERSION`.

## Variables for CUDA

Many variables with `CXX` in the name have a CUDA version with `CUDA` instead.
For example, to set the C++ standard required for CUDA,

```
if(NOT DEFINED CMAKE_CUDA_STANDARD)
    set(CMAKE_CUDA_STANDARD 11)
    set(CMAKE_CUDA_STANDARD_REQUIRED ON)
endif()
```

If you are looking for CUDA's standard level, in CMake 3.17 a new collection of
compiler features were added, like `cuda_std_11`. These have the same benefits that
you are already used to from the `cxx` versions.

### Adding a library / executable

This is the easy part; as long as you use `.cu` for CUDA files, you can just add libraries *exactly like you normally would*.

You can also use separable compilation:

```cmake
set_target_properties(mylib PROPERTIES
                            CUDA_SEPARABLE_COMPILATION ON)
```

You can also directly make a PTX file with the `CUDA_PTX_COMPILATION` property.

### Targeting architectures

When you build CUDA code, you generally should be targeting an architecture. If you don't, you compile 'ptx', which provide the basic instructions but is compiled at runtime, making it potentially much slower to load.

All cards have an architecture level, like "7.2". You have two choices; the first is the code level; this will report to the code being compiled a version, like "5.0", and it will take advantage of all the features up to 5.0 but not past (assuming well written code / standard libraries). Then there's a target architecture, which must be equal or greater to the code architecture. This needs to have the same major number as your target card, and be equal to or less than the target card. So 7.0 would be a common choice for our 7.2 card. Finally, you can also generate PTX; this will work on all future cards, but will compile just in time.

In CMake 3.18, it became very easy to target architectures. If you have a version range that includes 3.18 or newer, you will be using `CMAKE_CUDA_ARCHITECTURES` variable and the `CUDA_ARCHITECTURES` property on targets. You can list values (without the `.`), like 50 for arch 5.0. If set to OFF, it will not pass architectures.

### Working with targets

Using targets should work similarly to CXX, but there's a problem. If you include a target that includes compiler options (flags), most of the time, the options will not be protected by the correct includes (and the chances of them having the correct CUDA wrapper is even smaller). Here's what a correct compiler options line should look like:

```cmake
"$<$<BUILD_INTERFACE:$<COMPILE_LANGUAGE:CXX>>:-fopenmp>$<$<BUILD_INTERFACE:$<COMPILE_LANGUAGE:CUDA>>:-Xcompiler=-fopenmp>"
```

However, if you using almost any find_package, and using the Modern CMake methods of targets and inheritance, everything will break. I've learned that the hard way.

For now, here's a pretty reasonable solution, _as long as you know the un-aliased target name_. It's a function that will fix a C++ only target by wrapping the flags if using a CUDA compiler:

```cmake
function(CUDA_CONVERT_FLAGS EXISTING_TARGET)
    get_property(old_flags TARGET ${EXISTING_TARGET} PROPERTY INTERFACE_COMPILE_OPTIONS)
    if(NOT "${old_flags}" STREQUAL "")
        string(REPLACE ";" "," CUDA_flags "${old_flags}")
        set_property(TARGET ${EXISTING_TARGET} PROPERTY INTERFACE_COMPILE_OPTIONS
            "$<$<BUILD_INTERFACE:$<COMPILE_LANGUAGE:CXX>>:${old_flags}>$<$<BUILD_INTERFACE:$<COMPILE_LANGUAGE:CUDA>>:-Xcompiler=${CUDA_flags}>"
            )
    endif()
endfunction()
```

### Useful variables

* `CMAKE_CUDA_TOOLKIT_INCLUDE_DIRECTORIES`: Place for built-in Thrust, etc
* `CMAKE_CUDA_COMPILER`: NVCC with location

You can use
[`FindCUDAToolkit`](https://cmake.org/cmake/help/git-stage/module/FindCUDAToolkit.html)
to find a variety of useful targets and variables even without enabling the
CUDA language.

> ### Note that FindCUDA is deprecated, but for for versions of CMake < 3.18, the following functions required FindCUDA:
>
> * CUDA version checks / picking a version
> * Architecture detection (Note: 3.12 fixes this partially)
> * Linking to CUDA libraries from non-.cu files

## Classic FindCUDA [WARNING: DO NOT USE] (for reference only)

If you want to support an older version of CMake, I recommend at least including the FindCUDA from CMake version 3.9 in your cmake folder (see the CLIUtils github organization for a [git repository](https://github.com/CLIUtils/cuda_support)). You'll want two features that were added: `CUDA_LINK_LIBRARIES_KEYWORD` and `cuda_select_nvcc_arch_flags`, along with the newer architectures and CUDA versions.

To use the old CUDA support, you use `find_package`:

```cmake
find_package(CUDA 7.0 REQUIRED)
message(STATUS "Found CUDA ${CUDA_VERSION_STRING} at ${CUDA_TOOLKIT_ROOT_DIR}")
```

You can control the CUDA flags with `CUDA_NVCC_FLAGS` (list append) and you can control separable compilation with `CUDA_SEPARABLE_COMPILATION`. You'll also want to make sure CUDA plays nice and adds keywords to the targets (CMake 3.9+):

```cmake
set(CUDA_LINK_LIBRARIES_KEYWORD PUBLIC)
```

You'll also might want to allow a user to check for the arch flags of their current hardware:

```cmake
cuda_select_nvcc_arch_flags(ARCH_FLAGS) # optional argument for arch to add
```
