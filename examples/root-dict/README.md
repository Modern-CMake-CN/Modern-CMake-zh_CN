# 字典用例

这是在 CMake 中构建包含字典模块的例子。通过 `find_package` 手动添加 ROOT，而非使用 ROOT 建议的标志。在大多数系统中，CMake 文件中唯一重要的标志。

## examples/root-dict/CMakeLists.txt

```{literalinclude} CMakeLists.txt
:start-after: [main]
:end-before: [main]
:language: cmake
```

## 支持文件

这是一个极简的类定义，只有一个成员函数：

### examples/root-dict/DictExample.cxx

```{literalinclude} DictExample.cxx
:language: cpp
```

### examples/root-dict/DictExample.h

```{literalinclude} DictExample.h
:language: cpp
```

还需要一个  `LinkDef.h`。

### examples/root-dict/DictLinkDef.h

```{literalinclude} DictLinkDef.h
:language: cpp
```

## 进行测试

这是一个宏示例，用于测试上面文件生成的结果是否正确。

### examples/root-dict/CheckLoad.C

```{literalinclude} CheckLoad.C
:language: cpp
```
