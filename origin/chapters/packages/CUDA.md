# CUDA

CUDA support is available in two flavors. The new method, introduced in CMake 3.8 (3.9 for Windows), should be strongly preferred over the old, hacky method - I only mention the old method due to the high chances of an old package somewhere having it. Unlike the older languages, CUDA support has been rapidly evolving, and building CUDA is hard, so I would recommend you _require a very recent version_ of CMake! CMake 3.17 and 3.18 have a lot of improvements directly targeting CUDA.

A good resource for CUDA and Modern CMake is [this talk](https://web.archive.org/web/20240222053415/https://on-demand.gputechconf.com/gtc/2017/presentation/S7438-robert-maynard-build-systems-combining-cuda-and-machine-learning.pdf) by CMake developer Robert Maynard at GTC 2017.

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

To check to see if CUDA is available, use `check_language`:

```cmake
include(CheckLanguage)
check_language(CUDA)
```

You can see if CUDA is present by checking `CMAKE_CUDA_COMPILER` (was missing
until CMake 3.11).

You can check variables like `CMAKE_CUDA_COMPILER_ID` (for nvcc, this is
`"NVIDIA"`, Clang was added in CMake 3.18). You can check the version with
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

This is the easy part; as long as you use `.cu` for CUDA files, you can just add libraries _exactly like you normally would_.

You can also use separable compilation:

```cmake
set_target_properties(mylib PROPERTIES
                            CUDA_SEPARABLE_COMPILATION ON)
```

You can also directly make a PTX file with the `CUDA_PTX_COMPILATION` property.

### Targeting architectures

When you build CUDA code, you generally should be targeting an architecture. If you don't, you compile PTX for the lowest supported architecture, which provide the basic instructions but is compiled at runtime, making it potentially much slower to load.

All cards have an architecture level, like "7.2". You have two choices; the first is the code level; this will report to the code being compiled a version, like "5.0", and it will take advantage of all the features up to 5.0 but not past (assuming well written code / standard libraries). Then there's a target architecture, which must be equal or greater to the code architecture. This needs to have the same major number as your target card, and be equal to or less than the target card. So 7.0 would be a common choice for our 7.2 card. Finally, you can also generate PTX; this will work on all future cards, but will compile just in time.

In CMake 3.18, it became very easy to target architectures. If you have a version range that includes 3.18 or newer, you will be using `CMAKE_CUDA_ARCHITECTURES` variable and the `CUDA_ARCHITECTURES` property on targets. You can list values (without the `.`), like 50 for arch 5.0. This will generate for both the real ( SASS ) and virtual architecture ( PTX ). Passing values of '50-real' will only generate for SASS, while passing '50-virtual' will only generate for PTX. If set to OFF, it will not pass architectures.

In CMake 3.23, the architectures values were extended to support the user friendly values 'all' and 'all-major'; CMake 3.24 added 'native'.

### Working with targets

Using targets should work similarly to CXX, but there's a problem. If you include a target that includes compiler options (flags), most of the time, the options will not be protected by the correct includes (and the chances of them having the correct CUDA wrapper is even smaller). Here's what a correct compiler options line should look like:

```cmake
set(opt "$<$<BUILD_INTERFACE:$<COMPILE_LANGUAGE:CXX>>:-fopenmp>$<$<BUILD_INTERFACE:$<COMPILE_LANGUAGE:CUDA>>:-Xcompiler=-fopenmp>")
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

You can use
[`FindCUDAToolkit`](https://cmake.org/cmake/help/latest/module/FindCUDAToolkit.html)
to find a variety of useful targets and variables even without enabling the
CUDA language.

```cmake
cmake_minimum_required(VERSION 3.17)
project(example LANGUAGES CXX)

find_package(CUDAToolkit REQUIRED)
add_executable(uses_cublas source.cpp)
target_link_libraries(uses_cublas PRIVATE CUDA::cublas)
```

Variables that using `find_package(CUDAToolkit)` provides:

- `CUDAToolkit_BIN_DIR`: Directory that holds the `nvcc` executable
- `CUDAToolkit_INCLUDE_DIRS`: Lists of directories containing headers for built-in Thrust, etc
- `CUDAToolkit_LIBRARY_DIR`: Directory that holds the CUDA runtime library

Variables that enabling the `CUDA` language provides:

- `CMAKE_CUDA_COMPILER`: NVCC with location
- `CMAKE_CUDA_TOOLKIT_INCLUDE_DIRECTORIES`: Place for built-in Thrust, etc

:::{warning}

The classic FindCUDA module was deprecated for years and was finally removed in CMake 3.27 (policy [CMP0146](https://cmake.org/cmake/help/latest/policy/CMP0146.html)); on any modern CMake, `find_package(CUDA)` is a hard error. Before CMake 3.18, the following did still require FindCUDA:

- CUDA version checks / picking a version
- Architecture detection (Note: 3.12 fixes this partially)
- Linking to CUDA libraries from non-.cu files

:::

## Classic FindCUDA [WARNING: REMOVED in CMake 3.27] (for reference only)

The recipe below only works on CMake older than 3.27, since the module no longer exists after that. If you are stuck supporting such an old CMake, I recommend at least including the FindCUDA from CMake version 3.9 in your cmake folder (see the CLIUtils github organization for a [git repository](https://github.com/CLIUtils/cuda_support)). You'll want two features that were added: `CUDA_LINK_LIBRARIES_KEYWORD` and `cuda_select_nvcc_arch_flags`, along with the newer architectures and CUDA versions.

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
