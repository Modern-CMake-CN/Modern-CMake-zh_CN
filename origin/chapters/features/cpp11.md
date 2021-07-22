# C++11 and beyond

C++11 is supported by CMake. Really. Just not in CMake 2.8, because, guess what, C++11 didn't exist in 2009 when 2.0 was released. As long as you are using CMake 3.1 or newer, you should be fine, there are two different ways to enable support. And as you'll soon see, there's even better support in CMake 3.8+. I'll start with that, since this is Modern CMake.


## CMake 3.8+: Meta compiler features

As long as you can require that a user install CMake, you'll have access to the newest way to enable C++ standards. This is the most powerful way, with the nicest syntax and the best support for new standards, and the best target behavior for mixing standards and options. Assuming you have a target named `myTarget`, it looks like this:

```cmake
target_compile_features(myTarget PUBLIC cxx_std_11)
set_target_properties(myTarget PROPERTIES CXX_EXTENSIONS OFF)
```

For the first line, we get to pick between `cxx_std_11`,  `cxx_std_14`, and `cxx_std_17`. The second line is optional, but will avoid extensions being added; without it you'd get things like  `-std=g++11` replacing `-std=c++11`. The first line even works on `INTERFACE` targets; only actual compiled targets can use the second line.

If a target further down the dependency chain specifies a higher C++ level, this interacts nicely. It's really just a more advanced version of the following method, so it interacts nicely with that, too.



## CMake 3.1+: Compiler features

You can ask for specific compiler features to be available. This was more granular than asking for a C++ version, though it's a bit tricky to pick out just the features a package is using unless you wrote the package and have a good memory. Since this ultimately checks against a list of options CMake knows your compiler supports and picks the highest flag indicated in that list, you don't have to specify all the options you need, just the rarest ones. The syntax is identical to the section above, you just have a list of options to pick instead of `cxx_std_*` options. See the [whole list here](https://cmake.org/cmake/help/latest/prop_gbl/CMAKE_CXX_KNOWN_FEATURES.html).

If you have optional features, you can use the list `CMAKE_CXX_COMPILE_FEATURES` and use `if(... IN_LIST ...)` from CMake 3.3+ to see if that feature is supported, and add it conditionally. See [the docs here](https://cmake.org/cmake/help/latest/manual/cmake-compile-features.7.html) for other use cases.


## CMake 3.1+: Global and property settings

There is another way that C++ standards are supported; a specific set of three properties (both global and target level). The global properties are:

```cmake
set(CMAKE_CXX_STANDARD 11 CACHE STRING "The C++ standard to use")
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
```

The first line sets a C++ standard level, and the second tells CMake to use it, and the final line is optional and ensures `-std=c++11` vs. something like `-std=g++11`. This method isn't bad for a final package, but shouldn't be used by a library. You should always set this as a cached variable, so you can override it to try a new version easily (or if this gets used as a library, this is the only way to override it - but again, don't use this for libraries). You can also set these values on a target:

```cmake
set_target_properties(myTarget PROPERTIES
    CXX_STANDARD 11
    CXX_STANDARD_REQUIRED YES
    CXX_EXTENSIONS NO
)
```

Which is better, but still doesn't have the sort of explicit control that compiler features have for populating `PRIVATE` and `INTERFACE` properties, so it really is only useful on final targets.

You can find more information about the final two methods on [Craig Scott's useful blog post][crascit].

{% hint style='danger' %}
Don't set manual flags yourself. You'll then become responsible for mainting correct flags for every release of every compiler, error messages for unsupported compilers won't be useful, and some IDEs might not pick up the manual flags.
{% endhint %}

[crascit]: https://crascit.com/2015/03/28/enabling-cxx11-in-cmake/
