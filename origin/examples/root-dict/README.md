# Dictionary Example

This is an example of building a module that includes a dictionary in CMake. Instead of using the
ROOT suggested flags, we will manually add threading via `find_package`, which is the only
important flag in the list on most systems.

## examples/root-dict/CMakeLists.txt

```{literalinclude} CMakeLists.txt
:start-after: [main]
:end-before: [main]
:language: cmake
```

## Supporting files

This is just a simple-as-possible class definition, with one method:

### examples/root-dict/DictExample.cxx

```{literalinclude} DictExample.cxx
:language: cpp
```

### examples/root-dict/DictExample.h

```{literalinclude} DictExample.h
:language: cpp
```

We need a `LinkDef.h`, as well.

### examples/root-dict/DictLinkDef.h

```{literalinclude} DictLinkDef.h
:language: cpp
```

## Testing it

This is an example of a macro that tests the correct generation from the files listed above.

### examples/root-dict/CheckLoad.C

```{literalinclude} CheckLoad.C
:language: cpp
```
