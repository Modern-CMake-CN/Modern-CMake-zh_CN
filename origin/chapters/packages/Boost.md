# Boost library

Boost has shipped its own CMake configuration file, `BoostConfig.cmake`, since Boost 1.70. CMake used to provide a [FindBoost] module as well, but it has not kept up and was disabled in CMake 3.30 (policy [CMP0167]); on current CMake, `find_package(Boost)` simply uses the config file Boost installs. A nice consequence of config mode is that Boost describes its own targets and dependencies, so it doesn't matter if your Boost is newer than your CMake.

You can customize which flavor of the libraries gets selected using a set of variables that you set before searching for Boost; here are the three most common ones:

```cmake
set(Boost_USE_STATIC_LIBS OFF)
set(Boost_USE_MULTITHREADED ON)
set(Boost_USE_STATIC_RUNTIME OFF)
```

The imported targets are in the `Boost::` namespace. `Boost::headers` is the header-only part (it was called `Boost::boost` historically). The compiled libraries, like `Boost::filesystem`, are available as well, and pull in their dependencies as needed.

Here is an example for using the Boost.Filesystem library:

```cmake
find_package(Boost 1.70 REQUIRED COMPONENTS filesystem)
message(STATUS "Boost version: ${Boost_VERSION}")

target_link_libraries(MyExeOrLibrary PUBLIC Boost::filesystem)
```

[cmp0167]: https://cmake.org/cmake/help/latest/policy/CMP0167.html
[findboost]: https://cmake.org/cmake/help/v3.29/module/FindBoost.html
