# Installing CMake

{% hint style='tip' %}
Your CMake version should be newer than your compiler. It should be newer than the libraries you are using (especially Boost). New versions work better for everyone.
{% endhint %}

If you have a built in copy of CMake, it isn't special or customized for your system. You can easily install a new one instead, either on the system level or the user level. Feel free to instruct your users here if they complain about a CMake requirement being set too high. Especially if they want 3.1+ support. Maybe even if they want 3.21+ support...

#### Quick list (more info on each method below)

Ordered by author preference:

* All
    - [Pip][PyPI] (official, sometimes delayed slightly)
    - [Anaconda][] / [Conda-Forge][]
* Windows
    - [Chocolatey][]
    - [Scoop][]
    - [MSYS2][]
    - [Download binary][download] (official)
* MacOS
    - [Homebrew][]
    - [MacPorts][]
    - [Download binary][download] (official)
* Linux
    - [Snapcraft][snap] (official)
    - [APT repository][apt] (Ubuntu/Debian only) (official)
    - [Download binary][download] (official)

## Official package

You can [download CMake from KitWare][download]. This is how you will probably get CMake if you are on Windows. It's not a bad way to get it on macOS either (and a Universal2 version is supplied supporting both Intel and Apple Silicon), but using `brew install cmake` is much nicer if you use [Homebrew](https://brew.sh) (and you should; Apple even supports Homebrew such as during the Apple Silicon rollout). You can also get it on most other package managers, such as [Chocolatey](https://chocolatey.org) for Windows or [MacPorts](https://www.macports.org) for macOS.

On Linux, there are several options. Kitware provides a [Debian/Ubunutu apt repository][apt], as well as [snap packages][snap]. There are universal Linux binaries provided, but you'll need to pick an install location. If you already use `~/.local` for user-space packages, the following single line command[^1] will get CMake for you [^2]:

{% term %}
~ $ wget -qO- "https://cmake.org/files/v3.21/cmake-3.21.0-linux-x86_64.tar.gz" | tar --strip-components=1 -xz -C ~/.local
{% endterm %}

The names changed in 3.21; older releases had names like `cmake-3.19.7-Linux-x86_64.tar.gz`. If you just want a local folder with CMake only:

{% term %}
~ $ mkdir -p cmake-3.21 && wget -qO- "https://cmake.org/files/v3.21/cmake-3.21.0-linux-x86_64.tar.gz" | tar --strip-components=1 -xz -C cmake-3.21
~ $ export PATH=`pwd`/cmake-3.21/bin:$PATH
{% endterm %}

You'll obviously want to append to the PATH every time you start a new terminal, or add it to your `.bashrc` or to an [LMod][] system.

And, if you want a system install, install to `/usr/local`; this is an excellent choice in a Docker container, for example on GitLab CI. Do not try it on a non-containerized system.

{% term %}
docker $ wget -qO- "https://cmake.org/files/v3.21/cmake-3.21.0-linux-x86_64.tar.gz" | tar --strip-components=1 -xz -C /usr/local
{% endterm %}


If you are on a system without wget, replace `wget -qO-` with `curl -s`.

You can also build CMake on any system, it's pretty easy, but binaries are faster.

## CMake Default Versions

Here are some common build environments and the CMake version you'll find on them. Feel free to install CMake yourself, it's 1-2 lines and there's nothing "special" about the built in version. It's also very backward compatible.

### Windows

[![Chocolatey package](https://repology.org/badge/version-for-repo/chocolatey/cmake.svg)][chocolatey]
[![MSYS2 mingw package](https://repology.org/badge/version-for-repo/msys2_mingw/cmake.svg)][MSYS2]
[![MSYS2 msys2 package](https://repology.org/badge/version-for-repo/msys2_msys2/cmake.svg)][MSYS2]

Also [Scoop][scoop] is generally up to date. The normal installers from CMake.org are common on Windows, too.

### MacOS

[![Homebrew package](https://repology.org/badge/version-for-repo/homebrew/cmake.svg)][homebrew]
[![Homebrew Casks package](https://repology.org/badge/version-for-repo/homebrew_casks/cmake.svg)][homebrew-cask]
[![MacPorts package](https://repology.org/badge/version-for-repo/macports/cmake.svg)][macports]

Homebrew is quite a bit more popular nowadays on macOS, at least according to Google Trends.

### Linux

#### RHEL/CentOS

[![CentOS 7 package](https://repology.org/badge/version-for-repo/centos_7/cmake.svg?minversion=3.10.0)][centos]
[![CentOS 8 package](https://repology.org/badge/version-for-repo/centos_8/cmake.svg?minversion=3.10.0)][centos]
[![EPEL 7 package](https://repology.org/badge/version-for-repo/epel_7/cmake.svg?minversion=3.10.0)][centos]

The default on 8 is not too bad, but you should not use the default on 7. Use the EPEL package instead.

#### Ubuntu

[![Ubuntu 14.04 package](https://repology.org/badge/version-for-repo/ubuntu_14_04/cmake.svg?minversion=3.10.0)](https://launchpad.net/ubuntu/trusty/+source/cmake)
[![Ubuntu 16.04 package](https://repology.org/badge/version-for-repo/ubuntu_16_04/cmake.svg?minversion=3.10.0)](https://launchpad.net/ubuntu/xenial/+source/cmake)
[![Ubuntu 18.04 package](https://repology.org/badge/version-for-repo/ubuntu_18_04/cmake.svg?minversion=3.10.0)](https://launchpad.net/ubuntu/bionic/+source/cmake)
[![Ubuntu 20.04 package](https://repology.org/badge/version-for-repo/ubuntu_20_04/cmake.svg?minversion=3.10.0)](https://launchpad.net/ubuntu/focal/+source/cmake)

You should only use the default CMake on 18.04+; it's an LTS release with a pretty decent minimum version!

#### Other

[![Alpine Linux 3.12 package](https://repology.org/badge/version-for-repo/alpine_3_12/cmake.svg)](https://pkgs.alpinelinux.org/packages?name=cmake&branch=v3.12)
[![Arch package](https://repology.org/badge/version-for-repo/arch/cmake.svg)][repology]
[![Debian Stable package](https://repology.org/badge/version-for-repo/debian_stable/cmake.svg)][repology]
[![Debian Testing package](https://repology.org/badge/version-for-repo/debian_testing/cmake.svg)][repology]
[![Fedora 32 package](https://repology.org/badge/version-for-repo/fedora_32/cmake.svg)][repology]
[![FreeBSD port](https://repology.org/badge/version-for-repo/freebsd/cmake.svg)][repology]
[![OpenBSD port](https://repology.org/badge/version-for-repo/openbsd/cmake.svg)][repology]
[![Gentoo package](https://repology.org/badge/version-for-repo/gentoo/cmake.svg)][repology]
[![openSUSE Tumbleweed package](https://repology.org/badge/version-for-repo/opensuse_tumbleweed/cmake.svg)][repology]
[![Linuxbrew package](https://repology.org/badge/version-for-repo/linuxbrew/cmake.svg)][repology]


### General tools

[![ConanCenter package](https://repology.org/badge/version-for-repo/conancenter/cmake.svg)][repology]
[![PyPI](https://img.shields.io/pypi/v/cmake)][PyPI]
[![Conda-forge](https://img.shields.io/conda/vn/conda-forge/cmake.svg)][Conda-Forge]
[![Anaconda](https://anaconda.org/anaconda/cmake/badges/version.svg?style=flat)][Anaconda]

Just `pip install cmake` on many systems. Add `--user` if you have to (modern pip does this for you if needed). This does not supply Universal2 wheels yet.


### CI

| Distribution  | CMake version | Notes |
|---------------|---------------|-------|
| [TravisCI Xenial](https://docs.travis-ci.com/user/reference/xenial/#compilers-and-build-toolchain) | 3.12.4 | Mid November 2018 this image became ready for widescale use. |
| [TravisCI Bionic](https://docs.travis-ci.com/user/reference/bionic/#compilers-and-build-toolchain) | 3.12.4 | Same as Xenial at the moment. |
| [Azure DevOps 18.04](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/hosted?view=azure-devops#use-a-microsoft-hosted-agent) | 3.17.0 | |
| [GitHub Actions 18.04](https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu1804-README.md) | 3.17.0 | Mostly in sync with Azure DevOps |
| [GitHub Actions 20.04](https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu2004-README.md) | 3.17.0 | Mostly in sync with Azure DevOps |

If you are using GitHub Actions, also see the [jwlawson/actions-setup-cmake](https://github.com/marketplace/actions/actions-setup-cmake) action, which can install your selection of CMake, even in a docker action run.

### Full list

Versions less than 3.10 are marked by a deeper color of red.

[![Full listing](https://repology.org/badge/vertical-allrepos/cmake.svg?columns=3&minversion=3.10.0)][repology]


Also see [pkgs.org/download/cmake](https://pkgs.org/download/cmake).

## Pip

[This][PyPI] is also provided as an official package, maintained by the authors of CMake at KitWare. It's a rather new method, and might fail on some systems (Alpine isn't supported last I checked, but that has a recent CMake), but works really well when it works (like on Travis CI). If you have pip (Python's package installer), you can do:

```term
gitbook $ pip install cmake
```

And as long as a binary exists for your system, you'll be up-and-running almost immediately. If a binary doesn't exist, it will try to use KitWare's `scikit-build` package to build, which currently can't be listed as a dependency in the packaging system, and might even require (an older) copy of CMake to build. So only use this system if binaries exist, which is most of the time.

This has the benefit of respecting your current virtual environment, as well. It really shines when placed in a `pyproject.toml` file, however - it will only be installed to build your package, and will not remain afterwords! Fantastic.

{% hint style='info' %}
Personally, on Linux, I put versions of CMake in folders, like `/opt/cmake312` or `~/opt/cmake312`, and then add them to [LMod][]. See [`envmodule_setup`][envmodule_setup] for help setting up an LMod system on macOS or Linux. It takes a bit to learn, but is a great way to manage package and compiler versions.
[envmodule_setup]: https://github.com/CLIUtils/envmodule_setup
{% endhint %}

[^1]: I assume this is obvious, but you are downloading and running code, which exposes you to a man in the middle attack. If you are in a critical environment, you should download the file and check the checksum. (And, no, simply doing this in two steps does not make you any safer, only a checksum is safer).
[^2]: If you don't have a `.local` in your home directory, it's easy to start. Just make the folder, then add `export PATH="$HOME/.local/bin:$PATH"` to your `.bashrc` or `.bash_profile` or `.profile` file in your home directory. Now you can install any packages you build to `-DCMAKE_INSTALL_PREFIX=~/.local` instead of `/usr/local`!

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
