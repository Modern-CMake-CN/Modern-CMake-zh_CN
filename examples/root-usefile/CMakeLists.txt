# CMake ROOT UseFile 示例

## [main]
cmake_minimum_required(VERSION 3.15...4.4)

project(RootUseFileExample LANGUAGES CXX)

find_package(ROOT 6.16 CONFIG REQUIRED)

## [core]
# 配置全局设置
include("${ROOT_USE_FILE}")

# ROOT < 6.16 版本需要此行
# string(REPLACE "-L " "-L" ROOT_EXE_LINKER_FLAGS "${ROOT_EXE_LINKER_FLAGS}")

# 当存在多个链接标志时（例如在 macOS 上），需要执行此步骤
separate_arguments(ROOT_EXE_LINKER_FLAGS)

add_executable(RootUseFileExample SimpleExample.cxx)
target_link_libraries(RootUseFileExample PUBLIC ${ROOT_LIBRARIES}
                                                ${ROOT_EXE_LINKER_FLAGS})
## [core]

## [main]

enable_testing()
add_test(NAME RootUseFileExample COMMAND RootUseFileExample)
