# CMake 对 IDE 的支持

一般来说，IDE 已经被标准的 CMake 的项目支持。不过这里有一些额外的东西可以帮助 IDE 表现得更好：

## 用文件夹来组织目标 (target)

一些 IDE，例如 Xcode，支持文件夹。你需要手动的设定 `USE_FOLDERS` 这个全局属性来允许 CMake 使用文件夹组织你的文件：

```cmake
set_property(GLOBAL PROPERTY USE_FOLDERS ON)
```

然后，你可以在创建目标后，为目标添加文件夹属性，即将其目标 `MyFile` 归入到 `Scripts` 文件夹中：

```cmake
set_property(TARGET MyFile PROPERTY FOLDER "Scripts")
```

文件夹可以使用 `/` 进行嵌套。



你可以使用正则表达式或在 [`source_group`](https://cmake.org/cmake/help/latest/command/source_group.html) 使用列表来控制文件在文件夹中是否可见。

## 用文件夹来组织文件

你也可以控制文件夹对目标是否可见。有两种方式，都是使用 «command:source_group» 命令，传统的方式是：

```cmake
source_group("Source Files\\New Directory" REGULAR_EXPRESSION ".*\\.c[ucp]p?")
```

你可以用 `FILES` 来明确的列出文件列表，或者使用 `REGULAR_EXPRESSION` 来进行筛选。通过这个方式你可以完全的掌控文件夹的结构。不过，如果你的文件已经在硬盘中组织的很好，你可能只是想在 CMake 中复现这种组织。在 CMake 3.8+ 中，你可以用新版的 «command:source_group» 命令非常容易的做到上述情形：

```cmake
source_group(TREE "${CMAKE_CURRENT_SOURCE_DIR}/base/dir" PREFIX "Header Files" FILES ${FILE_LIST})
```

对于 `TREE` 选项，通常应该给出一个以 `${CMAKE_CURRENT_SOURCE_DIR}` 起始的完整路径（因为此命令的文件解析路径是相对于构建目录的）。这个 `PREFIX` 设置文件将在 IDE 结构中的位置，而 `FILES` 选项是包含一些文件的列表 (FILE_LIST)。CMake 将会解析 `TREE` 路径下 `FILE_LIST` 中包含的文件，并将每个文件添加到 `PREFIX` 结构下，这构成了 IDE 的文件夹结构。

> 注意：如果你需要支持低于 3.8 版本的CMake，我不建议你使用上述命令，只建议在 CMake 3.8+ 中使用上述文件夹布局。对于做这种文件夹布局的旧方法，请参见 [这篇博文][sorting]。

## 在 IDE 中运行CMake

要使用 IDE，如果 CMake 可以生成对应 IDE 的文件（例如 Xcode，Visual Studio），可以通过 `-G"name of IDE"` 来完成，或者如果 IDE 已经内置了对 CMake 的支持（例如 CLion，QtCreator和一些其他的IDE），你可以直接在 IDE 中打开 `CMakeLists.txt` 来运行 CMake。


[sorting]: http://blog.audio-tk.com/2015/09/01/sorting-source-files-and-projects-in-folders-with-cmake-and-visual-studioxcode/
