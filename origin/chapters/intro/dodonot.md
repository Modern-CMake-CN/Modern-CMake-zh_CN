# Do's and Don'ts

## CMake Antipatterns

The next two lists are heavily based on the excellent gist [Effective Modern CMake]. That list is much longer and more detailed, feel free to read it as well.

* **Do not use global functions**: This includes `link_directories`, `include_libraries`, and similar.
* **Don't add unneeded PUBLIC requirements**: You should avoid forcing something on users that is not required (`-Wall`). Make these PRIVATE instead.
* **Don't GLOB files**: Make or another tool will not know if you add files without rerunning CMake. Note that CMake 3.12 adds a `CONFIGURE_DEPENDS` flag that makes this far better if you need to use it.
* **Link to built files directly**: Always link to targets if available.
* **Never skip PUBLIC/PRIVATE when linking**: This causes all future linking to be keyword-less.


## CMake Patterns

* **Treat CMake as code**: It is code. It should be as clean and readable as all other code.
* **Think in targets**: Your targets should represent concepts. Make an (IMPORTED) INTERFACE target for anything that should stay together and link to that.
* **Export your interface**: You should be able to run from build or install.
* **Write a Config.cmake file**: This is what a library author should do to support clients.
* **Make ALIAS targets to keep usage consistent**: Using `add_subdirectory` and `find_package` should provide the same targets and namespaces.
* **Combine common functionality into clearly documented functions or macros**: Functions are better usually.
* **Use lowercase function names**: CMake functions and macros can be called lower or upper case. Always use lower case. Upper case is for variables.
* **Use `cmake_policy` and/or range of versions**: Policies change for a reason. Only piecemeal set OLD policies if you have to.




[Effective Modern CMake]: https://gist.github.com/mbinna/c61dbb39bca0e4fb7d1f73b0d66a4fd1
