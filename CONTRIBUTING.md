# 贡献指南

感谢你参与 Modern CMake 简体中文版的维护。提交贡献即表示你同意以本项目的[许可协议](LICENSE)发布相关内容。

## 内容与翻译

- `README.md` 是站点首页，`introduction.md` 是正文导言，`chapters/` 保存中文章节，`myst.yml` 的 `project.toc` 定义目录。
- `origin/` 保存英文上游快照；同步时记录对应的提交，并对照原稿更新中文正文与示例。
- 代码块及 `examples/` 中用于讲解的注释也需要翻译。保留命令、变量名、路径、目标名、Doxygen 标签及代码引用锚点（例如 `## [main]`）。
- 使用标准 Markdown 链接和 MyST 提示框、`literalinclude` 指令。排版遵循[中文文案排版指南](https://github.com/sparanoid/chinese-copywriting-guidelines)。

## 构建与验证

安装 [Pixi](https://pixi.sh/) 后，在仓库根目录执行：

```bash
# 按锁文件安装文档构建环境
pixi install --locked -e build

# 启动本地预览
pixi run serve

# 构建 HTML 与 PDF
pixi run build
pixi run pdf

# 配置、构建并测试全部示例（包含 ROOT，首次安装环境较大）
pixi run test
```

Linux 导出中文 PDF 需要中文字体，例如 `fonts-noto-cjk`。HTML 输出到 `_build/html/`，PDF 输出到 `_build/pdf/modern-cmake.pdf`。这些生成文件不应提交到 Git。

## 持续集成与发布

GitHub Actions 在推送到 `master` 或 `sync-upstream`、向 `master` 提交拉取请求及手动触发时运行，验证三个不依赖 ROOT 的示例并构建 HTML 与 PDF。PDF 作为构建产物提供下载；包含 ROOT 的全部示例可在本地通过 `pixi run test` 验证。

只有 `master` 推送或手动运行才会将站点发布到 `gh-pages`，使用仓库自带的 `GITHUB_TOKEN`，无需个人访问令牌。Fork 需要在自己的仓库中启用 Actions；如需发布站点，还需在 Pages 设置中选择从 `gh-pages` 分支根目录发布。站点子路径由仓库名自动生成。
