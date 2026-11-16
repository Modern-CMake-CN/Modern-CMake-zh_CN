# Minuit2

Minuit2 is available in standalone mode, for use in cases where ROOT is either not available or not built with Minuit2 enabled. This will cover recommended usages, as well as some aspects of the design.

## Usage

Minuit2 can be used in any of the standard CMake ways, either from the ROOT source or from a standalone source distribution:

```cmake
# Check for Minuit2 in ROOT if you want
# and then link to ROOT::Minuit2 instead

add_subdirectory(minuit2) # or root/math/minuit2
# OR
find_package(Minuit2 CONFIG) # Either build or install

target_link_libraries(MyProgram PRIVATE Minuit2::Minuit2)
```

## Development

Minuit2 is a good example of potential solutions to the problem of integrating a modern (CMake 3.1+) build into an existing framework.

To handle the two different CMake systems, the main `CMakeLists.txt` defines common options, then calls a `Standalone.cmake` file if this is not building as part of ROOT.

The hardest part in the ROOT case is that Minuit2 requires files that are outside the `math/minuit2` directory. This was solved by adding a `copy_standalone.cmake` file with a function that takes a filename list and then either returns a list of filenames inplace in the original source, or copies files into the local source and returns a list of the new locations, or returns just the list of new locations if the original source does not exist (standalone).

```bash
# Copies files into source directory
cmake /root/math/minuit2 -Dminuit2-standalone=ON

# Makes .tar.gz from source directory
make package_source

# Optional, clean the source directory
make purge
```

This is only intended for developers wanting to produce source packages - a normal user _does not pass this option_ and will not create source copies.

You can use `make install` or `make package` (binary packages) without adding this `standalone` option, either from inside the ROOT source or from a standalone package.

[minuit2]: https://root.cern.ch
