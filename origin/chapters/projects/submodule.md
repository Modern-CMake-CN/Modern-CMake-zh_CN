# Git Submodule Method

If you want to add a Git repository on the same service (GitHub, GitLab, BitBucket, etc), the following is the correct Git command to set that up as a submodule in the `extern` directory:

```term
gitbook $ git submodule add ../../owner/repo.git extern/repo
```

The relative path to the repo is important; it allows you to keep the same access method (ssh or https) as the parent repository. This works very well in most ways. When you are inside the submodule, you can treat it just like a normal repo, and when you are in the parent repository, you can "add" to change the current commit pointer.

But the traditional downside is that you either have to have your users know git submodule commands, so they can `init` and `update` the repo, or they have to add `--recursive` when they initially clone your repo. CMake can offer a solution:

```cmake
find_package(Git QUIET)
if(GIT_FOUND AND EXISTS "${PROJECT_SOURCE_DIR}/.git")
# Update submodules as needed
    option(GIT_SUBMODULE "Check submodules during build" ON)
    if(GIT_SUBMODULE)
        message(STATUS "Submodule update")
        execute_process(COMMAND ${GIT_EXECUTABLE} submodule update --init --recursive
                        WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
                        RESULT_VARIABLE GIT_SUBMOD_RESULT)
        if(NOT GIT_SUBMOD_RESULT EQUAL "0")
            message(FATAL_ERROR "git submodule update --init --recursive failed with ${GIT_SUBMOD_RESULT}, please checkout submodules")
        endif()
    endif()
endif()

if(NOT EXISTS "${PROJECT_SOURCE_DIR}/extern/repo/CMakeLists.txt")
    message(FATAL_ERROR "The submodules were not downloaded! GIT_SUBMODULE was turned off or failed. Please update submodules and try again.")
endif()
```

The first line checks for Git using CMake's built in `FindGit.cmake`. Then, if you are in a git checkout of your source, add an option (defaulting to `ON`) that allows developers to turn off the feature if they need to. We then run the command to get all repositories, and fail if that command fails, with a nice error message. Finally, we verify that the repositories exist before continuing, regardless of the method used to obtain them. You can use `OR` to list several.

Now, your users can be completely oblivious to the existence of the submodules, and you can still keep up good development practices! The only thing to watch out for is for developers; you will reset the submodule when you rerun CMake if you are developing inside the submodule. Just add new commits to the parent staging area, and you'll be fine.

You can then include projects that provide good CMake support:

```cmake
add_subdirectory(extern/repo)
```

Or, you can build an interface library target yourself if it is a header only project. Or, you can use `find_package` if that is supported, probably preparing the initial search directory to be the one you've added (check the docs or the file for the `Find*.cmake` file you are using). You can also include a CMake helper file directory if you append to your `CMAKE_MODULE_PATH`, for example to add `pybind11`'s improved `FindPython*.cmake` files.


### Bonus: Git version number

Move this to Git section:

```cmake
execute_process(COMMAND ${GIT_EXECUTABLE} rev-parse --short HEAD
                WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}"
                OUTPUT_VARIABLE PACKAGE_GIT_VERSION
                ERROR_QUIET
                OUTPUT_STRIP_TRAILING_WHITESPACE)
```
