# Downloading Projects

## Downloading Method: build time

Until CMake 3.11, the primary download method for packages was done at build time. This causes several issues; most important of which is that `add_subdirectory` doesn't work on a file that doesn't exist yet! The built-in tool for this, ExternalProject, has to work around this by doing the build itself. (It can, however, build non-CMake packages as well).[^1]

[^1]: Note that ExternalData is the tool for non-package data.

## Downloading Method: configure time

If you prefer configure time, the modern answer is the built-in [FetchContent](fetch.md) module (CMake 3.11+, much improved in 3.14). If you are stuck supporting very old CMake, the [Crascit/DownloadProject](https://github.com/Crascit/DownloadProject) repository was a drop-in solution, but it has been superseded by FetchContent. Submodules work so well, though, that I've discontinued most of the downloads for things like GoogleTest and moved them to submodules. Auto downloads are harder to mimic if you
don't have internet access, and they are often implemented in the build directory, wasting time and space if you have multiple build directories.
