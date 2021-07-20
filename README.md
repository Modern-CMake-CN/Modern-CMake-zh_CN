# An Introduction to Modern CMake

People love to hate build systems.
Just watch the talks from CppCon17 to see examples of developers making the state of build systems the brunt of jokes.
This raises the question: Why?
Certainly there are no shortage of problems when building.
But I think that, in 2020, we have a very good solution to quite a few of those problems.
It's CMake. Not CMake 2.8 though; that was released before C++11 even existed!
Nor the horrible examples out there for CMake (even those posted on KitWare's own tutorials list).
I'm talking about Modern CMake. CMake 3.4+, maybe even CMake 3.21+!
It's clean, powerful, and elegant, so you can spend most of your time coding, not adding lines to an unreadable, unmaintainable Make (Or CMake 2) file.
And CMake 3.11+ is supposed to be significantly faster, as well!


{% hint style='working' %}
This book is meant to be a living document. You can raise an issue or put in a merge request on [GitLab](https://gitlab.com/CLIUtils/modern-cmake).
You can also [download a copy as a PDF](https://CLIUtils.gitlab.io/modern-cmake/modern-cmake.pdf). Be sure to check the [HSF CMake Training][], as well!
{% endhint %}

In short, here are the most likely questions in your mind if you are considering Modern CMake:

## Why do I need a good build system?

Do any of the following apply to you?

* You want to avoid hard-coding paths
* You need to build a package on more than one computer
* You want to use CI (continuous integration)
* You need to support different OSs (maybe even just flavors of Unix)
* You want to support multiple compilers
* You want to use an IDE, but maybe not all of the time
* You want to describe how your program is structured logically, not flags and commands
* You want to use a library
* You want to use tools, like Clang-Tidy, to help you code
* You want to use a debugger

If so, you'll benefit from a CMake-like build system.

## Why must the answer be CMake?

Build systems is a hot topic. Of course there are many options. But even a really good one, or one that re-uses a familiar syntax, can't come close to CMake.
Why?
Support.
Every IDE supports CMake (or CMake supports that IDE).
More packages use CMake than any other system.
So, if you use a library that is designed to be included in your code, you have a choice: Make your own build system, or use one of the provided ones, and that will almost always include CMake.
And that will quickly be the common denominator if you include multiple projects.
And, if you need a library that's preinstalled, the chances of it having a find CMake script or config CMake script are excellent.


## Why use a Modern CMake?

Around CMake 2.6-2.8, CMake started taking over. It was in most of the package managers for Linux OS's, and was being used in lots of packages.

Then Python 3 came out.

I know, this should have nothing whatsoever to do with CMake.

But it had a 3.
And it followed 2.
And it was a hard, ugly, transition that is still ongoing in some places, even today.

I believe that CMake 3 had the bad luck to follow Python 3.[^1]
Even though every version of CMake is insanely backward compatible, the 3 series was treated as if it were something new.
And so, you'll find OSs like CentOS7 with GCC 4.8, with almost-complete C++14 support, and CMake 2.8, which came out years before C++11.

You really should *at least* use a version of CMake that came out after your compiler, since it needs to know compiler flags, etc, for that version.
And, since CMake will dumb itself down to the minimum required version in your CMake file, installing a new CMake, even system wide, is pretty safe.
You should *at least* install it locally.
It's easy (1-2 lines in many cases), and you'll find that 5 minutes of work will save you hundreds of lines and hours of `CMakeLists.txt` writing, and will be much easier to maintain in the long run.

This book tries to solve the problem of the poor examples and best practices that you'll find proliferating the web.

## Other sources

Other material from the original author of this book:

* [HSF CMake Training][]
* [Interactive Modern CMake talk](https://gitlab.com/CLIUtils/modern-cmake-interactive-talk)

There are some other places to find good information on the web. Here are some of them:

* [The official help](https://cmake.org/cmake/help/latest/): Really amazing documentation. Nicely organized, great search, and you can toggle versions at the top. It just doesn't have a great "best practices tutorial", which is what this book tries to fill in.
* [Effective Modern CMake](https://gist.github.com/mbinna/c61dbb39bca0e4fb7d1f73b0d66a4fd1): A great list of do's and don'ts.
* [Embracing Modern CMake](https://steveire.wordpress.com/2017/11/05/embracing-modern-cmake/): A post with good description of the term
* [It's time to do CMake Right](https://pabloariasal.github.io/2018/02/19/its-time-to-do-cmake-right/): A nice set of best practices for Modern CMake projects.
* [The Ultimate Guide to Modern CMake](https://rix0r.nl/blog/2015/08/13/cmake-guide/): A slightly dated post with similar intent.
* [More Modern CMake](https://youtu.be/y7ndUhdQuU8): A great presentation from Meeting C++ 2018 that recommends CMake 3.12+. This talk makes calls CMake 3.0+ "Modern CMake" and CMake 3.12+ "More Modern CMake".
* [Oh No! More Modern CMake](https://www.youtube.com/watch?v=y9kSr5enrSk): The sequel to More Modern CMake.
* [toeb/moderncmake](https://github.com/toeb/moderncmake): A nice presentation and examples about CMake 3.5+, with intro to syntax through project organization

## Credits

Modern CMake was originally written by [Henry Schreiner](https://iscinumpy.gitlab.io). Other contributors can be found [listed on GitLab](https://gitlab.com/CLIUtils/modern-cmake/-/network/master).

[HSF CMake Training]: https://hsf-training.github.io/hsf-training-cmake-webpage/01-intro/index.html

[^1]: CMake 3.0 also removed several long deprecated features from very old versions of CMake and make one very tiny backwards incompatible change to syntax related to square brackets, so this is not entirely fair; there might be some very, very old CMake files that would stop working with 3. I've never seen one, though.
