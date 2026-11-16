# 测试库
FetchContent_Declare(
  catch
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG v3.15.0)
FetchContent_MakeAvailable(catch)
# 添加 Catch2::Catch2 和 Catch2::Catch2WithMain 目标

# 测试需要先作为可执行程序添加
add_executable(testlib testlib.cpp)

# 在测试中使用 C++17
target_compile_features(testlib PRIVATE cxx_std_17)

# 需要链接主库以及 Catch2 测试库
target_link_libraries(testlib PRIVATE modern_library Catch2::Catch2WithMain)

# 注册测试后，ctest 和 make test 就会运行它。
# 你同样可以运行示例程序并检查其输出。
add_test(NAME testlibtest COMMAND testlib) # 命令可以是一个目标
