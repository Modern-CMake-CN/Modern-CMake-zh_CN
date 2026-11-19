# 使用 CMake 下载项目

## 在构建时 (build time) 下载

直到 CMake 3.11， 主流的下载包的方法都在构建时进行。这（在构建时下载）会造成几个问题；其中最主要问题的是 `add_subdirectory` 不能对一个尚不存在的文件夹使用！因此，我们导入的外部项目内置的工具必须自己构建自己（这个外部项目）来解决这个问题。（同时，这种方法也能用于构建不支持 CMake 的包）[^1]

[^1]: 注意，外部数据就是不在包内的数据的工具。

## 在配置时 (configure time) 下载

如果你更喜欢在配置时下载，现代的做法是使用内置的 [FetchContent](fetch.md) 模块（CMake 3.11+ 引入，并在 3.14 中得到了大幅改进）。如果你受限于必须支持非常老旧的 CMake 版本，[Crascit/DownloadProject](https://github.com/Crascit/DownloadProject) 仓库曾是一个开箱即用（drop-in）的解决方案，但如今它已被 FetchContent 取代。但是，子模块 (submodules) 很好用，以至于我已经停止了使用 CMake 对诸如 GoogleTest 之类的项目的下载，并把他们加入到了子模块中。自动下载在没有网络访问的环境下也是难以实现的，并且外部项目经常被下载到构建目录中，如果你有多个构建目录，这就既浪费时间又浪费空间。
