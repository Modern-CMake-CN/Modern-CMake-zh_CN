# What's new in CMake

This is an abbreviated version of the CMake changelog with just the highlights for authors. Names for each release are arbitrarily picked by the author.

## [CMake in development][cmake master]: WIP

CMake 4.5 is in development. Nothing major to report yet.

## [CMake 4.4][]: Diagnostics

This version introduces a structured diagnostics system that replaces the old
warning variables and flags, a `SOURCES` file set type, test discovery at test
time, and a batch of scripting conveniences.

- Initially released [July 14, 2026](https://www.kitware.com/cmake-4-4-0-available-for-download/)
- New `cmake_diagnostic()` command gives per-category, structured control over
  warnings (the `CMAKE_WARN_DEPRECATED`/`CMAKE_ERROR_DEPRECATED` variables and
  the `-W[no-][error=]dev` flags are now deprecated in favor of `author`)
- New `SOURCES` file set type for specifying a target's sources
- New `discover_tests()` command registers tests discovered at test time; Ninja
  gained `test_prep/<test-name>` targets, and ctest can forward extra arguments
  to tests after `--`
- `cmake_parse_arguments()` gained a `PARSE_ARGN` signature
- `list(FILTER)`, `list(SORT)`, and `list(TRANSFORM)` accept callback predicates/comparators
- `execute_process()` gained `ENVIRONMENT` and `ENVIRONMENT_MODIFICATION`
- `cmake --install` supports multiple components and parallel jobs
- `--presets-file` added to `cmake`, `ctest`, and `cpack` (also presets schema v12)
- `write_basic_package_version_file()` gained `SamePatchVersion`, `SameFullVersion`, and `SemanticVersion` compatibility modes
- CUDA 23 support (NVCC 13.3+); `clang-cl` gained C++20 named modules
- FindPython supports the Stable ABI for free-threaded Python
- `macro()` now preserves backslashes in arguments (CMP0219)

## [CMake 4.3][]: Package specifications

This version adds support for the Common Package Specification (CPS), a
language-agnostic package description format that packages can now produce and
consume instead of hand-written CMake config files. It also adds an
instrumentation framework for profiling your configure and build steps.

- Initially released [March 17, 2026](https://www.kitware.com/cmake-4-3-0-available-for-download/)
- [`find_package`](https://cmake.org/cmake/help/latest/command/find_package.html) can now search for and import CPS packages
- [`install`](https://cmake.org/cmake/help/latest/command/install.html) and [`export`](https://cmake.org/cmake/help/latest/command/export.html) gained a `PACKAGE_INFO` mode to generate CPS package descriptions
- [`project`](https://cmake.org/cmake/help/latest/command/project.html) gained `COMPAT_VERSION` and `SPDX_LICENSE` options
- New [cmake-instrumentation](https://cmake.org/cmake/help/latest/manual/cmake-instrumentation.7.html) facility collects timing and diagnostic data during configure/generate/build/test/install, viewable in CDash or as Google Trace Event files
- `cmake --build` now accepts a build directory and `--preset` together
- `cmake --version` can print JSON, and `cmake -E bin2c` was added
- Archive handling (`cmake -E tar`, `file(ARCHIVE_CREATE)`, CPack) gained multithreading, compression levels, and more compression methods
- `get_property`/`set_property` support a `FILE_SET` scope
- New string comparison and `$<STRING:...>` generator expressions, plus file set and source file queries
- FindRuby and FindSQLite3 now provide imported targets

## [CMake 4.2][]: Emscripten

This version adds native Emscripten cross-compile support. There are lots of
other smallish improvements too, like matching-case version variables from
`find_package`, controls for object files, direct cache manipulation, and more.

- Initially released [Nov 19, 2025](https://www.kitware.com/cmake-4-2-0-available-for-download/)
- File API updates (version 2.9), with more info on imported/interface targets
- Visual Studio 18 2026 added (14 2015 deprecated)
- Cross-compile support for Emscripten (WebAssembly)
- `cmake -E copy_if_newer` (and directory version) added
- `set(CACHE{<variable>}` (and `unset`) were added to directly manipulate the cache
- `string(REGEX QUOTE)` added (like `re.escape` in Python)
- New properties include `OBJECT_NAME` and `INSTALL_OBJECT_*` to control generated object files
- Matching case `<PackageName>_VERSION` variables added to all find modules
- NumPy no longer depends on Development.Module (CMP0201)
- ExternalProject can set environment variables

## [CMake 4.1][]: Bits of polish

This version improves the pkg-config integration, OPTIONAL for find commands,
and other small changes. This release seemed to be focused on polishing up
some edge cases.

- Initially released [August 5, 2025](https://www.kitware.com/cmake-4-1-0-available-for-download/)
- `cmake_pkg_config` now supports `IMPORT` and `POPULATE`.
- Some configure log improvements related to find commands.
- `CMAKE_FIND_REQUIRED` added, along with new OPTIONAL keywords for all find commands.
- `CMAKE_<LANG>_COMPILER_ARCHITECTURE_ID` now public, and filled in for most compilers.
- NVIDIA support added to FindBLAS and FindLAPACK
- FindPython modules now enforce consistency when cross-compiling (CMP0190)
- Some GNUInstallDirs changes gated by CMP0192 and CMP0193

## [CMake 4.0][]: Out with the old

This version removes support for setting the CMake policy below 3.5. This means
`cmake_minimum_required(VERSION 3.4)` is now an error, but
`cmake_minimum_required(VERSION 3.4...3.15)`, for example, is fine. Setting
this below 3.10 has been a warning for quite some time now. You can use
`CMAKE_POLICY_VERSION_MINIMUM` to work around third-party libraries that
haven't updated.

- Initially released [March 27, 2025](https://www.kitware.com/cmake-4-0-0-available-for-download/)
- A new `CMAKE_POLICY_VERSION_MINIMUM` variable to build old projects (support for <3.5 removed)
- Added a flag (`--project-file`) to control the `CMakeLists.txt` filename (for development only)
- Some new linker features, like `LINKER:` prefix and `CMAKE_LINK_WARNING_AS_ERROR`
- You can set the debugger working directory for targets
- FindPython can be run multiple times in a directory using new `Python_ARTIFACTS_PREFIX`
- Generator expressions can convert to `NATIVE_PATH`
- Visual Studio generators 2015/2017 work like the later ones now with platform selection
- macOS SDK selection simplified and less automatic

## [CMake 3.31][]: Better workflow presets

This release adds a collection of small features and additions, along with some
experimental new technology. Some updates to presets, including a new shorter
command for workflow presets.

- Initially released [November 6, 2024](https://www.kitware.com/cmake-3-31-0-available-for-download/)
- LFortran now supported
- `$comment` supported in preset files
- `cmake -LR <regex>` to search the cache
- `cmake --workflow <name>` now supported (one less argument)
- `codegen` target and `CODEGEN` in `add_custom_command`
- Added `cmake_pkg_config` command to extract values from pkg-config files.
- `CMAKE_HOST_EXECUTABLE_SUFFIX` was added
- Better CUDA support, including getting the host compiler and OpenMP
- Support for CMake 3.10 and older deprecated
- Lots of smaller tweaks and cleanup
- [Experimental](https://www.kitware.com/a-year-closer-to-standard-c-dependency-management/) CPS (common package specification) support

## [CMake 3.30][]: C++26

This release adds C++26 support and a way to get the latest supported standard
for a compiler. This release makes a lot of small changes not listed below,
like better TLS support, some generator expression updates, and some schema
updates.

- Initially released [July 2, 2024](https://www.kitware.com/cmake-3-30-0-available-for-download/)
- A `$<QUOTE>` generator expression was added to produce `"`
- C++26 compile features support fully implemented (partial since 3.25)
- `CMAKE_<LANG>_STANDARD_LATEST` holds the latest standard the current compiler supports
- Free-threaded Python 3.13+ support (3.30.3+ best)
- Better support (new variables and targets) for Windows Python debug builds, and `DEBUG_POSTFIX` now added by `python_add_library`
- FindBoost removed
- Visual Studio 2008 support removed

## [CMake 3.29][]: Build before testing

Finally you can make the `test` target depend on `ALL`, meaning `cmake --build
build -t test` will rebuild as needed! You have to opt-into this, though, by
setting `CMAKE_SKIP_TEST_ALL_DEPENDENCY` to false. Several improvements were
made for scripting, linker selection, and support was improved for various
compiler combinations on Windows.

- Initially released [March 21, 2024](https://www.kitware.com/cmake-3-29-0-available-for-download/)
- Linker selection option (`CMAKE_LINKER_TYPE`/`LINKER_TYPE`)
- `CMAKE_INSTALL_PREFIX` can now be initialized by a matching environment variable
- If commands to check file permissions
- Select launcher for tests (`CMAKE_TEST_LAUNCHER`/`TEST_LAUNCHER`)
- You can now make tests depend on `all` with `CMAKE_SKIP_TEST_ALL_DEPENDENCY` set to `FALSE`!
- `cmake_language(EXIT)` for scripts with exit codes
- Select Intel OneAPI Fortran compiler with Visual Studio
- Compile CUDA on Windows with Clang

## [CMake 3.28][]: C++20 modules

This release adds [C++ module](https://cmake.org/cmake/help/latest/manual/cmake-cxxmodules.7.html)
support. This does not include C++23's `import std`, but is exciting step
forward for this landmark C++20 feature. These will be scanned by default if
using C++20+ and a new enough compiler and valid generator and if you have a
CMake minimum or maximum that includes CMake 3.28.

- Initially released [December 6, 2023](https://www.kitware.com/cmake-3-28-0-available-for-download/)
- C++20 named modules supported by Ninja 1.11+ and MSVC 17.4+.
- `HIP` supported for NVIDIA.
- Apple's VisionOS added.
- `CMAKE_CROSSCOMPILING_EMULATOR` environment variable added.
- Get/set properties TEST supports other DIRECTORY's
- Some support for job servers added
- Support for passing variables to pkg-config
- Generator expressions now support short-circuting

## [CMake 3.27][]: Debugger

This release adds the new CMake debugger! This should improve support for
debugging your CMake code in something like VSCode. This release also
"removes" FindPythonLibs/FindPythonInterp/FindCUDA; if the min or max version
is set to 3.27 or higher, the modules will be missing.

- Initially released [July 19, 2023](https://www.kitware.com/cmake-3-27-0-available-for-download/)
- C++ Modules extensions (`.ccm`, `.cxxm`, `.c++m`) are treated as C++
- `COMPILE_ONLY`, `LIST`, and `PATH` generator expressions added, along with a few more specific ones.
- New `SKIP_LINTING`, as well as more generator expression support in things like `<LANG>_CPPCHECK`, etc.
- `find_package` now searches for uppercase `<PACKAGENAME>_ROOT` CMake/Environment variables.
- Added `add_custom_command(... DEPENDS_EXPLICIT_ONLY` & variable for Ninja dependency control.
- CMake build verbose now prints the working dir and command line used to build.
- Better support for versions of MSVC.
- Several new CUDA properties related to targeting .`cubin`/`.fatbin`/`.optixir`.
- Setting `cmake_minimum_required` less than 3.5 is now deprecated.
- FindCUDA semi-removed, use CUDA language and FindCUDAToolkit.
- FindPythonLibs & FindPythonInterp semi-removed, use FindPython.

## [CMake 3.26][]: Logging & Python

Two important additions for FindPython, PyPy SOABI support & LimitedAPI/StableABI support, really enhance FindPython's use. There are quite
a few nice fixes and new warnings, such as if you reverse the order of `project()` and `cmake_minimum_required()`. Logging has been moved
from `CMakeOutput.log` and `CMakeError.log` to a new `CMakeConfigureLog.yaml` log.

- Initially released [March 14, 2023](https://www.kitware.com/cmake-3-26-0-available-for-download/)
- FindPython generates the correct PyPy SOABI (finally!)
- FindPython supports LimitedAPI/StableABI with a new flag.
- CMake has a new YAML log of configure time checks in the output directory (also `message(CONFIGURE_LOG ...)`).
- `ASM_MARMASM` language added for Microsoft ARM assembler.
- `CMAKE_VS_VERSION_BUILD_NUMBER` added for the VS version number.
- `USE_FOLDERS` is on by default
- `"<LANG>_CLANG_TIDY_EXPORT_FIXES_DIR"` for clang-tidy suggested fix output.
- CMake's copy CLI tool supports updates only if different
- `target_compile_options` now come after `target_compile_features` / `CMAKE_<LANG>_STANDARD`

## [CMake 3.25][]: Blocks and SYSTEM

CMake has new block scoping commands selectively controlling variables and
policies. It also has a lot more control over SYSTEM. The functional features
of CMake introduced a few releases ago are now usable in `find_` commands with
`VALIDATOR`. Workflows got an upgrade, too.

- Initially released [November 16, 2022](https://www.kitware.com/cmake-3-25-0-available-for-download/)
- C++26 support
- LTO for CUDA with nvcc
- Workflow presets added, package presets too.
- `SYSTEM` added to `add_subdirectory`, `FetchContent`, and as a directory property.
- `block()`/`endblock()` for policy/variable scopes, also `PROPAGATE` in `return()`
- `BSD` & `LINUX` variables added
- `VALIDATOR` function for `find_*` commands.
- Several improvements to `try_*` commands.
- `SYSTEM` target/directory property and `EXPORT_NO_SYSTEM` added, also for FetchContent.

## [CMake 3.24][]: Package Finder

This is a fantastic release. Package writers are getting integration between
`find_package` and `FetchContent` that will allow "download if missing"
workflows, and is configurable by packagers. Similarly, warnings as errors can
be set by a package and removed by packagers, as well (still make sure not to
do this unless you are being build as the main project!).

- Initially released [August 4, 2022](https://blog.kitware.com/cmake-3-24-0-is-available-for-download/)
- `--fresh` option removes the old cache when running.
- `find_package` and `FetchContent` now have integration - you have options to download missing dependencies.
- `find_package` has a new `GLOBAL` option.
- `CMAKE_PROJECT_TOP_LEVEL_INCLUDES` allows a user (like packagers) to inject pre-project code.
- `PATH` management for generator expressions.
- `CMAKE_COLOR_DIAGNOSTICS` env var & variable added, replacing `CMAKE_COLOR_MAKEFILE`.
- You can disable `find_*` searching the install prefix.
- `COMPILE_WARNING_AS_ERROR` property and `CMAKE_` variable, and `--compile-no-warning-as-error` to disable it.
- CUDA supports `native` to compile for the current GPUs detected.
- `SYSTEM` includes now are respected on MSVC generators.
- Better support for MSVC, XCode, and others.
- `LLVMFlang` compiler support.

## [CMake 3.23][]: Header only libraries

A solid release focused on header only libraries, more user control, CMake
presets, and better CUDA support. There are some powerful new features for
header only libraries, like the various `*_SETS` target properties. There are
new controls like the ability to restrict paths for `find_` commands and the
ability to remove `SYSTEM` from an existing target. You also get expanded
debugging features, and the ability to force all links to be to targets.
Presets can include other files. CUDA and C# received new updates, and a
couple of compilers were added.

- Initially released [March 29, 2022](https://blog.kitware.com/cmake-3-23-0-is-available-for-download/)
- CMake presets are a bit nicer, with the ability to include other files.
- A couple of new supported compilers, and better C# support.
- `FILE_SET` for `install` and `target_sources` header-only source files.
- `<INTERFACE_>HEADER_SETS`, `<INTERFACE_>HEADER_DIRS` for target headers.
- `CUDA_ARCHITECTURES` support for all and all-major.
- DEBUG messages from can be enabled for `find_*` or find modules.
- `define_property()` has a handy `INITIALIZE_FROM_VARIABLE` option.
- `CMAKE_<SYSTEM_>IGNORE_PREFIX_PATH` to control `find_*` commands.
- `<CMAKE_>LINK_LIBRARIES_ONLY_TARGETS` added to force only targets linked
  (nice for finding mistakes!).
- `IMPORTED_NO_SYSTEM`, a new property to forcibly remove SYSTEM from a target.
- `FindGTest` now adds a `GMock` target if found.

## [CMake 3.22][]: Handy env vars

A smaller release with some nice improvements all around focused on supporting
common build situations. You can finally set `CMAKE_BUILD_TYPE` in your
environment to set a default build type. There are several other new env vars
and variables too. Compiler flags related to standards have been improved.
`cmake_host_system_information` got improved further (from 3.10) with OS
information.

- Initially released [November 18, 2021](https://blog.kitware.com/cmake-3-22-0-available-for-download/)
- New environment variables for defaults, `CMAKE_BUILD_TYPE` and `CMAKE_CONFIGURATION_TYPES`
- New environment variable `CMAKE_INSTALL_MODE` for install types (symlinks)
- New `CMAKE_REQUIRE_FIND_PACKAGE_<PackageName>` variable to convert an optional find to a required one
- `CMAKE_<LANG>_EXTENSIONS_DEFAULT` comes from the compiler
- `CMakeDependentOption` uses normal conditional syntax now
- CTest can now modify environment variables
- Some generators now use external (system) markers on includes for MSVC

## [CMake 3.21][] : Colors

Different message types now have different colors! There's now a nice variable
to see if you are in the top level project. Lots of continued cleanup and
specialized new features, such as adding the HIP language and C17 and C23
support. Presets continue to be improved.

- Initially released [July 14, 2021](https://blog.kitware.com/cmake-3-21-0-available-for-download/)
- Preliminary support for MSVC 2022
- `CMAKE_<LANG>_LINKER_LAUNCHER` added for make and ninja
- HIP added as a language
- C17 and C23 support added
- `--install-prefix <dir>` and `--toolchain <file>` added when running CMake
- Messages printed are colored by message type!
- Support for MSYS, including `FindMsys`
- The `file(` command got several updates, including `EXPAND_TILDE`
- Support for runtime dependencies and artifacts added to `install`
- `PROJECT_IS_TOP_LEVEL` and `<PROJECT-NAME>_IS_TOP_LEVEL` finally added
- Caching improvements for the `find_` commands

## [CMake 3.20][] : Docs

The CMake docs received a major boost in productivity by adding "new in" tags
to quickly see what was added without having to toggle documentation versions!
C++ 23 support added. Source files must have the extension listed now, and
LANGUAGE is always respected. Quite a bit of cleanup was done; make sure your
code is tested with `...3.20` before deploying that as your maximum. Presets
continue to be improved.

- Initially released [March 23, 2021](https://blog.kitware.com/cmake-3-20-0-available-for-download/)
- Support added for C++23
- CUDAARCHS environment variable for setting CUDA architectures
- The new `IntelLLVM` compilers are now supported (OneAPI 2021.1), and `NVHPC` NVIDIA HPC SDK, as well
- Some expanded generator expression support in custom commands/targets, install renaming
- New `cmake_path` command for working with paths
- `try_run` now has a `WORKING_DIRECTORY`
- More features for the `file(GENERATE` command
- Several removals, like `cmake-server`, `WriteCompilerDetectionHeader` (if policy set to 3.20+), and a few things that have newer methods now.
- Source files must include the extension

## [CMake 3.19][] : Presets

You can now add presets in JSON form, and users will get the preset default.
`find_package` can now take a version range, and some specialty find modules,
like FindPython, have custom support for it. A lot of new controls were added
for permissions. Further support for generator expressions in more places.

- Initially released [November 18, 2020](https://blog.kitware.com/cmake-3-19-0-available-for-download/)
- New [CMake presets files](https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html) now supported - you can set defaults for your project per generator, or you can make User presets. PSA: Please add `CMakeUserPresets.json` to your `.gitignore`, even if you do not use `CMakePresets.json`.
- CMake now uses the new build system introduced in XCode 12+
- MSVC for Android now supported
- `cmake -E create_hardlink` was added
- `add_test` finally properly supports whitespace in test names
- You can now `DEFER` `cmake_language` to run at the end of the directory processing
- Lots of new `file` options, like temporary downloads and `COMPRESSION_LEVEL` for `ARCHIVE_CREATE`
- `find_package` supports a version range
- `DIRECTORY` can now include a binary directory in property commands
- New `JSON` commands for `string`
- New `OPTIMIZE_DEPENDENCIES` property and `CMAKE_*` variable for smartly dropping dependencies of static and object libraries.
- PCH support expanded with `PCH_INSTANTIATE_TEMPLATES` property and `CMAKE_*` variable.
- Check modules have been expanded with `CUDA` and `ISPC` languages
- FindPython: `Python*_LINK_OPTIONS` added
- `compute-sanitizer` for ctest now supports CUDA for memcheck

## [CMake 3.18][] : CUDA with Clang & CMake macro language

CUDA now supports Clang (without separable compilation). A new
`CUDA_ARCHITECTURES` property was implemented to better support targeting CUDA
hardware. A new `cmake_language` command supports calling cmake commands and
expressions from strings. Lots of other meta changes that could make new
designs available; calling functions by variable, evaluating arbitrary CMake by
string, and configure files directly from strings. Many other nice tiny
features and papercut fixes are sprinkled throughout, a small selection is below.

- Initially released [July 15, 2020](https://blog.kitware.com/cmake-3-18-0-available-for-download/)
- `cmake` can `cat` files together now
- New profiling mode for `cmake`
- `cmake_language` with `CALL` and `EVAL`
- `export` requires `APPEND` if used multiple times (in CMake language level 3.18+)
- You can archive directly from `file()`
- `file(CONFIGURE` is a nicer form of `configure_file` if you already have a string to produce
- Other `find_*` commands gain `find_package`'s `REQUIRED` flag
- `NATURAL` sorting in `list(SORT` added
- More options for handling properties with DIRECTORY scope
- `CUDA_ARCHITECTURES` was added
- New `LINK_LANGUAGE` generator expressions (`DEVICE`/`HOST` versions too)
- Source can be a subdirectory for `FetchContent`

## [CMake 3.17][] : More CUDA

A FindCUDAToolkit was finally added, which allows finding and using the CUDA
toolkit without enabling the CUDA language! CUDA now is a bit more configurable,
such as linking to shared libraries. Quite a bit more polish in the expected areas,
as well, like FindPython. Finally, you can now iterate over multiple lists at a time.

- Initially released [March 20, 2020](https://blog.kitware.com/cmake-3-17-0-available-for-download/)
- `CUDA_RUNTIME_LIBRARY` can finally be set to Shared!
- FindCUDAToolkit finally added
- `cmake -E rm` replaces older remove commands
- CUDA has meta features like `cuda_std_03`, etc.
- You can track the searches for packages with `--debug-find`
- ExternalProject can now disable recursive checkouts
- FindPython better integration with Conda
- DEPRECATION can be applied to targets
- CMake gained a rm command
- Several new environment variables
- foreach can now do `ZIP_LISTS` (multiple lists at a time)

## [CMake 3.16][] : Unity builds

A new unity build mode was added, allowing source files to be merged into a single build file. Support for
precompiled headers (possibly preparing for C++20 modules, perhaps?) was added. Lots of other smaller
fixes were implemented, especially to newer features, such as to FindPython, FindDoxygen, and others.

- Initially released [November 26, 2019](https://blog.kitware.com/cmake-3-16-0-available-for-download/)
- Added support for Objective C and Objective C++ languages
- Support for precompiling headers, with `target_precompile_headers`
- Support for "Unity" or "Jumbo" builds (merging source files) with [`CMAKE_UNITY_BUILD`](https://cmake.org/cmake/help/latest/variable/CMAKE_UNITY_BUILD.html)
- CTest: Can now skip based on regex, expand lists
- Several new features to control RPath.
- Generator expressions work in more places, like build and install paths
- Find locations can now be explicitly controlled through new variables

## [CMake 3.15][] : CLI upgrade

This release has many smaller polishing changes, including several improvements to the CMake command line, such as control over the default generator through environment variables (so now it's easy to change the default generator to Ninja). Multiple targets are supported in `--build` mode, and `--install` mode added. CMake finally supports multiple levels of logging. Generator expressions gained a few handy tools. The still very new FindPython module continues to improve, and FindBoost is now more inline with Boost 1.70's new CONFIG
module. `export(PACKAGE)` has drastically changed; it now no longer touches `$HOME/.cmake` by default (if CMake Minimum version is 3.15 or higher), and requires an extra step if a user wants to use it. This is generally less surprising.

- Initially released [July 17, 2019](https://blog.kitware.com/cmake-3-15-0-available-for-download/)
- [`CMAKE_GENERATOR`](https://cmake.org/cmake/help/latest/envvar/CMAKE_GENERATOR.html) environment variable added to control default generator
- Multiple target support in build mode, `cmake . --build --target a b`
- Shortcut `-t` for `--target`
- Install support, `cmake . --install`, does not invoke the build system
- Support for `--loglevel` and `NOTICE`, `VERBOSE`, `DEBUG`, and `TRACE` for `message`
- The [`list`](https://cmake.org/cmake/help/latest/command/list.html) command gained `PREPEND`, `POP_FRONT`, and `POP_BACK`
- [`execute_process`](https://cmake.org/cmake/help/latest/command/execute_process.html) gained `COMMAND_ECHO` option ([`CMAKE_EXECUTE_PROCESS_COMMAND_ECHO`](https://cmake.org/cmake/help/latest/variable/CMAKE_EXECUTE_PROCESS_COMMAND_ECHO.html)) allows you to automatically echo commands before running them
- Several Ninja improvements, include SWIFT language support
- Compiler and list improvements to generator expressions

## [CMake 3.14][] : File utilities (AKA [CMake π](https://blog.kitware.com/kitware-gets-mathematical-with-cmake-π-on-pi-day/))

This release has lots of small cleanups, including several utilities for files. Generator expressions work in a few more places, and list handling is better with empty variables.
Quite a few more find packages produce targets. The new Visual Studio 16 2019 generator is a bit different than older versions. Windows XP and Vista support has been dropped.

- Initially released [March 14, 2019](https://blog.kitware.com/cmake-3-14-0-available-for-download/)
- The cmake `--build` command gained `-v/--verbose`, to use verbose builds if your build tool supports it
- The FILE command gained `CREATE_LINK`, `READ_SYMLINK`, and `SIZE`
- [`get_filename_component`](https://cmake.org/cmake/help/latest/command/get_filename_component.html) gained `LAST_EXT` and `NAME_WLE` to access just the _last_ extension on a file, which would get `.zip` on a file such as `version.1.2.zip` (very handy!)
- You can see if a variable is defined in the CACHE with `DEFINED CACHE{VAR}` in an [`if`](https://cmake.org/cmake/help/latest/command/if.html) statement.
- `BUILD_RPATH_USE_ORIGIN` and CMake version were added to improve handling of RPath in the build directory.
- The CMake server mode is now being replaced with a file API, starting in this release. Will affect IDEs in the long run.

## [CMake 3.13][] : Linking control

You can now make symbolic links on Windows! Lots of new functions that fill out the
popular requests for CMake, such as `add_link_options`, `target_link_directories`, and
`target_link_options`. You can now do quite a bit more modification to targets outside
of the source directory, for better file separation. And, `target_sources` _finally_ handles relative paths properly (policy 76).

- Initially released [November 20, 2018](https://blog.kitware.com/cmake-3-13-0-available-for-download/)
- New `ctest --progress` option for live output
- `target_link_options` and `add_link_options` added
- `target_link_directories` added
- Symbolic link creation, `-E create_symlink`, supported on Windows
- IPO supported on Windows
- You can use `-S` and `-B` for source and build directories
- `target_link_libraries` and `install` work outside the current target directory
- `STATIC_LIBRARY_OPTIONS` property added
- `target_sources` is now relative to the current source directory (CMP0076)
- If you use Xcode, you now can experimentally set schema fields

## [CMake 3.12][] : Version ranges and CONFIGURE_DEPENDS

Very powerful release, containing lots of smaller long-requested features. One of the smaller
but immediately noticeable changes is the addition of version ranges;
you can now set both the minimum and maximum known CMake version easily. You can also set
`CONFIGURE_DEPENDS` on a `GLOB`ed set of files, and the build system will check those files and
rerun if needed! You can use the general `PackageName_ROOT`
for all `find_package` searches. Lots of additions to strings and lists, module updates,
shiny new Python find module (2 and 3 versions too), and many more.

- Initially released [July 17, 2018](https://blog.kitware.com/cmake-3-12-0-available-for-download/)
- Support for `cmake_minimum_required` ranges (backward compatible)
- Support for `-j,--parallel` in `--build` mode (passed on to build tool)
- Support for `SHELL:` strings in compile options (not deduplicated)
- New FindPython module
- `string(JOIN` and `list(JOIN`, and `list(TRANSFORM`
- `file(TOUCH` and `file(GLOB CONFIGURE_DEPENDS`
- C++20 support
- CUDA as a language improvements: CUDA 7 and 7.5 now supported
- Support for OpenMP on macOS (command line only)
- Several new properties and property initializers
- CPack finally reads `CMAKE_PROJECT_VERSION` variables

## [CMake 3.11][] : Faster & IMPORTED INTERFACE

This release is [supposed to be][fastercmake] much faster. You can also finally directly add INTERFACE targets
to IMPORTED libraries (the internal `Find*.cmake` scripts should become much cleaner eventually).

- Initially released [March 28, 2018](https://blog.kitware.com/cmake-3-11-0-available-for-download/)
- Fortran supports compiler launchers
- Xcode and Visual Studio support `COMPILE_LANGUAGE` generator expressions finally
- You can now add INTERFACE targets directly to IMPORTED INTERFACE libraries (Wow!)
- Source file properties have been expanded
- `FetchContent` module now allows downloads to happen at configure time (Wow)

## [CMake 3.10][] : CppCheck

CMake now is built with C++11 compilers. Lots of useful improvements help write cleaner code.

- Initially released [November 20, 2017](https://blog.kitware.com/cmake-3-10-0-available-for-download/)
- Support for flang Fortran compiler
- Compiler launcher added to CUDA
- Indented `#cmakedefines` now supported for `configure_file`
- `include_guard()` added to ensure a file gets included only once
- `string(PREPEND` added
- `*_CPPCHECK` property added
- `LABELS` added to directories
- FindMPI vastly expanded
- FindOpenMP improved
- Dynamic test discovery for `GoogleTest`
- `cmake_host_system_information` can access much more information.

## [CMake 3.9][] : IPO

Lots of fixes to CUDA support went into this release, including `PTX` support and MSVC generators. Interprocedural Optimizations are now supported properly.
Even more modules provide imported targets, including MPI.

- Initially released [July 18, 2017](https://blog.kitware.com/cmake-3-9-0-available-for-download/)
- CUDA supported for Windows
- Better object library support in several situations
- `DESCRIPTION` added to `project`
- `separate_arguments` gets `NATIVE_COMMAND`
- `INTERPROCEDURAL_OPTIMIZATION` enforced (and `CMAKE_*` initializer added, CheckIPOSupported added, Clang and GCC support)
- New `GoogleTest` module
- `FindDoxygen` drastically improved

## [CMake 3.8][] : C# & CUDA

This adds CUDA as a language, as well as `cxx_std_11` as a compiler meta-feature. The new generator expression could be really useful if you can require CMake 3.8+!

- Initially released [April 10, 2017](https://blog.kitware.com/cmake-3-8-0-available-for-download/)
- Native support for C# as a language
- Native support for CUDA as a language
- Meta features cxx_std_11 (and 14, 17) added
- `try_compile` has better language support
- `BUILD_RPATH` property added
- `COMPILE_FLAGS` now supports generator expression
- `*_CPPLINT` added
- `$<IF:cond,true-value,false-value>` added (wow!)
- `source_group(TREE` added (finally allowing IDEs to reflect the project folder structure!)

## [CMake 3.7][] : Android & CMake Server

You can now cross-compile to Android. Useful new if statement options really help clarify code. And the new server mode was supposed to improve integration with IDEs (but is being replaced by a different system in CMake 3.14+). Support for the VIM editor was also improved.

- Initially released [November 11, 2016](https://blog.kitware.com/cmake-3-7-0-available-for-download/)
- `PARSE_ARGV` mode for `cmake_parse_arguments`
- Better 32-bit support on 64-bit machines
- Lots of useful new if comparisons, like `VERSION_GREATER_EQUAL` (really, why did it take this long?)
- `LINK_WHAT_YOU_USE` added
- Lots of custom properties related to files and directories
- CMake Server added
- Added `--trace-source="filename"` to monitor certain files only

## [CMake 3.6][] : Clang-Tidy

This release added Clang-Tidy support, along with more utilities and improvements. It also removed the search of `$PATH` on Unix systems due to problems, instead users should use `$CMAKE_PREFIX_PATH`.

- Initially released [July 7, 2016](https://blog.kitware.com/cmake-3-6-0-available-for-download/)
- `EXCLUDE_FROM_ALL` for install
- `list(FILTER` added
- `CMAKE_*_STANDARD_INCLUDE_DIRECTORIES` and `CMAKE_*_STANDARD_LIBRARIES` added for toolchains
- Try-compile improvements
- `*_CLANG_TIDY` property added
- External projects can now be shallow clones, and other improvements

## [CMake 3.5][] : ARM

This release expanded CMake to more platforms, and make warnings easier to control from the command line.

- Initially released [March 8, 2016](https://blog.kitware.com/cmake-3-5-0-available-for-download/)
- Multiple input files supported for several of the `cmake -E` commands.
- `cmake_parse_arguments` now builtin
- Boost, GTest, and more now support imported targets
- ARMCC now supported, better support for iOS
- XCode backslash fix

## [CMake 3.4][] : Swift & CCache

This release adds lots of useful tools, support for the Swift language, and the usual improvements. It also started supporting compiler launchers, like CCache.

- Initially released [November 12, 2015](https://blog.kitware.com/cmake-3-4-0-released/)
- Added `Swift` language
- Added `BASE_DIR` to `get_filename_component`
- `if(TEST ...)` added
- `string(APPEND ...)` added
- `CMAKE_*_COMPILER_LAUNCHER` added for make and ninja
- `TARGET_MESSAGES` allow makefiles to print messages after target is completed
- Imported targets are beginning to show up in the official `Find*.cmake` files

## [CMake 3.3][] : if IN_LIST

This is notable for the useful `IN_LIST` option for if, but it also added better library search using `$PATH` (See CMake 3.6), dependencies for INTERFACE libraries, and several other useful improvements. The addition of a `COMPILE_LANGUAGE` generator expression would prove very useful in the future as more languages are added. Makefiles now produce better output in parallel.

- Initially released [July 23, 2015](https://blog.kitware.com/cmake-3-3-0-released/)
- `IN_LIST` added to `if`
- `*_INCLUDE_WHAT_YOU_USE` property added
- `COMPILE_LANGUAGE` generator expression (limited support in some generators)

## [CMake 3.2][] : UTF8

This is a smaller release, with mostly small features and fixes. Internal changes, like better Windows and UTF8 support, were the focus.

- Initially released [March 11, 2015](https://blog.kitware.com/cmake-3-2-1-released/)
- `continue()` inside loops
- File and directory locks added

## [CMake 3.1][] : C++11 and compile features

This is the first release of CMake to support C++11. Combined with fixes to the new features of CMake 3.0, this is currently a common minimum version of CMake for libraries that want to support old CMake builds.

- Initially released [December 17, 2014](https://blog.kitware.com/cmake-3-1-0-released/)
- C++11 Support
- Compile features support
- Sources can be added later with `target_sources`
- Better support for generator expressions and INTERFACE targets

## [CMake 3.0][] : Interface libraries

There were a ton of additions to this version of CMake, primarily to fill out the target interface. Some bits of needed functionality were missed and implemented in CMake 3.1 instead.

- Initially released [June 10, 2014](https://blog.kitware.com/cmake-3-0-0-available-for-download/)
- New documentation
- INTERFACE libraries
- Project VERSION support
- Exporting build trees easily
- Bracket arguments and comments available (not widely used)
- Lots of improvements

[releases]: https://cmake.org/cmake/help/latest/release/index.html
[cmake 3.0]: https://cmake.org/cmake/help/latest/release/3.0.html
[cmake 3.1]: https://cmake.org/cmake/help/latest/release/3.1.html
[cmake 3.2]: https://cmake.org/cmake/help/latest/release/3.2.html
[cmake 3.3]: https://cmake.org/cmake/help/latest/release/3.3.html
[cmake 3.4]: https://cmake.org/cmake/help/latest/release/3.4.html
[cmake 3.5]: https://cmake.org/cmake/help/latest/release/3.5.html
[cmake 3.6]: https://cmake.org/cmake/help/latest/release/3.6.html
[cmake 3.7]: https://cmake.org/cmake/help/latest/release/3.7.html
[cmake 3.8]: https://cmake.org/cmake/help/latest/release/3.8.html
[cmake 3.9]: https://cmake.org/cmake/help/latest/release/3.9.html
[cmake 3.10]: https://cmake.org/cmake/help/latest/release/3.10.html
[cmake 3.11]: https://cmake.org/cmake/help/latest/release/3.11.html
[cmake 3.12]: https://cmake.org/cmake/help/latest/release/3.12.html
[cmake 3.13]: https://cmake.org/cmake/help/latest/release/3.13.html
[cmake 3.14]: https://cmake.org/cmake/help/latest/release/3.14.html
[cmake 3.15]: https://cmake.org/cmake/help/latest/release/3.15.html
[cmake 3.16]: https://cmake.org/cmake/help/latest/release/3.16.html
[cmake 3.17]: https://cmake.org/cmake/help/latest/release/3.17.html
[cmake 3.18]: https://cmake.org/cmake/help/latest/release/3.18.html
[cmake 3.19]: https://cmake.org/cmake/help/latest/release/3.19.html
[cmake 3.20]: https://cmake.org/cmake/help/latest/release/3.20.html
[cmake 3.21]: https://cmake.org/cmake/help/latest/release/3.21.html
[cmake 3.22]: https://cmake.org/cmake/help/latest/release/3.22.html
[cmake 3.23]: https://cmake.org/cmake/help/latest/release/3.23.html
[cmake 3.24]: https://cmake.org/cmake/help/latest/release/3.24.html
[cmake 3.25]: https://cmake.org/cmake/help/latest/release/3.25.html
[cmake 3.26]: https://cmake.org/cmake/help/latest/release/3.26.html
[cmake 3.27]: https://cmake.org/cmake/help/latest/release/3.27.html
[cmake 3.28]: https://cmake.org/cmake/help/latest/release/3.28.html
[cmake 3.29]: https://cmake.org/cmake/help/latest/release/3.29.html
[cmake 3.30]: https://cmake.org/cmake/help/latest/release/3.30.html
[cmake 3.31]: https://cmake.org/cmake/help/latest/release/3.31.html
[cmake 4.0]: https://cmake.org/cmake/help/latest/release/4.0.html
[cmake 4.1]: https://cmake.org/cmake/help/latest/release/4.1.html
[cmake 4.2]: https://cmake.org/cmake/help/latest/release/4.2.html
[cmake 4.3]: https://cmake.org/cmake/help/latest/release/4.3.html
[cmake 4.4]: https://cmake.org/cmake/help/latest/release/4.4.html
[cmake master]: https://cmake.org/cmake/help/git-master/release/index.html
[fastercmake]: https://blog.kitware.com/improving-cmakes-runtime-performance/
