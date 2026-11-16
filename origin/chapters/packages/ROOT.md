# ROOT

ROOT is a C++ Toolkit for High Energy Physics. It is huge. There are really a lot of ways to use it in CMake, though many/most of the examples you'll find are probably wrong. Here's my recommendation.

Most importantly, any current version of ROOT (the 6.3x series at the time of writing) behaves like a proper CMake project: it provides imported targets, exports C++ standard features for those targets, and loads its CMake macros automatically. If you really must support an ancient ROOT (pre-6.20), see the appendix at the end.

## Finding ROOT

ROOT supports config file discovery, so you can just do:

```{literalinclude} ../../examples/root-simple/CMakeLists.txt
:start-after: [find_package]
:end-before: [find_package]
:language: cmake
```

to attempt to find ROOT. If you don't have your paths set up, you can pass `-DROOT_DIR=$ROOTSYS/cmake` to find ROOT. (But, really, you should source `thisroot.sh`).

## The right way (Targets)

ROOT's imported targets carry the include directories, flags, and dependencies you need. To link, just pick the libraries you want to use:

```{literalinclude} ../../examples/root-simple/CMakeLists.txt
:start-after: [add_and_link]
:end-before: [add_and_link]
:language: cmake
```

If you'd like to see the default list, run `root-config --libs` on the command line. For a typical ROOT install this would be something like:

- `ROOT::Core`
- `ROOT::Gpad`
- `ROOT::Graf3d`
- `ROOT::Graf`
- `ROOT::Hist`
- `ROOT::Imt`
- `ROOT::MathCore`
- `ROOT::Matrix`
- `ROOT::MultiProc`
- `ROOT::Net`
- `ROOT::Physics`
- `ROOT::Postscript`
- `ROOT::RIO`
- `ROOT::ROOTDataFrame`
- `ROOT::ROOTVecOps`
- `ROOT::Rint`
- `ROOT::Thread`
- `ROOT::TreePlayer`
- `ROOT::Tree`

## The old global way

ROOT [provides a utility](https://root.cern/manual/integrate_root_into_my_cmake_project/) to set up a ROOT project, which you can activate using `include("${ROOT_USE_FILE}")`. This will automatically make ugly directory level and global variables for you. It will save you a little time setting up, and will waste massive amounts of time later if you try to do anything tricky. As long as you aren't making a library, it's probably fine for simple scripts. Includes and flags are set globally, but you'll still need to link to `${ROOT_LIBRARIES}` yourself, along with possibly `ROOT_EXE_LINKER_FLAGS` (You will have to `separate_arguments` first before linking or you will get an error if there are multiple flags, like on macOS).

Here's what it would look like:

```{literalinclude} ../../examples/root-usefile/CMakeLists.txt
:start-after: [core]
:end-before: [core]
:language: cmake
```

## Components

Find ROOT allows you to specify components. It will add anything you list to `${ROOT_LIBRARIES}`, so you might want to build your own target using that to avoid listing the components twice. This did not solve dependencies; it was an error to list `RooFit` but not `RooFitCore`. If you link to `ROOT::RooFit` instead of `${ROOT_LIBRARIES}`, then `RooFitCore` is not required.

## Dictionary generation

Dictionary generation is ROOT's way of working around the missing reflection feature in C++. It allows ROOT to learn the details of your class so it can save it, show methods in the Cling interpreter, etc. Your source code will need the following modifications to support dictionary generation:

- Your class definition should end with `ClassDef(MyClassName, 1)`
- Your class implementation should have `ClassImp(MyClassName)` in it

ROOT provides `rootcling` and `genreflex` (a legacy interface to `rootcling`) binaries which produce the source files required to build the dictionary. It also defines `root_generate_dictionary`, a CMake function to invoke `rootcling` during the build process. The macros file defining it is loaded automatically, so the function is available as soon as `find_package(ROOT)` runs. (Only ancient ROOT required manually including the macros file; it was renamed to `RootMacros.cmake` and auto-loaded in 6.20 — see the appendix.)

`rootcling` uses a special header file with a [specific formula][linkdef-root] to determine which parts to generate dictionaries for. The name of this file may have any prefix, but **must** end with `LinkDef.h`. Once you have written this header file, the dictionary generation function can be invoked.

### Manually building the dictionary

Sometimes, you might want to ask ROOT to generate the dictionary, and then add the source file to your library target yourself. You can call the `root_generate_dictionary` with the name of the dictionary, e.g. `G__Example`, any required header files, and finally the special `LinkDef.h` file, listed after `LINKDEF`:

```cmake
root_generate_dictionary(G__Example Example.h LINKDEF ExampleLinkDef.h)
```

This command will create three files:

- `${NAME}.cxx`: This file should be included in your sources when you make your library.
- `lib{NAME}.rootmap` (`G__` prefix removed): The rootmap file in plain text
- `lib{NAME}_rdict.pcm` (`G__` prefix removed): A [ROOT pre-compiled module file][]

The name (`${NAME}`) of the target that you must create is determined by the dictionary name; if the dictionary name starts with `G__`, it will be removed. Otherwise, the name is used directly.

The final two output files must sit next to the library output. This is done by checking `CMAKE_LIBRARY_OUTPUT_DIRECTORY` (it will not pick up local target settings). If you have a libdir set but you don't have (global) install locations set, you'll also need to set `ARG_NOINSTALL` to `TRUE`.

### Building the dictionary with an existing target

Instead of manually adding the generated dictionary to your library sources, you can ask ROOT to do this for you by passing a `MODULE` argument. This argument should specify the name of an existing build target:

```cmake
add_library(Example)
root_generate_dictionary(G__Example Example.h MODULE Example LINKDEF ExampleLinkDef.h)
```

The full name of the dictionary (e.g. `G__Example`) should not be identical to the `MODULE` argument.

[linkdef-root]: https://root.cern/manual/io_custom_classes/#selecting-dictionary-entries-linkdefh
[root pre-compiled module file]: https://inspirehep.net/literature/1413967

---

## Using Old ROOT

If you really have to use an ancient ROOT (pre-6.20), you'll need to load the dictionary macros manually before using `root_generate_dictionary`:

```cmake
include("${ROOT_DIR}/modules/RootNewMacros.cmake")
# For ROOT versions older than 6.16, things break
# if nothing is in the global include list!
if (${ROOT_VERSION} VERSION_LESS "6.16")
    include_directories(ROOT_NONEXISTENT_DIRECTORY_HACK)
endif()
```

(The `include_directories` line works around a bug in the NewMacros file that broke dictionary generation unless there was at least one global include directory or `inc` folder; the directory listed doesn't need to exist.)

You'll also need to patch up the missing target properties and flags yourself, with something like this:

```cmake
# ROOT targets are missing includes and flags in ROOT 6.10 and 6.12
set_property(TARGET ROOT::Core PROPERTY
    INTERFACE_INCLUDE_DIRECTORIES "${ROOT_INCLUDE_DIRS}")

# Early ROOT does not include the flags required on targets
add_library(ROOT::Flags_CXX IMPORTED INTERFACE)


# ROOT 6.14 and earlier have a spacing bug in the linker flags
string(REPLACE "-L " "-L" ROOT_EXE_LINKER_FLAGS "${ROOT_EXE_LINKER_FLAGS}")

# Fix for ROOT_CXX_FLAGS not actually being a CMake list
separate_arguments(ROOT_CXX_FLAGS)
set_property(TARGET ROOT::Flags_CXX APPEND PROPERTY
    INTERFACE_COMPILE_OPTIONS ${ROOT_CXX_FLAGS})

# Add definitions
separate_arguments(ROOT_DEFINITIONS)
foreach(_flag ${ROOT_DEFINITIONS})
    # Remove -D or /D if present
    string(REGEX REPLACE [=[^[-//]D]=] "" _flag ${_flag})
    set_property(TARGET ROOT::Flags_CXX APPEND PROPERTY INTERFACE_COMPILE_DEFINITIONS ${_flag})
endforeach()

# This also fixes a bug in the linker flags
separate_arguments(ROOT_EXE_LINKER_FLAGS)
set_property(TARGET ROOT::Flags_CXX APPEND PROPERTY
    INTERFACE_LINK_LIBRARIES ${ROOT_EXE_LINKER_FLAGS})

# Make sure you link with ROOT::Flags_CXX too!
```
