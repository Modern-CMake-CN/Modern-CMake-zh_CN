# 安装 CMake

{% hint style='tip' %}
你的CMake版本应该比你的编译器要更新，它应该比你使用的所有库（尤其是Boost）都要更新。新版本对任何一个人来说都是有好处的。
{% endhint %}

如果你拥有一个CMake的内置副本，这对你的系统来说并不特殊。你可以在系统层面或用户层面轻松地安装一个新的来代替它。如果你的用户抱怨CMake的要求被设置得太高，请随时使用这里的内容来指导他们。尤其是当他们想要3.1版本以上，甚至是3.21以上版本的时候......

#### 快速一览（下面有关于每种方法的更多信息)

按作者的偏好排序：

* 所有系统
    - [Pip][PyPI] (官方的，有时会稍有延迟)
    - [Anaconda][] / [Conda-Forge][]
* Windows
    - [Chocolatey][]
    - [Scoop][]
    - [MSYS2][]
    - [Download binary][download] (官方的)
* macOS
    - [Homebrew][]
    - [MacPorts][]
    - [Download binary][download] (官方的)
* Linux
    - [Snapcraft][snap] (官方的)
    - [APT repository][apt] (仅适用于Ubuntu/Debian) (官方的)
    - [Download binary][download] (官方的)

## 官方安装包

你可以从[KitWare][download]上下载CMake。如果你是在Windows上，这可能就是你获得CMake的方式。在macOS上获得它的方法也不错（而且开发者还提供了支持Intel和Apple Silicon的Universal2版本），但如果你使用[Homebrew](https://brew.sh)的话，使用`brew install cmake`会带来更好的效果（你应该这样做；苹果甚至支持Homebrew，比如在Apple Silicon的推出期间）。你也可以在大多数的其他软件包管理器上得到它，比如Windows的[Chocolatey](https://chocolatey.org)或macOS的[MacPorts](https://www.macports.org)。

在Linux上，有几种选择。Kitware提供了一个[Debian/Ubunutu apt软件库][apt]，以及[snap软件包][snap]。官方同时提供了Linux的二进制文件包，但需要你去选择一个安装位置。如果你已经使用`~/.local`存放用户空间的软件包，下面的单行命令[^1]将为你安装CMake[^2]。

{% term %}
~ $ wget -qO- "https://cmake.org/files/v3.21/cmake-3.21.0-linux-x86_64.tar.gz" | tar --strip-components=1 -xz -C ~/.local
{% endterm %}

上面的名字在3.21版本中发生了改变：在旧版本中，包名是`cmake-3.19.7-Linux-x86_64.tar.gz`。如果你只是想要一个仅有CMake的本地文件夹：

{% term %}
~ $ mkdir -p cmake-3.21 && wget -qO- "https://cmake.org/files/v3.21/cmake-3.21.0-linux-x86_64.tar.gz" | tar --strip-components=1 -xz -C cmake-3.21
~ $ export PATH=`pwd`/cmake-3.21/bin:$PATH
{% endterm %}

显然，你要在每次启动新终端都追加一遍PATH，或将该指令添加到你的`.bashrc'或[LMod][]系统中。

而且，如果你想进行系统安装，请安装到`/usr/local`；这在Docker容器中是一个很好的选择，例如在GitLab CI中。请不要在非容器化的系统上尝试。

{% term %}
docker $ wget -qO- "https://cmake.org/files/v3.21/cmake-3.21.0-linux-x86_64.tar.gz" | tar --strip-components=1 -xz -C /usr/local
{% endterm %}

如果你在一个没有wget的系统上，请使用`curl -s`代替`wget -qO-`。

你也可以在任何系统上构建CMake，这很容易，但使用二进制文件通常是更快的。

## CMake默认版本

下面是一些常见的构建环境和你会在上面发现的CMake版本。请自行安装CMake，它只有1-2行，而且内置的版本没有什么 "特殊 "之处。它们通常也是向后兼容的。

### Windows

[![Chocolatey package](https://repology.org/badge/version-for-repo/chocolatey/cmake.svg)][chocolatey]
[![MSYS2 mingw package](https://repology.org/badge/version-for-repo/msys2_mingw/cmake.svg)][MSYS2]
[![MSYS2 msys2 package](https://repology.org/badge/version-for-repo/msys2_msys2/cmake.svg)][MSYS2]

另外[Scoop][scoop]一般也是最新的。来自CMake.org的普通安装程序在Windows系统上通常也很常见。

### macOS

[![Homebrew package](https://repology.org/badge/version-for-repo/homebrew/cmake.svg)][homebrew]
[![Homebrew Casks package](https://repology.org/badge/version-for-repo/homebrew_casks/cmake.svg)][homebrew-cask]
[![MacPorts package](https://repology.org/badge/version-for-repo/macports/cmake.svg)][macports]

至少根据Google Trends的调查，如今Homebrew在macOS上的流行程度是相当高的。

### Linux

#### RHEL/CentOS

[![CentOS 7 package](https://repology.org/badge/version-for-repo/centos_7/cmake.svg?minversion=3.10.0)][centos]
[![CentOS 8 package](https://repology.org/badge/version-for-repo/centos_8/cmake.svg?minversion=3.10.0)][centos]
[![EPEL 7 package](https://repology.org/badge/version-for-repo/epel_7/cmake.svg?minversion=3.10.0)][centos]

CentOS 8上的默认安装包不算太差，但最好不要使用CentOS 7上的默认安装包。请使用EPEL包来代替它。

#### Ubuntu

[![Ubuntu 14.04 package](https://repology.org/badge/version-for-repo/ubuntu_14_04/cmake.svg?minversion=3.10.0)](https://launchpad.net/ubuntu/trusty/+source/cmake)
[![Ubuntu 16.04 package](https://repology.org/badge/version-for-repo/ubuntu_16_04/cmake.svg?minversion=3.10.0)](https://launchpad.net/ubuntu/xenial/+source/cmake)
[![Ubuntu 18.04 package](https://repology.org/badge/version-for-repo/ubuntu_18_04/cmake.svg?minversion=3.10.0)](https://launchpad.net/ubuntu/bionic/+source/cmake)
[![Ubuntu 20.04 package](https://repology.org/badge/version-for-repo/ubuntu_20_04/cmake.svg?minversion=3.10.0)](https://launchpad.net/ubuntu/focal/+source/cmake)
[![Ubuntu 22.04 package](https://repology.org/badge/version-for-repo/ubuntu_22_04/cmake.svg?minversion=3.10.0)](https://launchpad.net/ubuntu/jammy/+source/cmake)

你应该只在18.04以上的版本使用默认的CMake；它是一个LTS版本，并且有一个相当不错的最低版本！

#### Debian

[![Debian 10 package](https://repology.org/badge/version-for-repo/debian_10/cmake.svg)][repology] 
[![Debian 10 backports package](https://repology.org/badge/version-for-repo/debian_10_backports/cmake.svg)][repology] 
[![Debian 11 package](https://repology.org/badge/version-for-repo/debian_11/cmake.svg)][repology] 
[![Debian 11 backports package](https://repology.org/badge/version-for-repo/debian_11_backports/cmake.svg)][repology] 
[![Debian Unstable package](https://repology.org/badge/version-for-repo/debian_unstable/cmake.svg)][repology]

#### 其它Linux发行版

[![Alpine Linux 3.15 package](https://repology.org/badge/version-for-repo/alpine_3_15/cmake.svg)](https://pkgs.alpinelinux.org/packages?name=cmake&branch=v3.15)
[![Arch package](https://repology.org/badge/version-for-repo/arch/cmake.svg)][repology]
[![Fedora 35 package](https://repology.org/badge/version-for-repo/fedora_35/cmake.svg)][repology]
[![FreeBSD port](https://repology.org/badge/version-for-repo/freebsd/cmake.svg)][repology]
[![OpenBSD port](https://repology.org/badge/version-for-repo/openbsd/cmake.svg)][repology]
[![Gentoo package](https://repology.org/badge/version-for-repo/gentoo/cmake.svg)][repology]
[![openSUSE Tumbleweed package](https://repology.org/badge/version-for-repo/opensuse_tumbleweed/cmake.svg)][repology]
[![Homebrew package](https://repology.org/badge/version-for-repo/homebrew/cmake.svg)][homebrew]


### 常用工具

[![ConanCenter package](https://repology.org/badge/version-for-repo/conancenter/cmake.svg)][repology]
[![PyPI](https://img.shields.io/pypi/v/cmake)][PyPI]
[![Conda-forge](https://img.shields.io/conda/vn/conda-forge/cmake.svg)][Conda-Forge]
[![Anaconda](https://anaconda.org/anaconda/cmake/badges/version.svg?style=flat)][Anaconda]


在许多系统上只需`pip install cmake`。如果需要的话，请添加`--user'（如果需要的话，modern pip会为你做好这个）。然而它目前还没有提供Universal2的轮子（wheels）。


### CI

| 分布情况 | CMake 版本 | 说明 |
|---------------|---------------|-------|
| [TravisCI Xenial](https://docs.travis-ci.com/user/reference/xenial/#compilers-and-build-toolchain) | 3.12.4 | 2018年11月中旬，这一映像已准备好广泛使用 |
| [TravisCI Bionic](https://docs.travis-ci.com/user/reference/bionic/#compilers-and-build-toolchain) | 3.12.4 | 目前与Xenial一样 |
| [Azure DevOps 18.04](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/hosted?view=azure-devops#use-a-microsoft-hosted-agent) | 3.17.0 | |
| [GitHub Actions 18.04](https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu1804-README.md) | 3.17.0 | 大部分与Azure DevOps保持同步 |
| [GitHub Actions 20.04](https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu2004-README.md) | 3.17.0 | 大部分与Azure DevOps保持同步 |

如果你在使用GitHub Actions，也可以查看[jwlawson/actions-setup-cmake](https://github.com/marketplace/actions/actions-setup-cmake)进行操作，它可以安装你选择的CMake，即使是在docker中也可以操作运行。

### 完整列表

小于3.10的版本用更深的红色标记。

[![Full listing](https://repology.org/badge/vertical-allrepos/cmake.svg?columns=3&minversion=3.10.0)][repology]

也可参见[pkgs.org/download/cmake](https://pkgs.org/download/cmake)。

## Pip

[这][PyPI]也是一个官方软件包，由CMake作者在KitWare进行维护。这是一种相当新的方法，在某些系统上可能会失败（在我最后一次检查时，Alpine还不被支持，但它有当时最新的CMake），但它工作的效果非常好（例如在Travis CI上）。如果你安装了pip（Python的软件包安装程序），你可以这样做：

```term
gitbook $ pip install cmake
```

只要你的系统中存在二进制文件，你便可以立即启动并运行它。如果二进制文件不存在，它将尝试使用KitWare的`scikit-build`包来进行构建。目前它还无法在软件包系统中作为依赖项，甚至可能需要（较早的）CMake副本来构建。因此，只有在二进制文件存在的情况下我们才能使用这种方式，大多数情况下都是这样的。

这样做的好处是能遵从你当前的虚拟环境。然而，当它被放置在`pyproject.toml`文件中时，它才真正发挥了作用--它只会被安装到构建你的软件包中，而不会在之后保留下来！这简直太棒了。

{% hint style='info' %}

就我个人而言，在Linux上时，我会把CMake的版本放入文件夹名中，比如`/opt/cmake312`或`~/opt/cmake312`，然后再把它们添加到[LMod][]。参见[`envmodule_setup`][envmodule_setup]，它可以帮助你在macOS或Linux上设置LMod系统。这需要花点时间来学习，但这是管理软件包和编译器版本的一个好方法。

[envmodule_setup]: https://github.com/CLIUtils/envmodule_setup
{% endhint %}

[^1]: 我想这是显而易见的，但你现在正在下载和运行代码，这会使你暴露在其他人的攻击之下。如果你是在一个重要的环境中，你应该下载文件并检查校验码。(注意，简单地分两步做并不能使你更安全，只有校验和码更安全)
[^2]: 如果你的主目录中没有`.local`，想要开始也很容易。只要建立这个文件夹，然后把`export PATH="$HOME/.local/bin:$PATH"`添加到你的`.bashrc`或`.bash_profile`或`.profile`文件中。现在你可以把你构建的任何软件包安装到`-DCMAKE_INSTALL_PREFIX=~/.local`而不是`/usr/local`!

[repology]:      https://repology.org/project/cmake/versions
[LMod]:          http://lmod.readthedocs.io/en/latest/
[apt]:           https://apt.kitware.com/
[snap]:          https://snapcraft.io/cmake
[PyPI]:          https://pypi.org/project/cmake/
[chocolatey]:    https://chocolatey.org/packages/cmake
[scoop]:         https://github.com/ScoopInstaller/Main/blob/master/bucket/cmake.json
[MSYS2]:         https://packages.msys2.org/base/mingw-w64-cmake
[anaconda]:      https://anaconda.org/anaconda/cmake
[conda-forge]:   https://github.com/conda-forge/cmake-feedstock
[download]:      https://cmake.org/download/
[homebrew]:      https://formulae.brew.sh/formula/cmake
[homebrew-cask]: https://formulae.brew.sh/cask/cmake
[macports]:      https://ports.macports.org/port/cmake/summary
[centos]:        https://rpms.remirepo.net/rpmphp/zoom.php?rpm=cmake
[下载]: 
