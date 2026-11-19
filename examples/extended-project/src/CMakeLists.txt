# 注意：头文件是可选的，不会影响 add_library 的编译行为；
# 但如果不将它们列在 add_library 中，它们将不会显示在 IDE 中。

# 可选：使用通配符（glob）匹配头文件，但仅限 CMake 3.12 及更高版本：
# file(GLOB HEADER_LIST CONFIGURE_DEPENDS "${ModernCMakeExample_SOURCE_DIR}/include/modern/*.hpp")
set(HEADER_LIST "${ModernCMakeExample_SOURCE_DIR}/include/modern/lib.hpp")

# 创建一个自动类型的库 —— 根据用户设置决定生成静态库还是动态库
add_library(modern_library lib.cpp ${HEADER_LIST})

# 本库需要该包含目录，并且使用本库的用户也同样需要它
target_include_directories(modern_library PUBLIC ../include)

# 本库依赖于（纯头文件的）Boost
target_link_libraries(modern_library PRIVATE Boost::boost)

# 本库的所有使用者至少需要启用 C++11
target_compile_features(modern_library PUBLIC cxx_std_11)

# 让 IDE 将头文件归类到合适的位置
source_group(
  TREE "${PROJECT_SOURCE_DIR}/include"
  PREFIX "Header Files"
  FILES ${HEADER_LIST})
