# Supporting IDEs

In general, IDEs are already supported by a standard CMake project. There are just a few extra things that can help IDEs perform even better.

## Folders for targets

Some IDEs, like Xcode, support folders. You have to manually enable the `USE_FOLDERS` global property to allow CMake to organize your files by folders:

```cmake
set_property(GLOBAL PROPERTY USE_FOLDERS ON)
```

Then, you can add targets to folders after you create them:

```cmake
set_property(TARGET MyFile PROPERTY FOLDER "Scripts")
```

Folders can be nested with `/`.



You can control how files show up in each folder with regular expressions or explicit listings in [`source_group`](https://cmake.org/cmake/help/latest/command/source_group.html):

## Folders for files

You can also control how the folders inside targets appear. There are two ways, both using the «command:source_group» command. The traditional way is

```cmake
source_group("Source Files\\New Directory" REGULAR_EXPRESSION ".*\\.c[ucp]p?")
```

You can explicitly list files with `FILES`, or use a `REGULAR_EXPRESSION`. This way you have complete control over the folder structure. However, if your on-disk layout is well designed, you might just want to mimic that. In CMake 3.8+, you can do so very easily with a new version of the «command:source_group» command:

```cmake
source_group(TREE "${CMAKE_CURRENT_SOURCE_DIR}/base/dir" PREFIX "Header Files" FILES ${FILE_LIST})
```

For the `TREE` option, you should usually give a full path starting with something like `${CMAKE_CURRENT_SOURCE_DIR}/` (because the command interprets paths relative to the build directory).
The prefix tells you where it puts it into the IDE structure, and the `FILES` option takes a list of files.
CMake will strip the `TREE` path from the `FILE_LIST` path, it will add `PREFIX`, and that will be the IDE folder structure.

> Note: If you need to support CMake < 3.8, I would recommend just protecting the above command, and only supporting nice folder layout on CMake 3.8+. For older methods to do this folder layout, see
> [this blog post][sorting].

## Running with an IDE

To use an IDE, either pass `-G"name of IDE"` if CMake can produce that IDE's files (like Xcode, Visual Studio), or open the CMakeLists.txt file from your IDE if that IDE has built in support for CMake (CLion, QtCreator, many others).


[sorting]: http://blog.audio-tk.com/2015/09/01/sorting-source-files-and-projects-in-folders-with-cmake-and-visual-studioxcode/
