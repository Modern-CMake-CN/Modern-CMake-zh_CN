# 导出

{% hint style='danger' %}

CMake 3.15中，导出的默认行为发生了变化。由于更改用户主目录中的文件是“令人惊讶的”(确实如此，这就是本章存在的原因)，因此不再是默认行为。若将CMake的最小或最大版本设置为3.15+，这种情况将不再发生，除非使用如下的方式设置`CMAKE_EXPORT_PACKAGE_REGISTRY`。

{% endhint %}

访问一个项目有三种方式:子目录、导出构建目录和安装。要使用一个项目的构建目录，就需要导出目标。正确的安装需要导出目标，使用构建目录只增加了两行。这并不是我推荐的工作方式，但对于开发和安装过程来说的确有用。

还需要创建一个导出集，可能要放在`CMakeLists.txt`主文件的末尾:

```cmake
export(TARGETS MyLib1 MyLib2 NAMESPACE MyLib:: FILE MyLibTargets.cmake)
```

这将把列出的目标放到构建目录中的文件中，并可以给添加一个命名空间作为前缀。现在，CMake可以找到这个包了，将这个包导出到`$HOME/.cmake/packages`文件夹下:

```cmake
set(CMAKE_EXPORT_PACKAGE_REGISTRY ON)
export(PACKAGE MyLib)
```

现在，若进行`find_package(MyLib)`， CMake就可以找到构建文件夹。来看看生成的`MyLibTargets.cmake`文件到底做了什么。它只是一个普通的CMake文件，但带有导出的目标。

注意，这有一个缺点:若导入了依赖项，则需要在查找包之前导入它们。这个问题将在后面的章节中解决。
