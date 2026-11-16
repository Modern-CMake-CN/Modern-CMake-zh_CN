# C++ standards

CMake has excellent support for selecting the C++ standard, all the way through C++26. There are two recommended ways to do it: per-target compile features, and the standard variables/properties. Both have been around since well before this book's minimum CMake version, so use whichever fits.

## Meta compiler features

The most powerful way, with the nicest syntax and the best target behavior for mixing standards and options, is `target_compile_features` with a `cxx_std_*` meta-feature. Assuming you have a target named `myTarget`, it looks like this:

```cmake
target_compile_features(myTarget PUBLIC cxx_std_11)
set_target_properties(myTarget PROPERTIES CXX_EXTENSIONS OFF)
```

For the first line, you can pick from `cxx_std_11`, `cxx_std_14`, `cxx_std_17` (all CMake 3.8+), `cxx_std_20` (CMake 3.12+), `cxx_std_23` (CMake 3.20+), and `cxx_std_26` (CMake 3.25+). The second line is optional, but will avoid extensions being added; without it you'd get things like `-std=gnu++11` replacing `-std=c++11`. The first line even works on `INTERFACE` targets; only actual compiled targets can use the second line.

If a target further down the dependency chain specifies a higher C++ level, this interacts nicely; the standard is treated as a minimum, and the highest one requested wins.

:::{note}

CMake 3.1 originally supported granular compile features, like `cxx_constexpr`, that let you request individual language features instead of a standard ([list here](https://cmake.org/cmake/help/latest/prop_gbl/CMAKE_CXX_KNOWN_FEATURES.html)). This didn't scale; CMake stopped adding granular features after C++14, and the [docs](https://cmake.org/cmake/help/latest/manual/cmake-compile-features.7.html) now steer you to the `cxx_std_*` meta-features instead.

:::

## Global and property settings

The other way C++ standards are supported is a specific set of three properties (both global and target level). The global properties are:

```cmake
set(CMAKE_CXX_STANDARD 11 CACHE STRING "The C++ standard to use")
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
```

The first line sets a C++ standard level, and the second tells CMake to use it, and the final line is optional and ensures `-std=c++11` vs. something like `-std=gnu++11`. This method isn't bad for a final package, but shouldn't be used by a library. You should always set this as a cached variable, so you can override it to try a new version easily (or if this gets used as a library, this is the only way to override it - but again, don't use this for libraries). You can also set these values on a target:

```cmake
set_target_properties(myTarget PROPERTIES
    CXX_STANDARD 11
    CXX_STANDARD_REQUIRED YES
    CXX_EXTENSIONS NO
)
```

Which is better, but still doesn't have the sort of explicit control that compile features have for populating `PRIVATE` and `INTERFACE` properties, so it really is only useful on final targets.

You can find more information about these methods on [Craig Scott's useful blog post][crascit].

:::{danger}

Don't set manual flags yourself. You'll then become responsible for maintaining correct flags for every release of every compiler, error messages for unsupported compilers won't be useful, and some IDEs might not pick up the manual flags.

:::

[crascit]: https://crascit.com/2015/03/28/enabling-cxx11-in-cmake/
