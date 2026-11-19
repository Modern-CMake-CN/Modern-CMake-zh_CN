# Do's and Don'ts

The next two lists are heavily based on the excellent gist [Effective Modern CMake]. That list is much longer and more detailed, feel free to read it as well.

## CMake Antipatterns

- **Do not use global functions**: This includes `link_directories`, `include_directories`, and similar.
- **Don't add unneeded PUBLIC requirements**: You should avoid forcing something on users that is not required (`-Wall`). Make these PRIVATE instead.
- **Don't GLOB files**: Make or another tool will not know if you add files without rerunning CMake. Note that CMake 3.12 adds a `CONFIGURE_DEPENDS` flag that makes this far better if you need to use it.
- **Don't link to built files directly**: Always link to targets if available.
- **Never skip PUBLIC/PRIVATE when linking**: This causes all future linking to be keyword-less.

## CMake Patterns

- **Treat CMake as code**: It is code. It should be as clean and readable as all other code.
- **Think in targets**: Your targets should represent concepts. Make an (IMPORTED) INTERFACE target for anything that should stay together and link to that.
- **Export your interface**: You should be able to run from build or install.
- **Write a Config.cmake file**: This is what a library author should do to support clients.
- **Make ALIAS targets to keep usage consistent**: Using `add_subdirectory` and `find_package` should provide the same targets and namespaces.
- **Combine common functionality into clearly documented functions or macros**: Functions are better usually.
- **Use lowercase function names**: CMake functions and macros can be called lower or upper case. Always use lower case. Upper case is for variables.
- **Use `cmake_policy` and/or range of versions**: Policies change for a reason. Only piecemeal set OLD policies if you have to.

## Selecting a minimum in 2026:

What minimum CMake should you _run_ locally, and what minimum should you _support_ for people using your
code? Since you are reading this, you should be able to get a release in the last few versions of CMake;
do that, it will make your development easier. For support, there are two ways to pick minimums: based on
features added (which is what a developer cares about), or on common pre-installed CMakes (which is what a
user cares about).

Never select a minimum version older than the oldest compiler you support. CMake should always be
at least as new as the CMake that supported your oldest compiler.

### What minimum to choose - OS support:

- 3.19: First to support Apple Silicon.
- 3.22: Ubuntu 22.04, Amazon Linux 2023.
- 3.25: Debian 12 (11 backports)
- 3.26: Rocky Linux 9, AlmaLinux 9 (3.31 in current point releases)
- 3.28: Ubuntu 24.04.
- 3.30: Rocky Linux 10, AlmaLinux 10, CentOS Stream 10 (3.31 in current updates)
- 3.31: Debian 13 (12 backports)
- latest: pip/conda-forge/Homebrew/Chocolatey, etc.

### What minimum to choose - Features:

- 3.11: `IMPORTED INTERFACE` setting, faster, FetchContent, `COMPILE_LANGUAGE` in IDEs
- 3.12: C++20, `cmake --build build -j N`, `SHELL:`, FindPython
- 3.14/3.15: CLI, FindPython updates
- 3.16: Unity builds / precompiled headers, CUDA meta features
- 3.17/3.18: Lots more CUDA, metaprogramming, FindPython updates
- 3.19: Presets
- 3.20: C++23, `cmake_path`
- 3.24: Package finder
- 3.25: Blocks for scoping
- 3.28: C++20 modules
- 3.29: Build before test target
- 3.30: Full C++26 support

[effective modern cmake]: https://gist.github.com/mbinna/c61dbb39bca0e4fb7d1f73b0d66a4fd1
