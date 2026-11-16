# CMake 简单示例

## [main]

# 几乎所有的 CMake 文件都应该以这行开头
# 你应当始终指定一个包含已测试的最新和最旧 CMake 版本的范围。
# 这能确保你启用最佳的 CMake 策略（policy）。
cmake_minimum_required(VERSION 3.15...4.4)

# 这是你的项目声明。你应当始终列出所使用的编程语言；
# 在这里列出版本号也很不错，因为它会自动设置许多实用的变量
project(
  ModernCMakeExample
  VERSION 1.0
  LANGUAGES CXX)

# 如果你要设置任何 CMAKE_ 变量，可以放在这里。
# （但通常不建议这样做，或许设置 C++ 标准时除外）

# 查找包（find_package）的语句放在这里。

# 通常你应该把后续内容拆分到各个子文件夹中，不过这只是一个简单示例

# 这是一个“默认”类型的库，会匹配相应的变量（BUILD_SHARED_LIBS）设置。
# 其他常见选项还有 STATIC、SHARED 和 MODULE
# 在这里把头文件一并列出有助于 IDE 识别，但并非必需。
# 输出的库文件名与目标名一致，并带有当前系统上的常规扩展名
add_library(MyLibExample simple_lib.cpp simple_lib.hpp)

# 将各个目标与其他目标进行链接，或添加编译选项等。

# 添加一个可运行的程序 —— 输出文件名与目标名一致
add_executable(MyExample simple_example.cpp)

# 请确保使用此命令来链接你的目标。它也可以链接库甚至编译标志，
# 因此链接一个不存在的目标不会在配置阶段报错。
target_link_libraries(MyExample PRIVATE MyLibExample)

## [main]

# 这部分是为了让 Modern CMake 教程验证该示例能够正常构建。
# 对于你自己的代码，大概也会希望添加测试
enable_testing()
add_test(NAME MyExample COMMAND MyExample)
