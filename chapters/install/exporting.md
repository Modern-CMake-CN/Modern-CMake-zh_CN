# 导出

{% hint style='danger' %}

CMake 3.15 中，导出的默认行为发生了变化。由于更改用户主目录中的文件是“令人惊讶的”（确实如此，这就是本章存在的原因），因此不再是默认行为。若将 CMake 的最小或最大版本设置为 3.15+，这种情况将不再发生，除非将 `CMAKE_EXPORT_PACKAGE_REGISTRY` 设置为`ON`。

{% endhint %}

CMake 访问项目有三种方式：子目录、导出构建目录和安装。要使用项目的构建目录，就需要导出目标。正确的安装需要导出目标，使用构建目录只需要再增加了两行代码，但这并不是我推荐的工作方式。不过，对于开发和安装过程来说的确好用。

还需要创建导出集，可能要放在主 `CMakeLists.txt` 文件的末尾:

```cmake
export(TARGETS MyLib1 MyLib2 NAMESPACE MyLib:: FILE MyLibTargets.cmake)
```

这将把列出的目标放到构建目录的文件中，还可以给添加一个命名空间作为前缀。现在，CMake 可以找到这个包了，并将这个包导出到 `$HOME/.cmake/packages` 文件夹下:

```cmake
set(CMAKE_EXPORT_PACKAGE_REGISTRY ON)
export(PACKAGE MyLib)
```

现在，`find_package(MyLib)`就可以找到构建文件夹了。来看看生成的`MyLibTargets.cmake`文件到底做了什么。它只是一个普通的CMake文件，但带有导出的目标。

注意，这种方式有一个缺点：若导入了依赖项，则需要在 `find_package` 之前导入它们。这个问题将在后面的章节中解决。
