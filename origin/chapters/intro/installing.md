# Installing CMake

:::{tip}

Your CMake version should be newer than your compiler. It should be newer than the libraries you are using. New versions work better for everyone.

:::

If you have a built in copy of CMake, it isn't special or customized for your system. You can easily install a new one instead, either on the system level or the user level. Feel free to instruct your users here if they complain about a CMake requirement being set too high. Especially if they want 3.15+ support. Maybe even if they want 4.4+ support...

## Quick list (more info on each method below)

Ordered by author preference:

- All
  - [Pip(x)][pypi] (official, often updates same-day)
  - [Anaconda][] / [Conda-Forge][]
- Windows
  - [Winget][]
  - [Chocolatey][]
  - [Scoop][]
  - [MSYS2][]
  - [Download binary][download] (official)
- MacOS
  - [Homebrew][]
  - [MacPorts][]
  - [Download binary][download] (official)
- Linux
  - [Snapcraft][snap] (official)
  - [APT repository][apt] (Ubuntu/Debian only) (official)
  - [Download binary][download] (official)

## Official package

You can [download CMake from KitWare][download]. This is how you will probably get CMake if you are on Windows. It's not a bad way to get it on macOS either (and a Universal2 version is supplied supporting both Intel and Apple Silicon), but using `brew install cmake` is much nicer if you use [Homebrew](https://brew.sh) (and you should; Apple even supports Homebrew such as during the Apple Silicon rollout). You can also get it on most other package managers, such as [Chocolatey](https://chocolatey.org) for Windows or [MacPorts](https://www.macports.org) for macOS.

On Linux, there are several options. Kitware provides a [Debian/Ubuntu apt repository][apt], as well as [snap packages][snap]. There are universal Linux binaries provided, but you'll need to pick an install location. If you already use `~/.local` for user-space packages, the following single line command[^1] will get CMake for you [^2]:

```bash
~ $ wget -qO- "https://cmake.org/files/v4.4/cmake-4.4.0-linux-x86_64.tar.gz" | tar --strip-components=1 -xz -C ~/.local
```

The names changed in 3.20; older releases had names like `cmake-3.19.7-Linux-x86_64.tar.gz`. If you just want a local folder with CMake only:

```bash
~ $ mkdir -p cmake-4.4 && wget -qO- "https://cmake.org/files/v4.4/cmake-4.4.0-linux-x86_64.tar.gz" | tar --strip-components=1 -xz -C cmake-4.4
~ $ export PATH=`pwd`/cmake-4.4/bin:$PATH
```

You'll obviously want to append to the PATH every time you start a new terminal, or add it to your `.bashrc` or to an [LMod][] system.

And, if you want a system install, install to `/usr/local`; this is an excellent choice in a Docker container, for example on GitLab CI. Do not try it on a non-containerized system.

```bash
docker $ wget -qO- "https://cmake.org/files/v4.4/cmake-4.4.0-linux-x86_64.tar.gz" | tar --strip-components=1 -xz -C /usr/local
```

If you are on a system without wget, replace `wget -qO-` with `curl -s`.

You can also build CMake on any system, it's pretty easy, but binaries are faster.

## CMake Default Versions

Here are some common build environments and the CMake version you'll find on them. Feel free to install CMake yourself, it's 1-2 lines and there's nothing "special" about the built in version. It's also very backward compatible.

### Windows

[The winget package][winget] is a good way to get CMake. Other options:

+++ {"no-pdf": true}

[![Chocolatey package](https://repology.org/badge/version-for-repo/chocolatey/cmake.svg)][chocolatey]
[![MSYS2 mingw package](https://repology.org/badge/version-for-repo/msys2_mingw/cmake.svg)][msys2]
[![MSYS2 msys2 package](https://repology.org/badge/version-for-repo/msys2_msys2/cmake.svg)][msys2]

+++

Also [Scoop][scoop] is generally up to date. The normal installers from CMake.org are common on Windows, too.

### MacOS

+++ {"no-pdf": true}

[![Homebrew package](https://repology.org/badge/version-for-repo/homebrew/cmake.svg)][homebrew]
[![Homebrew Casks package](https://repology.org/badge/version-for-repo/homebrew_casks/cmake.svg)][homebrew-cask]
[![MacPorts package](https://repology.org/badge/version-for-repo/macports/cmake.svg)][macports]

+++

Homebrew is quite a bit more popular nowadays on macOS, at least according to Google Trends.

### Linux

#### RHEL/Rocky/Alma/CentOS Stream

+++ {"no-pdf": true}

[![Rocky Linux 9 package](https://repology.org/badge/version-for-repo/rocky_9/cmake.svg?minversion=3.15.0)][centos]
[![AlmaLinux 9 package](https://repology.org/badge/version-for-repo/almalinux_9/cmake.svg?minversion=3.15.0)][centos]
[![CentOS Stream 9 package](https://repology.org/badge/version-for-repo/centos_stream_9/cmake.svg?minversion=3.15.0)][centos]
[![CentOS Stream 10 package](https://repology.org/badge/version-for-repo/centos_stream_10/cmake.svg?minversion=3.15.0)][centos]

+++

RHEL 9 and 10 (and the Rocky Linux / AlmaLinux rebuilds and CentOS Stream) ship a maintained CMake in AppStream and update it over the release's lifetime, so the system package is usable; you no longer need EPEL just to get a reasonable CMake (EPEL doesn't even carry one anymore).

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

#### Other

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

### General tools

+++ {"no-pdf": true}

[![ConanCenter package](https://repology.org/badge/version-for-repo/conancenter/cmake.svg)][repology]
[![PyPI](https://img.shields.io/pypi/v/cmake)][pypi]
[![Conda-forge](https://img.shields.io/conda/vn/conda-forge/cmake.svg)][conda-forge]
[![Anaconda](https://anaconda.org/anaconda/cmake/badges/version.svg?style=flat)][anaconda]

+++

Just `pip install cmake` on many systems. Add `--user` if you have to (modern pip does this for you if needed). Universal2 wheels are supplied for macOS, covering both Intel and Apple Silicon.

### CI

| Distribution                                                                                                                         | CMake version | Notes                                         |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------- | --------------------------------------------- |
| [Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/hosted?view=azure-devops#use-a-microsoft-hosted-agent) | 3.31          | kept up to date                               |
| [GitHub Actions ubuntu-22.04](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2204-Readme.md)                 | 3.31          | Same runners as Azure DevOps                  |
| [GitHub Actions ubuntu-24.04](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md)                 | 3.31          | `ubuntu-latest`; same runners as Azure DevOps |

If you are using GitHub Actions, also see the [jwlawson/actions-setup-cmake](https://github.com/marketplace/actions/actions-setup-cmake) action, which can install your selection of CMake, even in a docker action run.

### Full list

Versions less than 3.15 are marked by a deeper color of red.

+++ {"no-pdf": true}

[![Full listing](https://repology.org/badge/vertical-allrepos/cmake.svg?columns=3&minversion=3.15.0)][repology]

+++

Also see [pkgs.org/download/cmake](https://pkgs.org/download/cmake).

## Pip

[This][pypi] is also provided as an official package, maintained by the authors of CMake at KitWare and several PyPA members, including myself. It's now supported on special architectures, like PowerPC on Linux and Apple Silicon on macOS, and on MUSL systems like Alpine too. If you have pip (Python's package installer), you can do:

```bash
pip install cmake
```

And as long as a binary exists for your system, you'll be up-and-running almost immediately. If a binary doesn't exist, it will try to build from source (the package is built with `scikit-build-core`), which requires an existing copy of CMake. So only use this system if binaries exist, which is most of the time.

This has the benefit of respecting your current virtual environment, as well. It really shines when placed in a `pyproject.toml` file, however - it will only be installed to build your package, and will not remain afterwards! Fantastic.

This also, of course, works with pipx. So you can even use `pipx run cmake` to run CMake in a disposable virtual environment, without any setup - and this works out-of-the-box on GitHub Actions, since `pipx` is a supported package manager there!

:::{tip}

Personally, on Linux, I put versions of CMake in folders, like `/opt/cmake312` or `~/opt/cmake312`, and then add them to [LMod][]. See [`envmodule_setup`][envmodule_setup] for help setting up an LMod system on macOS or Linux. It takes a bit to learn, but is a great way to manage package and compiler versions.

[envmodule_setup]: https://github.com/CLIUtils/envmodule_setup

:::

[^1]: I assume this is obvious, but you are downloading and running code, which exposes you to a man in the middle attack. If you are in a critical environment, you should download the file and check the checksum. (And, no, simply doing this in two steps does not make you any safer, only a checksum is safer).

[^2]: If you don't have a `.local` in your home directory, it's easy to start. Just make the folder, then add `export PATH="$HOME/.local/bin:$PATH"` to your `.bashrc` or `.bash_profile` or `.profile` file in your home directory. Now you can install any packages you build to `-DCMAKE_INSTALL_PREFIX=~/.local` instead of `/usr/local`!

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
