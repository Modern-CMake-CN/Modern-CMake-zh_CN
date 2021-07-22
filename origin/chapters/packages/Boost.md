# Boost library

The Boost library is included in the find packages that CMake provides, but it has a couple of oddities in how it works. See [FindBoost] for a full description; this will just give a quick overview and provide a recipe. Be sure to check the page for the minimum required version of CMake you are using and see what options you have.

First, you can customize the behavior of the Boost libraries selected using a set of variables that you set before searching for Boost. There are a growing number of settings, but here are the three most common ones:

```cmake
set(Boost_USE_STATIC_LIBS OFF)
set(Boost_USE_MULTITHREADED ON)
set(Boost_USE_STATIC_RUNTIME OFF)
```

In CMake 3.5, imported targets were added. These targets handle dependencies for you as well, so they are a very nice way to add Boost libraries. However, CMake has the dependency information baked into it for all known versions of Boost, so CMake must be newer than Boost for these to work. In a recent [merge request][MROldBoost], CMake started assuming that the dependencies hold from the last version it knows about, and will use that (along with giving a warning). This
functionality was backported into CMake 3.9.

The import targets are in the `Boost::` namespace. `Boost::boost` is the header only part. The other compiled libraries are available, and include dependencies as needed.

Here is an example for using the `Boost::filesystem` library:

```cmake
set(Boost_USE_STATIC_LIBS OFF)
set(Boost_USE_MULTITHREADED ON)
set(Boost_USE_STATIC_RUNTIME OFF)
find_package(Boost 1.50 REQUIRED COMPONENTS filesystem)
message(STATUS "Boost version: ${Boost_VERSION}")

# This is needed if your Boost version is newer than your CMake version
# or if you have an old version of CMake (<3.5)
if(NOT TARGET Boost::filesystem)
    add_library(Boost::filesystem IMPORTED INTERFACE)
    set_property(TARGET Boost::filesystem PROPERTY
        INTERFACE_INCLUDE_DIRECTORIES ${Boost_INCLUDE_DIR})
    set_property(TARGET Boost::filesystem PROPERTY
        INTERFACE_LINK_LIBRARIES ${Boost_LIBRARIES})
endif()

target_link_libraries(MyExeOrLibrary PUBLIC Boost::filesystem)
```



[FindBoost]: https://cmake.org/cmake/help/latest/module/FindBoost.html
[MROldBoost]: https://gitlab.kitware.com/cmake/cmake/merge_requests/1172
