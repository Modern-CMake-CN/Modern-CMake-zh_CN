# 支持 CMake 3.15，并已测试至 4.4
cmake_minimum_required(VERSION 3.15...4.4)

# 项目名称以及一些实用的设置。其他命令可以获取这些设置的结果
project(
  ModernCMakeExample
  VERSION 0.1
  DESCRIPTION "An example project with CMake"
  LANGUAGES CXX)

# 仅当本项目作为主项目时才执行以下操作，通过 add_subdirectory 引入时不执行
if(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME)

  # 可选：在此处设置诸如 CMAKE_CXX_STANDARD、CMAKE_POSITION_INDEPENDENT_CODE 等变量

  # 确保使用 -std=c++xx 而非 -std=g++xx
  set(CMAKE_CXX_EXTENSIONS OFF)

  # 在 IDE 中友好地支持文件夹组织功能
  set_property(GLOBAL PROPERTY USE_FOLDERS ON)

  # 仅当本项目作为主应用时才启用测试
  # 注意：这必须在主 CMakeLists 中完成，
  # 因为它会调用 enable_testing，而该命令必须位于
  # 主 CMakeLists 中。
  include(CTest)

  # 仅当本项目作为主应用时才启用文档构建
  find_package(Doxygen)
  if(Doxygen_FOUND)
    add_subdirectory(docs)
  else()
    message(STATUS "Doxygen not found, not building docs")
  endif()
endif()

# FetchContent 于 CMake 3.11 引入，会在配置阶段下载内容
# FetchContent_MakeAvailable 于 CMake 3.14 引入，用法更加简便
include(FetchContent)

# 累加器库
# 这是一个纯头文件库，因此也可以替换为 Git 子模块或 FetchContent
find_package(Boost REQUIRED)
# 添加 Boost::boost 目标

# 格式化库
FetchContent_Declare(
  fmtlib
  GIT_REPOSITORY https://github.com/fmtlib/fmt.git
  GIT_TAG 5.3.0)
FetchContent_MakeAvailable(fmtlib)
# 添加 fmt::fmt 目标

# 需要编译的库代码位于此处
add_subdirectory(src)

# 可执行程序代码位于此处
add_subdirectory(apps)

# 仅当本项目作为主应用时才启用测试
# 同时也提供了用于紧急覆盖的变量 MODERN_CMAKE_BUILD_TESTING
if((CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME OR MODERN_CMAKE_BUILD_TESTING)
   AND BUILD_TESTING)
  add_subdirectory(tests)
endif()
