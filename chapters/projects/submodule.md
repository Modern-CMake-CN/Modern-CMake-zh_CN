# Git 子模组（Submodule）

如果你想要添加一个 Git 仓库，它与你的项目仓库使用相同的 Git 托管服务（诸如 GitHub、GitLab、BitBucker 等等），下面是正确的添加一个子模组到 `extern` 目录中的命令：

```term
gitbook $ git submodule add ../../owner/repo.git extern/repo
```

此处的关键是使用相对于你的项目仓库的相对路径，它可以保证你使用与主仓库相同的访问方式（ ssh 或 https ）访问子模组。这在大多数情况都能工作得相当好。当你在一个子模组里的时候，你可以把它看作一个正常的仓库，而当你在主仓库里时，你可以用 `add` 来改变当前的提交指针。

但缺点是你的用户必须懂 git submodule 命令，这样他们才可以 `init` 和 `update` 仓库，或者他们可以在最开始克隆你的仓库的时候加上 `--recursive` 选项。针对这种情况，CMake 提供了一种解决方案：

```cmake
find_package(Git QUIET)
if(GIT_FOUND AND EXISTS "${PROJECT_SOURCE_DIR}/.git")
# Update submodules as needed
    option(GIT_SUBMODULE "Check submodules during build" ON)
    if(GIT_SUBMODULE)
        message(STATUS "Submodule update")
        execute_process(COMMAND ${GIT_EXECUTABLE} submodule update --init --recursive
                        WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
                        RESULT_VARIABLE GIT_SUBMOD_RESULT)
        if(NOT GIT_SUBMOD_RESULT EQUAL "0")
            message(FATAL_ERROR "git submodule update --init --recursive failed with ${GIT_SUBMOD_RESULT}, please checkout submodules")
        endif()
    endif()
endif()

if(NOT EXISTS "${PROJECT_SOURCE_DIR}/extern/repo/CMakeLists.txt")
    message(FATAL_ERROR "The submodules were not downloaded! GIT_SUBMODULE was turned off or failed. Please update submodules and try again.")
endif()
```

第一行使用 CMake 自带的 `FindGit.cmake` 检测是否安装了 Git 。然后，如果项目源目录是一个 git 仓库，则添加一个选项（默认值为 `ON`），用户可以自行决定是否打开这个功能。然后我们运行命令来获取所有需要的仓库，如果该命令出错了，则 CMake 配置失败，同时会有一份很好的报错信息。最后无论我们以什么方式获取了子模组，CMake都会检查仓库是否已经被拉取到本地。你也可以使用 `OR` 来列举其中的几个。

现在，你的用户可以完全忽视子模组的存在了，而你同时可以拥有良好的开发体验！唯一需要开发者注意的一点是，如果你正在子模组里开发，你会在重新运行 CMake 的时候重置你的子模组。只需要添加一个新的提交到主仓库的暂存区，就可以避免这个问题。

然后你就可以添加对 CMake 有良好支持的项目了：

```cmake
add_subdirectory(extern/repo)
```

或者，如果这是一个只有头文件的库，你可以创建一个接口库目标 (interface library target) 。或者，如果支持的话，你可以使用`find_package`，可能初始的搜索目录就是你所添加的目录（查看文档或你所使用的`Find*.cmake`文件）。如果你追加到你的`CMAKE_MODULE_PATH`，你也可以包括一个CMake帮助文件目录，例如添加`pybind11`改进过的`FindPython*.cmake`文件。


### 小贴士：获取 Git 版本号

将下面的命令加入到上述 Git 更新子仓库的那段中：

```cmake
execute_process(COMMAND ${GIT_EXECUTABLE} rev-parse --short HEAD
                WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}"
                OUTPUT_VARIABLE PACKAGE_GIT_VERSION
                ERROR_QUIET
                OUTPUT_STRIP_TRAILING_WHITESPACE)
```
