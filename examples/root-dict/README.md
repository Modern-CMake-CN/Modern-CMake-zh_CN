# Dictionary Example

This is an example of building a module that includes a dictionary in CMake. Instead of using the
ROOT suggested flags, we will manually add threading via `find_package`, which is the only
important flag in the list on most systems.

#### examples/root-dict/CMakeLists.txt
[import:'main', lang:'cmake'](CMakeLists.txt)

## Supporting files

This is just a simple-as-possible class definition, with one method:

#### examples/root-dict/DictExample.cxx
[import, lang:'c_cpp'](DictExample.cxx)

#### examples/root-dict/DictExample.h
[import, lang:'c_cpp'](DictExample.h)

We need a `LinkDef.h`, as well.

#### examples/root-dict/DictLinkDef.h
[import, lang:'c_cpp'](DictLinkDef.h)

## Testing it

This is an example of a macro that tests the correct generation from the files listed above.

#### examples/root-dict/CheckLoad.C
[import, lang:'c_cpp'](CheckLoad.C)
