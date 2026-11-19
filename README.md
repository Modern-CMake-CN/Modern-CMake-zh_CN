# Modern CMake 简体中文版

## 概述

这是著名 CMake 教程 [Modern CMake](https://cliutils.gitlab.io/modern-cmake/) 的简体中文翻译版。

它致力于解决网络上随处可见的糟糕示例以及所谓的“最佳实践”中存在的问题。如果你想要学好现代 CMake（CMake 3.15+），相信你会从这本书中受益！

- **简体中文在线阅读**：<https://modern-cmake-cn.github.io/Modern-CMake-zh_CN/>
- **简体中文 PDF 下载**：<https://modern-cmake-cn.github.io/Modern-CMake-zh_CN/modern-cmake.pdf>
- **英文原版在线阅读**：<https://cliutils.gitlab.io/modern-cmake/>
- **英文原版源码仓库**：<https://gitlab.com/CLIUtils/modern-cmake>

## 上游同步基线

当前译文与示例基于英文原版提交 [`0f0c7e7c`](https://gitlab.com/CLIUtils/modern-cmake/-/commit/0f0c7e7c28aac7c052eefa6af64a477007095529)，内容覆盖至 CMake 4.4。`origin/` 保存对应的英文原稿及示例快照，中文正文、代码块中的讲解注释和 `examples/` 中的说明注释均在此基础上翻译。

## 本地构建与预览

本书与上游保持一致，使用 [Pixi](https://pixi.sh/) 管理 [MyST Markdown](https://mystmd.org/) 与 [Typst](https://typst.app/) 构建环境。

安装 Pixi 后，可在仓库根目录下执行以下命令：

```bash
# 启动本地实时预览服务（支持热重载）
pixi run serve

# 构建静态 HTML 站点（输出至 _build/html）
pixi run build

# 导出 PDF 电子书（输出至 _build/pdf/modern-cmake.pdf）
pixi run pdf
```

> 注：在 Linux 环境下导出 PDF 时，建议先安装中文字体与图像处理工具（例如 `sudo apt-get install -y fonts-noto-cjk imagemagick`），以确保中文排版与图片转换正常。

## 许可协议

本书采用与原书相同的 [CC BY-NC-SA 4.0 许可协议](LICENSE)（参见[原版 LICENSE](https://gitlab.com/CLIUtils/modern-cmake/-/blob/master/LICENSE)）。

## 贡献指南

本书是一份持续维护的文档，你可以点击在线文档右上角的编辑按钮直接发起修改；受限于译者水平，不足之处敬请谅解，欢迎提出 [Issue](https://github.com/Modern-CMake-CN/Modern-CMake-zh_CN/issues) 或 [Pull Request](https://github.com/Modern-CMake-CN/Modern-CMake-zh_CN/pulls)！

- 站点首页为 `README.md`，正文导言为 `introduction.md`，各章节正文位于 `chapters/` 目录，全书目录结构在 `myst.yml` 的 `project.toc` 中维护。
- 本文档遵循[中文文案排版指南](https://github.com/sparanoid/chinese-copywriting-guidelines)（例如中英文之间、中文与数字之间保留空格，使用全角中文标点等），为确保排版美观以及风格统一，请确保贡献内容符合指南规范。

![Contributors](https://img.shields.io/github/contributors-anon/Modern-CMake-CN/Modern-CMake-zh_CN)

[![Contributors Graph](https://contrib.rocks/image?repo=Modern-CMake-CN/Modern-CMake-zh_CN&max=240&columns=18)](https://github.com/Modern-CMake-CN/Modern-CMake-zh_CN/graphs/contributors)
