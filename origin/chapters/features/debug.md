# Debugging code

You might need to debug your CMake build, or debug your C++ code. Both are covered here.

## CMake debugging

First, let's look at ways to debug a CMakeLists or other CMake file.

### Printing variables

The time honored method of print statements looks like this in CMake:

```cmake
message(STATUS "MY_VARIABLE=${MY_VARIABLE}")
```

However, a built in module makes this even easier:

```cmake
include(CMakePrintHelpers)
cmake_print_variables(MY_VARIABLE)
```

If you want to print out a property, this is much, much nicer! Instead of getting the properties one by one of of each target (or other item with properties, such as `SOURCES`, `DIRECTORIES`, `TESTS`, or `CACHE_ENTRIES` - global properties seem to be missing for some reason), you can simply list them and get them printed directly:

```cmake
cmake_print_properties(
    TARGETS my_target
    PROPERTIES POSITION_INDEPENDENT_CODE
)
```


### Tracing a run

Have you wanted to watch exactly what happens in your CMake file, and when? The `--trace-source="filename"` feature is fantastic. Every line run in the file that you give will be echoed to the screen when it is run, letting you follow exactly what is happening. There are related options as well, but they tend to bury you in output.

For example:

```bash
cmake -S . -B build --trace-source=CMakeLists.txt
```

If you add `--trace-expand`, the variables will be expanded into their values.


## Building in debug mode

For single-configuration generators, you can build your code with `-DCMAKE_BUILD_TYPE=Debug` to get debugging flags. In multi-configuration generators, like many IDEs, you can pick the configuration in the IDE. There are distinct flags for this mode (variables ending in `_DEBUG` as opposed to `_RELEASE`), as well as a generator expression value `CONFIG:Debug` or `CONFIG:Release`.

Once you make a debug build, you can run a debugger, such as gdb or lldb on it.
