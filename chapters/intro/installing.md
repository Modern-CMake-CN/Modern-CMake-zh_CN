# 安装 CMake

:::{tip}

你的 CMake 版本应该比你的编译器要更新，它应该比你使用的所有库都要更新。新版本对任何一个人来说都是有好处的。

:::

如果你拥有一个 CMake 的内置副本，这对你的系统来说并不特殊。你可以在系统层面或用户层面轻松地安装一个新的来代替它。如果你的用户抱怨 CMake 的要求被设置得太高，请随时使用这里的内容来指导他们。尤其是当他们想要 3.15 版本以上，甚至是 4.4 以上版本的时候......

## 快速一览（下面有关于每种方法的更多信息)

按作者的偏好排序：

- 所有系统
  - [Pip(x)][pypi] (官方的，通常当天同步更新)
  - [Anaconda][] / [Conda-Forge][]
- Windows
  - [Winget][]
  - [Chocolatey][]
  - [Scoop][]
  - [MSYS2][]
  - [Download binary][download] (官方的)
- macOS
  - [Homebrew][]
  - [MacPorts][]
  - [Download binary][download] (官方的)
- Linux
  - [Snapcraft][snap] (官方的)
  - [APT repository][apt] (仅适用于Ubuntu/Debian) (官方的)
  - [Download binary][download] (官方的)

## 官方安装包

你可以从 [KitWare][download] 上下载 CMake。如果你是在 Windows 上，这可能就是你获得 CMake 的方式。在 macOS 上获得它的方法也不错（而且开发者还提供了支持 Intel 和 Apple Silicon 的 Universal2 版本），但如果你使用 [Homebrew](https://brew.sh) 的话，使用`brew install cmake`会带来更好的效果（你应该这样做；苹果甚至支持 Homebrew，比如在 Apple Silicon 的推出期间）。你也可以在大多数的其他软件包管理器上得到它，比如 Windows 的 [Chocolatey ](https://chocolatey.org)或 macOS 的 [MacPorts ](https://www.macports.org)。

在 Linux 上，有几种选择。Kitware 提供了一个 [Debian/Ubuntu apt 软件库][apt]，以及 [snap 软件包][snap]。官方同时提供了 Linux 的二进制文件包，但需要你去选择一个安装位置。如果你已经使用`~/.local`存放用户空间的软件包，下面的单行命令[^1]将为你安装 CMake[^2]。

```bash
~ $ wget -qO- "https://cmake.org/files/v4.4/cmake-4.4.0-linux-x86_64.tar.gz" | tar --strip-components=1 -xz -C ~/.local
```

上面的名字在 3.20 版本中发生了改变：在旧版本中，包名是`cmake-3.19.7-Linux-x86_64.tar.gz`。如果你只是想要一个仅有 CMake 的本地文件夹：

```bash
~ $ mkdir -p cmake-4.4 && wget -qO- "https://cmake.org/files/v4.4/cmake-4.4.0-linux-x86_64.tar.gz" | tar --strip-components=1 -xz -C cmake-4.4
~ $ export PATH=`pwd`/cmake-4.4/bin:$PATH
```

显然，你要在每次启动新终端都追加一遍 PATH，或将该指令添加到你的`.bashrc`或 [LMod][] 系统中。

而且，如果你想进行系统安装，请安装到`/usr/local`；这在 Docker 容器中是一个很好的选择，例如在 GitLab CI 中。请不要在非容器化的系统上尝试。

```bash
docker $ wget -qO- "https://cmake.org/files/v4.4/cmake-4.4.0-linux-x86_64.tar.gz" | tar --strip-components=1 -xz -C /usr/local
```

如果你在一个没有 wget 的系统上，请使用`curl -s`代替`wget -qO-`。

你也可以在任何系统上构建 CMake，这很容易，但使用二进制文件通常是更快的。

## CMake 默认版本

下面是一些常见的构建环境和你会在上面发现的 CMake 版本。请自行安装 CMake，它只有 1-2 行，而且内置的版本没有什么 "特殊 "之处。它们通常也是向后兼容的。

### Windows

[winget 软件包][winget]是获取 CMake 的好方法。其他选择：

+++ {"no-pdf": true}

[![Chocolatey package](https://repology.org/badge/version-for-repo/chocolatey/cmake.svg)][chocolatey]
[![MSYS2 mingw package](https://repology.org/badge/version-for-repo/msys2_mingw/cmake.svg)][msys2]
[![MSYS2 msys2 package](https://repology.org/badge/version-for-repo/msys2_msys2/cmake.svg)][msys2]

+++

另外 [Scoop][scoop] 一般也是最新的。来自 CMake.org 的普通安装程序在 Windows 系统上通常也很常见。

### macOS

+++ {"no-pdf": true}

[![Homebrew package](https://repology.org/badge/version-for-repo/homebrew/cmake.svg)][homebrew]
[![Homebrew Casks package](https://repology.org/badge/version-for-repo/homebrew_casks/cmake.svg)][homebrew-cask]
[![MacPorts package](https://repology.org/badge/version-for-repo/macports/cmake.svg)][macports]

+++

至少根据 Google Trends 的调查，如今 Homebrew 在 macOS 上的流行程度是相当高的。

### Linux

#### RHEL/Rocky/Alma/CentOS Stream

+++ {"no-pdf": true}

[![Rocky Linux 9 package](https://repology.org/badge/version-for-repo/rocky_9/cmake.svg?minversion=3.15.0)][centos]
[![AlmaLinux 9 package](https://repology.org/badge/version-for-repo/almalinux_9/cmake.svg?minversion=3.15.0)][centos]
[![CentOS Stream 9 package](https://repology.org/badge/version-for-repo/centos_stream_9/cmake.svg?minversion=3.15.0)][centos]
[![CentOS Stream 10 package](https://repology.org/badge/version-for-repo/centos_stream_10/cmake.svg?minversion=3.15.0)][centos]

+++

RHEL 9 和 10（以及 Rocky Linux / AlmaLinux 重制版与 CentOS Stream）在 AppStream 仓库中提供了受维护的 CMake，并会在发行版的生命周期内持续更新，因此系统自带软件包是直接可用的；你不再需要仅仅为了获取一个版本合理的 CMake 而启用 EPEL（实际上 EPEL 现在也不再收录 CMake 了）。

#### Ubuntu

+++ {"no-pdf": true}

[![Ubuntu 22.04 package](https://repology.org/badge/version-for-repo/ubuntu_22_04/cmake.svg?minversion=3.15.0)](https://launchpad.net/ubuntu/jammy/+source/cmake)
[![Ubuntu 24.04 package](https://repology.org/badge/version-for-repo/ubuntu_24_04/cmake.svg?minversion=3.15.0)](https://launchpad.net/ubuntu/noble/+source/cmake)

+++

#### Debian

+++ {"no-pdf": true}

[![Debian 12 package](https://repology.org/badge/version-for-repo/debian_12/cmake.svg)][repology]
[![Debian 12 backports package](https://repology.org/badge/version-for-repo/debian_12_backports/cmake.svg)][repology]
[![Debian 13 package](https://repology.org/badge/version-for-repo/debian_13/cmake.svg)][repology]
[![Debian Unstable package](https://repology.org/badge/version-for-repo/debian_unstable/cmake.svg)][repology]

+++

#### 其它 Linux 发行版

+++ {"no-pdf": true}

[![Alpine Linux 3.23 package](https://repology.org/badge/version-for-repo/alpine_3_23/cmake.svg)](https://pkgs.alpinelinux.org/packages?name=cmake&branch=v3.23)
[![Arch package](https://repology.org/badge/version-for-repo/arch/cmake.svg)][repology]
[![Fedora 44 package](https://repology.org/badge/version-for-repo/fedora_44/cmake.svg)][repology]
[![FreeBSD port](https://repology.org/badge/version-for-repo/freebsd/cmake.svg)][repology]
[![OpenBSD port](https://repology.org/badge/version-for-repo/openbsd/cmake.svg)][repology]
[![Gentoo package](https://repology.org/badge/version-for-repo/gentoo/cmake.svg)][repology]
[![openSUSE Tumbleweed package](https://repology.org/badge/version-for-repo/opensuse_tumbleweed/cmake.svg)][repology]
[![Homebrew package](https://repology.org/badge/version-for-repo/homebrew/cmake.svg)][homebrew]

+++

### 常用工具

+++ {"no-pdf": true}

[![ConanCenter package](https://repology.org/badge/version-for-repo/conancenter/cmake.svg)][repology]
[![PyPI](https://img.shields.io/pypi/v/cmake)][pypi]
[![Conda-forge](https://img.shields.io/conda/vn/conda-forge/cmake.svg)][conda-forge]
[![Anaconda](https://anaconda.org/anaconda/cmake/badges/version.svg?style=flat)][anaconda]

+++

在许多系统上只需`pip install cmake`。如果需要的话，请添加`--user`（如果需要的话，modern pip 会为你做好这个）。macOS 现已提供 Universal2 的轮子（wheels），同时支持 Intel 和 Apple Silicon。

### CI

| 分布情况 | CMake 版本 | 说明 |
| --- | --- | --- |
| [Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/hosted?view=azure-devops#use-a-microsoft-hosted-agent) | 3.31 | 保持最新 |
| [GitHub Actions ubuntu-22.04](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2204-Readme.md) | 3.31 | 与 Azure DevOps 使用相同的运行器 |
| [GitHub Actions ubuntu-24.04](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md) | 3.31 | 即 `ubuntu-latest`；与 Azure DevOps 使用相同的运行器 |

如果你在使用 GitHub Actions，也可以查看 [jwlawson/actions-setup-cmake](https://github.com/marketplace/actions/actions-setup-cmake) 进行操作，它可以安装你选择的 CMake，即使是在 docker 中也可以操作运行。

### 完整列表

小于 3.15 的版本用更深的红色标记。

+++ {"no-pdf": true}

[![Full listing](https://repology.org/badge/vertical-allrepos/cmake.svg?columns=3&minversion=3.15.0)][repology]

+++

也可参见 [pkgs.org/download/cmake](https://pkgs.org/download/cmake)。

## Pip

[这][pypi]也是一个官方软件包，由 KitWare 的 CMake 作者以及包括我本人在内的几位 PyPA 成员共同维护。它现在支持多种特殊架构（例如 Linux 上的 PowerPC 和 macOS 上的 Apple Silicon），同时也支持 Alpine 等基于 MUSL 的系统。如果你安装了 pip（Python 的软件包安装程序），你可以这样做：

```bash
pip install cmake
```

只要你的系统中存在二进制文件，你便可以立即启动并运行它。如果二进制文件不存在，它将尝试从源码构建（该软件包使用 `scikit-build-core` 构建），这需要系统中已有一份可用的 CMake 副本。因此，只有在二进制文件存在的情况下我们才能使用这种方式，大多数情况下都是这样的。

这样做的好处是能遵从你当前的虚拟环境。然而，当它被放置在`pyproject.toml`文件中时，它才真正发挥了作用--它只会被安装到构建你的软件包中，而不会在之后保留下来！这简直太棒了。

当然，它也支持 pipx。因此你甚至可以直接使用 `pipx run cmake` 在一次性虚拟环境中运行 CMake，无需任何前置配置——而且这在 GitHub Actions 上开箱即用，因为 `pipx` 是那里原生支持的包管理器！

:::{tip}

就我个人而言，在 Linux 上时，我会把 CMake 的版本放入文件夹名中，比如`/opt/cmake312`或`~/opt/cmake312`，然后再把它们添加到 [LMod][]。参见[`envmodule_setup`][envmodule_setup]，它可以帮助你在 macOS 或 Linux 上设置 LMod 系统。这需要花点时间来学习，但这是管理软件包和编译器版本的一个好方法。

[envmodule_setup]: https://github.com/CLIUtils/envmodule_setup

:::

[^1]: 我想这是显而易见的，但你现在正在下载和运行代码，这会使你暴露在其他人的攻击之下。如果你是在一个重要的环境中，你应该下载文件并检查校验码。(注意，简单地分两步做并不能使你更安全，只有校验和码更安全)

[^2]: 如果你的主目录中没有`.local`，想要开始也很容易。只要建立这个文件夹，然后把`export PATH="$HOME/.local/bin:$PATH"`添加到你的`.bashrc`或`.bash_profile`或`.profile`文件中。现在你可以把你构建的任何软件包安装到`-DCMAKE_INSTALL_PREFIX=~/.local`而不是`/usr/local`!

[repology]: https://repology.org/project/cmake/versions
[lmod]: http://lmod.readthedocs.io/en/latest/
[apt]: https://apt.kitware.com/
[snap]: https://snapcraft.io/cmake
[pypi]: https://pypi.org/project/cmake/
[winget]: https://github.com/microsoft/winget-pkgs/tree/master/manifests/k/Kitware/CMake
[chocolatey]: https://chocolatey.org/packages/cmake
[scoop]: https://github.com/ScoopInstaller/Main/blob/master/bucket/cmake.json
[msys2]: https://packages.msys2.org/base/mingw-w64-cmake
[anaconda]: https://anaconda.org/anaconda/cmake
[conda-forge]: https://github.com/conda-forge/cmake-feedstock
[download]: https://cmake.org/download/
[homebrew]: https://formulae.brew.sh/formula/cmake
[homebrew-cask]: https://formulae.brew.sh/cask/cmake
[macports]: https://ports.macports.org/port/cmake/summary
[centos]: https://rpms.remirepo.net/rpmphp/zoom.php?rpm=cmake
